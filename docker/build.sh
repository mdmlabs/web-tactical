#!/bin/bash
# Build script for MDM-labs Frontend Docker image

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Default values
IMAGE_NAME="mdmlabs-frontend"
DOCKERFILE="docker/containers/mdmlabs-frontend/Dockerfile"
PROTOC_VERSION="25.1"
GRPC_WEB_VERSION="1.5.0"
PRODUCT_EDITION="${PRODUCT_EDITION:-full}"
PRODUCT_DISPLAY_NAME="${PRODUCT_DISPLAY_NAME:-Laborato MDM}"

# Get version from package.json
APP_VERSION=$(node -p "require('./package.json').version" 2>/dev/null || echo "latest")

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}MDM-labs Frontend Docker Build${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --tag|-t)
            TAG="$2"
            shift 2
            ;;
        --no-cache)
            NO_CACHE="--no-cache"
            shift
            ;;
        --push)
            PUSH=true
            shift
            ;;
        --help|-h)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -t, --tag TAG        Custom image tag (default: version from package.json)"
            echo "  --no-cache          Build without using cache"
            echo "  --push              Push image to registry after build"
            echo "  -h, --help          Show this help message"
            echo ""
            exit 0
            ;;
        *)
            echo -e "${RED}Unknown option: $1${NC}"
            exit 1
            ;;
    esac
done

# Set tag
TAG="${TAG:-$APP_VERSION}"

echo "Build Configuration:"
echo "  Image Name: ${IMAGE_NAME}"
echo "  Tag: ${TAG}"
echo "  Dockerfile: ${DOCKERFILE}"
echo "  Protoc Version: ${PROTOC_VERSION}"
echo "  gRPC-Web Version: ${GRPC_WEB_VERSION}"
echo "  Product Edition: ${PRODUCT_EDITION}"
echo "  Product Name: ${PRODUCT_DISPLAY_NAME}"
echo ""

# Check if Dockerfile exists
if [ ! -f "$DOCKERFILE" ]; then
    echo -e "${RED}Error: Dockerfile not found at $DOCKERFILE${NC}"
    exit 1
fi

# Build the image
echo -e "${YELLOW}Building Docker image...${NC}"
docker build \
    ${NO_CACHE} \
    --build-arg PROTOC_VERSION=${PROTOC_VERSION} \
    --build-arg GRPC_WEB_VERSION=${GRPC_WEB_VERSION} \
    --build-arg PRODUCT_EDITION="${PRODUCT_EDITION}" \
    --build-arg PRODUCT_DISPLAY_NAME="${PRODUCT_DISPLAY_NAME}" \
    -f ${DOCKERFILE} \
    -t ${IMAGE_NAME}:${TAG} \
    -t ${IMAGE_NAME}:latest \
    .

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Build completed successfully${NC}"
    echo ""
    echo "Image tags created:"
    echo "  - ${IMAGE_NAME}:${TAG}"
    echo "  - ${IMAGE_NAME}:latest"
else
    echo -e "${RED}✗ Build failed${NC}"
    exit 1
fi

# Show image info
echo ""
echo "Image Information:"
docker images ${IMAGE_NAME}:${TAG} --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}\t{{.CreatedAt}}"

# Push if requested
if [ "$PUSH" = true ]; then
    echo ""
    echo -e "${YELLOW}Pushing image to registry...${NC}"
    docker push ${IMAGE_NAME}:${TAG}
    docker push ${IMAGE_NAME}:latest
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ Push completed successfully${NC}"
    else
        echo -e "${RED}✗ Push failed${NC}"
        exit 1
    fi
fi

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}Build Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "To run the container:"
echo "  docker run -d -p 8080:8080 \\"
echo "    -e API_URL=https://api.yourdomain.com \\"
echo "    -e GRPC_API_URL=https://grpc.yourdomain.com \\"
echo "    ${IMAGE_NAME}:${TAG}"
echo ""
echo "Or use docker-compose:"
echo "  cd docker && docker-compose up -d"
