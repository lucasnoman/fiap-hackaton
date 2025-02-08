variable "lab_role" {
  type        = string
  description = "ARN of the role to use for the Lambda function."
}

variable "ecs_cluster_name" {
  type        = string
  description = "Name of the ECS cluster."
}

variable "api_image_uri" {
  type        = string
  description = "URI for the API container image in ECR."
}

variable "api_container_port" {
  type        = number
  description = "Port of the API container."
}

variable "postgres_image_uri" {
  type        = string
  description = "URI for the PostgreSQL container image in ECR."
}

variable "postgres_db_name" {
  type        = string
  description = "The PostgreSQL database name."
}

variable "postgres_user" {
  type        = string
  description = "The PostgreSQL username."
}

variable "postgres_password" {
  type        = string
  description = "The PostgreSQL user's password."
}

variable "postgres_efs_id" {
  type        = string
  description = "ID of the EFS file system for the PostgreSQL service."
}


# Network and security variables for ECS services
variable "public_subnets" {
  type        = list(string)
  description = "Public subnets for the API service."
}

variable "private_subnets" {
  type        = list(string)
  description = "Private subnets for the PostgreSQL service."
}

variable "api_alb_sg_ids" {
  type        = list(string)
  description = "Security groups for the API Application Load Balancer."
}

variable "api_service_sg_ids" {
  type        = list(string)
  description = "Security groups for the API ECS service."
}

variable "postgres_service_sg_ids" {
  type        = list(string)
  description = "Security groups for the PostgreSQL ECS service."
}

variable "vpc_id" {
  type        = string
  description = "VPC ID where ECS services and ALB are deployed."
}
