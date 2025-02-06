@echo off
setlocal

set AWS_ACCESS_KEY_ID=***
set AWS_SECRET_ACCESS_KEY=***
set AWS_SESSION_TOKEN=***
set AWS_DEFAULT_REGION=us-east-1

cd terraform
terraform apply -auto-approve
cd ..

endlocal
