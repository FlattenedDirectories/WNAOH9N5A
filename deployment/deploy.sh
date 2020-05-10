#!/bin/bash

BASEDIR=$(dirname "$0")

# Redis
kubectl apply -f https://raw.githubusercontent.com/spotahome/redis-operator/master/example/operator/all-redis-operator-resources.yaml
kubectl apply -f https://raw.githubusercontent.com/spotahome/redis-operator/master/example/redisfailover/basic.yaml

while [ $(kubectl get po -l app.kubernetes.io/component=sentinel --no-headers | grep Running | wc -l) -lt 3 ]; do
  echo "Waiting for all redis to get online"
  sleep 5
done

# Replica set
kubectl apply -f $BASEDIR/kubernetes/app-service.yml
kubectl apply -f $BASEDIR/kubernetes/app-deployment.yml
