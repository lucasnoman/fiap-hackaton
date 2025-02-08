variable "postgres_service_sg_ids" {
  type        = list(string)
  description = "Security groups for the PostgreSQL ECS service."
}

variable "private_subnets" {
  type        = list(string)
  description = "Private subnets for the PostgreSQL service."
}
