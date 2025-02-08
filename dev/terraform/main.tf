terraform {
  required_version = ">= 1.3.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  # Fake credentials just to satisfy Terraform requirements.
  #   access_key                  = "test"
  #   secret_key                  = "test"
  region = var.aws_region
  #   profile = "default"



  #   skip_credentials_validation = true
  #   skip_metadata_api_check     = true
  #   skip_requesting_account_id  = true
  #   s3_use_path_style           = true

  # LocalStack endpoints
  #   endpoints {
  #     s3             = var.localstack_endpoint
  #     sqs            = var.localstack_endpoint
  #     lambda         = var.localstack_endpoint
  #     iam            = var.localstack_endpoint
  #     ecr            = var.localstack_endpoint
  #     # If you need more services (e.g., CloudWatch, CloudFormation),
  #     # list them here with the same LocalStack endpoint
  #   }
}


resource "random_string" "bucket_suffix" {
  length  = 8
  special = false
  upper   = false
}


resource "aws_s3_bucket" "files" {
  bucket = "${var.s3_bucket_name}-${random_string.bucket_suffix.result}"


  # LocalStack does not strictly require these but will accept them.
  versioning {
    enabled = true
  }
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}


resource "aws_sqs_queue" "queue" {
  name = var.sqs_name

  # Adjust these for your testing preferences
  visibility_timeout_seconds = 30
  message_retention_seconds  = 86400
}

resource "aws_sqs_queue" "completion_queue" {
  name = "${var.sqs_name}-completion"

  visibility_timeout_seconds = 30
  message_retention_seconds  = 86400
}
resource "aws_lambda_permission" "allow_sqs_send_message" {
  statement_id  = "AllowSQSSendMessage"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.lambda_docker.function_name
  principal     = "sqs.amazonaws.com"
  source_arn    = aws_sqs_queue.completion_queue.arn
}

# data "aws_iam_policy_document" "lambda_assume_role" {
#   statement {
#     actions = ["sts:AssumeRole"]
#     principals {
#       type        = "Service"
#       identifiers = ["lambda.amazonaws.com"]
#     }
#   }
# }

# resource "aws_iam_role" "lambda_exec" {
#   name               = "${var.lambda_name}-exec-role"
#   assume_role_policy = data.aws_iam_policy_document.lambda_assume_role.json
# }

# # Attach the AWSLambdaBasicExecutionRole policy (simulated in LocalStack)
# resource "aws_iam_role_policy_attachment" "lambda_basic_execution_attachment" {
#   role       = aws_iam_role.lambda_exec.name
#   policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
# }

# Additional permissions if your Lambda needs to read/write from S3
# data "aws_iam_policy_document" "lambda_s3_access" {
#   statement {
#     effect = "Allow"
#     actions = [
#       "s3:GetObject",
#       "s3:ListBucket",
#       "s3:PutObject"
#     ]
#     resources = [
#       aws_s3_bucket.files.arn,
#       "${aws_s3_bucket.files.arn}/*"
#     ]
#   }
# }

# resource "aws_iam_policy" "lambda_s3_policy" {
#   name   = "${var.lambda_name}-s3-policy"
#   policy = data.aws_iam_policy_document.lambda_s3_access.json
# }

# resource "aws_iam_role_policy_attachment" "lambda_s3_policy_attachment" {
#   role       = aws_iam_role.lambda_exec.name
#   policy_arn = aws_iam_policy.lambda_s3_policy.arn
# }


resource "aws_lambda_function" "lambda_docker" {
  function_name = var.lambda_name
  package_type  = "Image"
  image_uri     = var.lambda_image_uri
  #   role          = aws_iam_role.lambda_exec.arn
  role = var.lab_role

  # In real AWS, you can set memory, timeout, environment, etc.
  # LocalStack does not enforce all these the same way, but it's good to keep them:
  memory_size = 1024
  timeout     = 60

  # For container-based Lambdas, you might need the Pro version of LocalStack.
  # The following is optional if your Docker image's entrypoint is set.
  image_config {
    command     = []
    entry_point = []
  }
}

resource "aws_lambda_event_source_mapping" "lambda_sqs_mapping" {
  event_source_arn = aws_sqs_queue.queue.arn
  function_name    = aws_lambda_function.lambda_docker.arn
  enabled          = true

  # Adjust if needed
  batch_size = 10
}

module "network" {
  source = "./network"

  api_container_port = var.api_container_port
}

module "rds" {
  source = "./rds"

  vpc_id          = module.network.vpc_id
  private_subnets = module.network.private_subnets
  db_name         = var.postgres_db_name
  db_username     = var.postgres_user
  db_password     = var.postgres_password
}

module "ecs" {
  source = "./ecs"

  ecs_cluster_name        = var.ecs_cluster_name
  lab_role                = var.lab_role
  api_image_uri           = var.api_image_uri
  api_container_port      = var.api_container_port
  public_subnets          = module.network.public_subnets
  private_subnets         = module.network.private_subnets
  api_alb_sg_ids          = [module.network.api_alb_sg_id]
  api_service_sg_ids      = [module.network.api_service_sg_id]
  vpc_id                  = module.network.vpc_id
  postgres_endpoint       = module.rds.db_endpoint
  postgres_db_name        = var.postgres_db_name
  postgres_user           = var.postgres_user
  postgres_password       = var.postgres_password
  aws_region              = var.aws_region
  sqs_frame_extractor_url = aws_sqs_queue.queue.url
}

output "bucket_name" {
  description = "Name of the LocalStack S3 bucket"
  value       = aws_s3_bucket.files.bucket
}

output "lambda_name" {
  description = "Name of the Docker-based Lambda function"
  value       = aws_lambda_function.lambda_docker.function_name
}

output "sqs_queue_url" {
  description = "URL of the SQS queue"
  value       = aws_sqs_queue.queue.url
}
