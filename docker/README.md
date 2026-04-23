# MDM-labs Frontend Docker Setup

This directory contains the Docker configuration for building and running the MDM-labs frontend application with Nginx.

## Features

- **Multi-stage build**: Optimized for production with small image size (~50-70 MB)
- **Protocol Buffer generation**: Automatic generation of gRPC-Web client code from `.proto` files
- **Runtime configuration**: Environment-based configuration injection without rebuilding
- **Security**: Runs as unprivileged user (UID 1000)
- **Health checks**: Built-in health check endpoints
- **SPA routing**: Proper Nginx configuration for Vue Router history mode

## Quick Start

### Build the Image

```bash
# From project root
docker build -f docker/containers/mdmlabs-frontend/Dockerfile -t mdmlabs-frontend:latest .
```

### Run with Docker

```bash
docker run -d \
  --name mdmlabs-frontend \
  -p 8080:8080 \
  -e API_URL=https://api.yourdomain.com \
  -e GRPC_API_URL=https://grpc.yourdomain.com \
  mdmlabs-frontend:latest
```

### Run with Docker Compose

```bash
# From docker directory
cd docker
docker-compose up -d
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `API_URL` | Yes | `https://api.example.com` | Backend REST API endpoint |
| `GRPC_API_URL` | Yes | `https://grpc.example.com` | gRPC-Web API endpoint |
| `APP_VERSION` | No | `0.101.56` | Application version display |
| `LOG_LEVEL` | No | `info` | Logging verbosity level |

## Build Arguments

| Argument | Default | Description |
|----------|---------|-------------|
| `PROTOC_VERSION` | `25.1` | Protocol Buffer compiler version |
| `GRPC_WEB_VERSION` | `1.5.0` | gRPC-Web plugin version |

## Image Tags

```bash
# Tag with version from package.json
docker tag mdmlabs-frontend:latest mdmlabs-frontend:0.101.56

# Tag with git commit hash
docker tag mdmlabs-frontend:latest mdmlabs-frontend:$(git rev-parse --short HEAD)
```

## Health Checks

The container provides two health check methods:

1. **HTTP endpoint**: `GET http://localhost:8080/health` (returns 200 OK)
2. **Readiness file**: `/opt/tactical/tmp/tactical.ready`

## Development

### Local Testing

```bash
# Build and run
docker-compose up --build

# View logs
docker-compose logs -f frontend

# Stop
docker-compose down
```

### Debugging

```bash
# Access container shell
docker exec -it mdmlabs-frontend sh

# Check generated config
docker exec mdmlabs-frontend cat /usr/share/nginx/html/config.js

# Test nginx configuration
docker exec mdmlabs-frontend nginx -t

# View logs
docker logs mdmlabs-frontend
```

## Production Deployment

### Example: Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mdmlabs-frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: mdmlabs-frontend
  template:
    metadata:
      labels:
        app: mdmlabs-frontend
    spec:
      containers:
      - name: frontend
        image: mdmlabs-frontend:0.101.56
        ports:
        - containerPort: 8080
        env:
        - name: API_URL
          value: "https://api.production.com"
        - name: GRPC_API_URL
          value: "https://grpc.production.com"
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 30
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 5
          periodSeconds: 10
        resources:
          requests:
            memory: "64Mi"
            cpu: "100m"
          limits:
            memory: "128Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: mdmlabs-frontend
spec:
  type: ClusterIP
  ports:
  - port: 80
    targetPort: 8080
  selector:
    app: mdmlabs-frontend
```

### Example: Docker Swarm

```bash
docker service create \
  --name mdmlabs-frontend \
  --replicas 3 \
  --publish 8080:8080 \
  --env API_URL=https://api.production.com \
  --env GRPC_API_URL=https://grpc.production.com \
  --health-cmd="wget --no-verbose --tries=1 --spider http://localhost:8080/health || exit 1" \
  --health-interval=30s \
  --health-retries=3 \
  mdmlabs-frontend:0.101.56
```

## Troubleshooting

### Build Issues

**Problem**: Proto generation fails
```bash
# Check protoc installation
docker run --rm mdmlabs-frontend:latest protoc --version
```

**Problem**: Build fails with memory error
```bash
# Increase Docker build memory
docker build --memory=4g -f docker/containers/mdmlabs-frontend/Dockerfile -t mdmlabs-frontend:latest .
```

### Runtime Issues

**Problem**: 404 errors for routes
- Check Nginx configuration: The `try_files` directive should fallback to `/index.html`
- Verify SPA routing is configured in Vue Router with history mode

**Problem**: API connection fails
- Check environment variables are set correctly
- Verify CORS configuration on backend
- Check network connectivity from container

**Problem**: Config not injected
- Check entrypoint script logs: `docker logs mdmlabs-frontend`
- Verify config.js exists: `docker exec mdmlabs-frontend ls -la /usr/share/nginx/html/config.js`

## File Structure

```
docker/
├── containers/
│   └── mdmlabs-frontend/
│       ├── Dockerfile          # Multi-stage build definition
│       ├── entrypoint.sh       # Runtime configuration script
│       └── nginx.conf          # Nginx server configuration
└── docker-compose.yml          # Development docker-compose setup
```

## Security Notes

- Container runs as unprivileged user (UID 1000)
- No root access in runtime container
- Minimal Alpine base image
- Security headers configured in Nginx
- Regular updates recommended for base images and dependencies

## Performance

- Expected image size: 50-70 MB
- Cold start time: < 5 seconds
- Memory usage: ~30-50 MB at runtime
- Supports thousands of concurrent connections with proper Nginx tuning

## License

Same as the main application license.
