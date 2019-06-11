#!/bin/env bash

curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
mv ./kubectl /usr/local/bin/kubectl

if [[ $1 == *"examples/poc"* ]]; then
  PROJECT_PATH="${1/examples\/poc\//}"
  echo "$PROJECT_PATH is being deployed"
  if [[ $1 == *"examples/poc/hash-registry"* ]]; then
  echo "hash-registry-poc is being deployed"
  fi
else
  echo "$1 is being deployed"
fi
