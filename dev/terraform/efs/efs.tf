resource "aws_efs_file_system" "postgres_efs" {
  creation_token = "fiap-hackaton-postgres-efs"
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_efs_mount_target" "postgres_mount" {
  file_system_id  = aws_efs_file_system.postgres_efs.id
  subnet_id       = var.private_subnets[0]
  security_groups = var.postgres_service_sg_ids
}
