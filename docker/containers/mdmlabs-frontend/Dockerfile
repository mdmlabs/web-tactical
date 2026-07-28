# Stage 1: Protocol Buffer Generation and Application Build
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install system dependencies for proto generation
RUN apk add --no-cache bash wget tar grep unzip

# Install Protocol Buffer compiler (protoc)
ARG PROTOC_VERSION=25.1
RUN wget -q https://github.com/protocolbuffers/protobuf/releases/download/v${PROTOC_VERSION}/protoc-${PROTOC_VERSION}-linux-x86_64.zip -O /tmp/protoc.zip && \
    unzip /tmp/protoc.zip -d /usr/local && \
    rm /tmp/protoc.zip && \
    chmod +x /usr/local/bin/protoc && \
    protoc --version

# Install gRPC-Web protoc plugin
ARG GRPC_WEB_VERSION=1.5.0
RUN wget -q https://github.com/grpc/grpc-web/releases/download/${GRPC_WEB_VERSION}/protoc-gen-grpc-web-${GRPC_WEB_VERSION}-linux-x86_64 -O /usr/local/bin/protoc-gen-grpc-web && \
    chmod +x /usr/local/bin/protoc-gen-grpc-web

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Install Node.js dependencies
RUN npm ci --omit=dev --ignore-scripts && \
    npm cache clean --force

# Install dev dependencies needed for build
RUN npm ci --ignore-scripts && \
    npm cache clean --force

# Copy source files
COPY . .

# Create generated directory for proto files
RUN mkdir -p src/generated

# Generate Protocol Buffer files
RUN npm run proto:generate

# Build the application
ARG PRODUCT_EDITION=full
ARG PRODUCT_DISPLAY_NAME="Laborato MDM"
ENV NODE_ENV=production
ENV DOCKER_BUILD=true
ENV NODE_OPTIONS=--max-old-space-size=4096
ENV PRODUCT_EDITION=${PRODUCT_EDITION}
ENV PRODUCT_DISPLAY_NAME=${PRODUCT_DISPLAY_NAME}
RUN npm run build

# Verify build output
RUN ls -la dist/ && \
    echo "Build completed successfully"

# Stage 2: Nginx Runtime
FROM nginxinc/nginx-unprivileged:stable-alpine

# Environment variables
ENV PUBLIC_DIR=/usr/share/nginx/html
ENV TACTICAL_DIR=/opt/tactical
ENV TACTICAL_READY_FILE=${TACTICAL_DIR}/tmp/tactical.ready

# Switch to root for setup
USER root

# Remove default nginx user and create with specific UID/GID
RUN deluser --remove-home nginx && \
    addgroup -S nginx -g 1000 && \
    adduser -S -G nginx -u 1000 nginx

# Install bash for entrypoint script
RUN apk add --no-cache bash gettext

# Create tactical directory structure
RUN mkdir -p ${TACTICAL_DIR}/tmp && \
    chown -R nginx:nginx ${TACTICAL_DIR}

# Remove default nginx content
RUN rm -rf ${PUBLIC_DIR}/*

# Copy built application from builder stage
COPY --from=builder --chown=nginx:nginx /app/dist/ ${PUBLIC_DIR}/

# Copy nginx configuration
COPY --chown=nginx:nginx docker/containers/mdmlabs-frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY --chown=nginx:nginx docker/containers/mdmlabs-frontend/entrypoint.sh /docker-entrypoint.d/40-entrypoint.sh
RUN chmod +x /docker-entrypoint.d/40-entrypoint.sh

# Set proper permissions
RUN chown -R nginx:nginx /etc/nginx && \
    chown -R nginx:nginx ${PUBLIC_DIR}

# Switch to nginx user
USER nginx

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start nginx (entrypoint scripts run automatically)
CMD ["nginx", "-g", "daemon off;"]
