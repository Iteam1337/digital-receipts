#!/bin/env bash
# cd ..
# docker build -f ca/Dockerfile -t digitalreceipts/ca .
# docker push digitalreceipts/ca

# docker build -f hash-registry/Dockerfile -t digitalreceipts/hash-registry .
# docker push digitalreceipts/hash-registry

# docker build -f shop/Dockerfile -t digitalreceipts/shop .
# docker push digitalreceipts/shop

# docker build -f user-accounting/Dockerfile -t digitalreceipts/user-accounting .
# docker push digitalreceipts/user-accounting

# docker build -f user-email/Dockerfile -t digitalreceipts/user-email .
# docker push digitalreceipts/user-email


PROJECT_PATH=$1
PROJECT="digitalreceipts/${PROJECT_PATH/examples\/poc\//}"
echo "$PROJECT is being built"
echo "Path $PROJECT_PATH is being built"
cd $PROJECT_PATH

docker build -t $PROJECT .
docker push $PROJECT