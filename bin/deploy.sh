#!/bin/env bash

curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x ./kubectl
mv ./kubectl /usr/local/bin/kubectl

deployment=$1
if [[ $1 == *"examples/poc"* ]]; then
  deployment="${1/examples\/poc\//}"
  if [[ $1 == *"examples/poc/hash-registry"* ]]; then
  deployment="hash-registry-poc"
  fi;
fi

echo "$deployment is being deployed"

kubectl --server=$KUBERNETES_SERVER --token=$KUBERNETES_TOKEN --insecure-skip-tls-verify=true scale deployment/$deployment --replicas=0
kubectl --server=$KUBERNETES_SERVER --token=$KUBERNETES_TOKEN --insecure-skip-tls-verify=true scale deployment/$deployment --replicas=1
