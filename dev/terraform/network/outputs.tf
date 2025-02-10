output "vpc_id" {
  value = aws_vpc.main.id
}

output "public_subnets" {
  value = aws_subnet.public[*].id
}

output "private_subnets" {
  value = aws_subnet.private[*].id
}

output "api_alb_sg_id" {
  value = aws_security_group.api_alb_sg.id
}

output "api_service_sg_id" {
  value = aws_security_group.api_service_sg.id
}

output "postgres_service_sg_id" {
  value = aws_security_group.postgres_service_sg.id
}
