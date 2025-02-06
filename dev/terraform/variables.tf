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
