#!/bin/bash

BASEDIR=$(dirname "$0")

# Go for repo root
cd $BASEDIR/..

DOCKERACC="solacens"
DOCKERREPO="2w5u6z2kt"

docker login --username $DOCKERACC
docker build -t $DOCKERACC/$DOCKERREPO:latest .
docker push $DOCKERACC/$DOCKERREPO:latest
