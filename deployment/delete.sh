#!/bin/bash

BASEDIR=$(dirname "$0")

kubectl delete -f https://raw.githubusercontent.com/spotahome/redis-operator/master/example/operator/all-redis-operator-resources.yaml
kubectl delete -f https://raw.githubusercontent.com/spotahome/redis-operator/master/example/redisfailover/basic.yaml
kubectl delete -f $BASEDIR/kubernetes/app-service.yml
kubectl delete -f $BASEDIR/kubernetes/app-deployment.yml
