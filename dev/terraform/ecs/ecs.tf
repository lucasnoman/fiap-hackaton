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
  task_role_arn            = var.lab_role
  container_definitions = jsonencode([
    {
      name  = "api"
      image = var.api_image_uri
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = "/ecs/api-task"
          "awslogs-region"        = var.aws_region
          "awslogs-stream-prefix" = "ecs"
        }
      }
      portMappings = [
        {
          containerPort = var.api_container_port,
          hostPort      = var.api_container_port,
          protocol      = "tcp"
        }
      ],
      environment = [
        {
          name  = "NODE_ENV"
          value = "production"
        },
        {
          name  = "DATABASE_URL"
          value = "postgresql://${var.postgres_user}:${var.postgres_password}@${var.postgres_endpoint}/${var.postgres_db_name}"
        },
        {
          name  = "PORT"
          value = tostring(var.api_container_port)
        },
        {
          name  = "AWS_REGION"
          value = "${var.aws_region}"
        },
        {
          name  = "SQS_QUEUE_NAME",
          value = "${var.sqs_frame_extractor_url}"
        },
        {
          name  = "AWS_PROFILE",
          value = "default"
        }
      ],
      essential = true
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
    enabled             = true
    healthy_threshold   = 2
    unhealthy_threshold = 10
    timeout             = 60
    interval            = 300
    matcher             = "200,301,302"
    path                = "/health"
    protocol            = "HTTP"
  }
}

resource "aws_lb_listener" "api_listener" {
  load_balancer_arn = aws_lb.api_alb.arn
  port              = 80
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


resource "aws_cloudwatch_log_group" "api_logs" {
  name              = "/ecs/api-task"
  retention_in_days = 30
}
