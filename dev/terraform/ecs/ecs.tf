# ECS Cluster
resource "aws_ecs_cluster" "app_cluster" {
  name = var.ecs_cluster_name
}

# Task definition for API container
resource "aws_ecs_task_definition" "api_task" {
  family                   = "api-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.lab_role
  container_definitions = jsonencode([
    {
      name  = "api"
      image = var.api_image_uri
      portMappings = [
        {
          containerPort = var.api_container_port, # e.g., 80
          hostPort      = var.api_container_port,
          protocol      = "tcp"
        }
      ],
      essential = true
    }
  ])
}

# Task definition for PostgreSQL container
resource "aws_ecs_task_definition" "postgres_task" {
  family                   = "postgres-task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
  execution_role_arn       = var.lab_role

  volume {
    name = "postgres-data"
    efs_volume_configuration {
      file_system_id     = var.postgres_efs_id
      transit_encryption = "ENABLED"
    }
  }

  container_definitions = jsonencode([
    {
      name  = "postgres"
      image = var.postgres_image_uri
      portMappings = [
        {
          containerPort = 5432,
          hostPort      = 5432,
          protocol      = "tcp"
        }
      ],
      essential = true,
      environment = [
        {
          name  = "POSTGRES_DB",
          value = var.postgres_db_name
        },
        {
          name  = "POSTGRES_USER",
          value = var.postgres_user
        },
        {
          name  = "POSTGRES_PASSWORD",
          value = var.postgres_password
        }
      ],
      mountPoints = [
        {
          sourceVolume  = "postgres-data"
          containerPath = "/var/lib/postgresql/data"
          readOnly      = false
        }
      ]
    }
  ])
}

# Application Load Balancer for API
resource "aws_lb" "api_alb" {
  name               = "api-alb"
  internal           = false
  load_balancer_type = "application"
  subnets            = var.public_subnets
  security_groups    = var.api_alb_sg_ids
}

resource "aws_lb_target_group" "api_tg" {
  name        = "api-tg"
  port        = var.api_container_port
  protocol    = "HTTP"
  vpc_id      = var.vpc_id
  target_type = "ip"
  health_check {
    path     = "/"
    protocol = "HTTP"
  }
}

resource "aws_lb_listener" "api_listener" {
  load_balancer_arn = aws_lb.api_alb.arn
  port              = var.api_container_port
  protocol          = "HTTP"
  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.api_tg.arn
  }
}

# ECS Service for API using Fargate Spot on public subnets
resource "aws_ecs_service" "api_service" {
  name            = "api-service"
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.api_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.public_subnets
    assign_public_ip = true
    security_groups  = var.api_service_sg_ids
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.api_tg.arn
    container_name   = "api"
    container_port   = var.api_container_port
  }
}

# ECS Service for PostgreSQL on private subnets
resource "aws_ecs_service" "postgres_service" {
  name            = "postgres-service"
  cluster         = aws_ecs_cluster.app_cluster.id
  task_definition = aws_ecs_task_definition.postgres_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = var.private_subnets
    assign_public_ip = false
    security_groups  = var.postgres_service_sg_ids
  }
}
