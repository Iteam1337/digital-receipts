#!/bin/env bash
cd ca
docker build -t digitalreceipts/ca .
cd ../hash-registry
docker build -t digitalreceipts/hash-registry .
cd ../shop
docker build -t digitalreceipts/shop .
cd ../user-accounting
docker build -t digitalreceipts/user-accounting .
cd ../user-email
docker build -t digitalreceipts/user-email .
