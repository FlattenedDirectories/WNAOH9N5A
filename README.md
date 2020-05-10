# Link Shortener

> Link Shortener Service for Kubernetes

---
## Design

- Redis HA with sentinel as storage that has failover feature
- API services with core function and read/write from redis that can be scaled
- User can use __*Service Annotation*__ or __*Ingress*__ to control traffics to API service pods

---
## Dev/Build

```sh
# Dev
yarn # Get dependencies
node main.js # Connects Redis HA with sentinel locally

# Image building
sh ./docker-build.sh
```

---
## Deployment

```sh
# Deploy to current context with current namespace
sh ./deployment/deploy.sh

# Delete deployment
sh ./deployment/delete.sh

# Test call
curl --header "Content-Type: application/json" \
  --request POST \
  --data '{"url":"https://google.com/"}' \
  http://localhost:8080/newurl
```

---
## Environment Variables

| Name          | Required | Default Value           | Description                                                     |
|---------------|----------|-------------------------|-----------------------------------------------------------------|
| EXPRESS_PORT  | No       | 8080                    | Port that express runs on                                       |
| DOMAIN        | No       | localhost:$EXPRESS_PORT | The returned domain                                             |
| HTTPS_ENABLED | No       | (none)                  | The returned domain URL will be in https if the value is truthy |
