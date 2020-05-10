#!/bin/bash

BASEDIR=$(dirname "$0")

# Go for repo root
cd $BASEDIR

DOCKERACC="solacens"
DOCKERREPO="wnaoh9h5a"

docker login --username $DOCKERACC
docker build -t $DOCKERACC/$DOCKERREPO:latest .
docker push $DOCKERACC/$DOCKERREPO:latest
