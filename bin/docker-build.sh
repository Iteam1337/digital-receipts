#!/bin/env bash
cd ca
docker build -t digitalreceipts/ca .
docker push digitalreceipts/ca
cd ../hash-registry
docker build -t digitalreceipts/hash-registry .
docker push digitalreceipts/hash-registry
cd ../shop
docker build -t digitalreceipts/shop .
docker push digitalreceipts/shop
cd ../user-accounting
docker build -t digitalreceipts/user-accounting .
docker push digitalreceipts/user-accounting
cd ../user-email
docker build -t digitalreceipts/user-email .
docker push digitalreceipts/user-email
