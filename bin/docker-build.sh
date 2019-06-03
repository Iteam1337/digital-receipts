#!/bin/env bash

if [[ $1 == *"examples/poc"* ]]; then
  PROJECT_PATH="${1/examples\/poc\//}"
  DOCKER_REPO="digitalreceipts/${PROJECT_PATH/examples\/poc\//}";
  echo "$DOCKER_REPO is being built"
  cd examples/poc
  docker build -f $PROJECT_PATH/Dockerfile -t $DOCKER_REPO .
else
  cd $1
  DOCKER_REPO="digitalreceipts/$1";
  echo "$DOCKER_REPO is being built"
  docker build -t $DOCKER_REPO .
fi

docker push $DOCKER_REPO
