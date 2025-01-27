variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "AWS region (used by LocalStack emulation)."
}

variable "localstack_endpoint" {
  type        = string
  default     = "http://localhost:4566"
  description = "Endpoint for LocalStack."
}

variable "lambda_image_uri" {
  type        = string
  default     = "000000000000.dkr.ecr.localhost.localstack.cloud:4566/frame-extractor-lambda:latest"
  description = "Local ECR repo for the container image (LocalStack Pro needed)."
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
