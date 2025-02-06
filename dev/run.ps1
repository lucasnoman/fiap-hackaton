
$devPath = "dev\localstack"
$currentLocation = Get-Location

if ($currentLocation.Path -notlike "*$devPath*") {
    Set-Location -Path $devPath
}

$containerRunner = "podman"

if (-not (Get-Command podman -ErrorAction SilentlyContinue)) {
    $containerRunner = "docker"
}

if (-not (Get-Command $containerRunner -ErrorAction SilentlyContinue)) {
    Write-Host "Please install podman or docker"
    exit
}

if (-not (Test-Path -Path "./volume")) {
    New-Item -ItemType Directory -Path "./volume"
}

& $containerRunner compose up -d

Set-Location -Path "./terraform"

terraform apply -auto-approve

Set-Location -Path $currentLocation
