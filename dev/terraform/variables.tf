variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region (used by LocalStack emulation)."
}

variable "lab_role" {
  type        = string
  default     = "arn:aws:iam::979415506381:role/LabRole"
  description = "ARN of the role to use for the Lambda function."
}

variable "localstack_endpoint" {
  type        = string
  default     = "http://localhost:4566"
  description = "Endpoint for LocalStack."
}

variable "lambda_image_uri" {
  type        = string
  default     = "979415506381.dkr.ecr.us-east-1.amazonaws.com/fiap-hackaton/lambda:latest"
  description = "The URI of the registry to use for the Lambda function."
}

variable "lambda_name" {
  type        = string
  default     = "frame-extractor-lambda"
  description = "Name for the Docker-based Lambda function."
}

variable "s3_bucket_name" {
  type        = string
  default     = "frame-extractor-bucket-210932"
  description = "Base name for the S3 bucket (a random suffix is appended)."
}

variable "sqs_name" {
  type        = string
  default     = "frame-extractor-queue"
  description = "Name for the SQS queue."
}

variable "ecs_cluster_name" {
  type        = string
  default     = "fiap-hackaton-cluster"
  description = "Name of the ECS cluster."
}

variable "api_image_uri" {
  type        = string
  default     = "979415506381.dkr.ecr.us-east-1.amazonaws.com/fiap-hackaton/api:latest"
  description = "URI for the API container image in ECR."
}

variable "api_container_port" {
  type        = number
  default     = 3000
  description = "Port of the API container."
}

variable "postgres_image_uri" {
  type        = string
  default     = "public.ecr.aws/docker/library/postgres:13"
  description = "URI for the PostgreSQL container image in ECR."
}

variable "postgres_db_name" {
  type        = string
  default     = "fiaphackaton"
  description = "The PostgreSQL database name."
}

variable "postgres_user" {
  type        = string
  default     = "fiaphackaton"
  description = "The PostgreSQL username."
}

variable "postgres_password" {
  type        = string
  default     = "our-strong-password-1205132"
  description = "The PostgreSQL user's password."
}

variable "jwt_secret" {
  type        = string
  default     = "our-strong-jwt-secret-1205132"
  description = "The secret to use for JWT tokens."
}
