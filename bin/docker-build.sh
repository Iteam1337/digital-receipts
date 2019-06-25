#!/bin/env bash

docker login -u "$DOCKER_USER" -p "$DOCKER_PASSWORD"
tag="latest"

if [[ $1 == *"examples/poc"* ]]; then
  PROJECT_PATH="${1/examples\/poc\//}"
  DOCKER_REPO="digitalreceipts/${PROJECT_PATH/examples\/poc\//}";
  echo "$DOCKER_REPO is being built"
  cd examples/poc
  if [[ $1 == *"examples/poc/hash-registry"* ]]; then
  tag="poc"
  fi
  docker build -f $PROJECT_PATH/Dockerfile -t $DOCKER_REPO:$tag .
  docker build -t digitalreceipts/frontpage .
  docker push digitalreceipts/frontpage
else
  cd $1
  DOCKER_REPO="digitalreceipts/$1";
  echo "$DOCKER_REPO is being built"
  docker build -t $DOCKER_REPO:$tag .
fi

docker push $DOCKER_REPO:$tag
docker logout