#!/bin/bash

devPath="dev/localstack"
currentLocation=$(pwd)

if [[ "$currentLocation" != *"$devPath"* ]]; then
    cd "$devPath"
fi

containerRunner="podman"

if ! command -v podman &> /dev/null; then
    containerRunner="docker"
fi

if ! command -v $containerRunner &> /dev/null; then
    echo "Please install podman or docker"
    exit 1
fi

if [ ! -d "./volume" ]; then
    mkdir "./volume"
fi

$containerRunner compose up -d

cd "./terraform"

terraform apply -auto-approve

cd "$currentLocation"
