#!/bin/bash
set -e

echo "==================================="
echo "MDM-labs Frontend Container Setup"
echo "==================================="

# Environment variables with defaults
API_URL="${API_URL:-https://api.example.com}"
GRPC_API_URL="${GRPC_API_URL:-https://grpc.example.com}"
APP_VERSION="${APP_VERSION:-0.101.56}"
LOG_LEVEL="${LOG_LEVEL:-info}"

echo "Configuration:"
echo "  API_URL: ${API_URL}"
echo "  GRPC_API_URL: ${GRPC_API_URL}"
echo "  APP_VERSION: ${APP_VERSION}"
echo "  LOG_LEVEL: ${LOG_LEVEL}"

# Generate runtime configuration file
CONFIG_FILE="${PUBLIC_DIR}/config.js"

echo "Generating runtime configuration at ${CONFIG_FILE}..."

cat > "${CONFIG_FILE}" <<EOF
// Runtime configuration injected by container entrypoint
// This file is generated automatically - do not edit manually
window.APP_CONFIG = {
  apiUrl: '${API_URL}',
  grpcUrl: '${GRPC_API_URL}',
  version: '${APP_VERSION}',
  logLevel: '${LOG_LEVEL}',
  environment: 'production',
  generatedAt: '$(date -u +"%Y-%m-%dT%H:%M:%SZ")'
};

// Log configuration for debugging
console.log('Application configuration loaded:', window.APP_CONFIG);
EOF

echo "Configuration file generated successfully"

# Verify configuration file was created
if [ ! -f "${CONFIG_FILE}" ]; then
    echo "ERROR: Failed to create configuration file at ${CONFIG_FILE}"
    exit 1
fi

# Set proper permissions
chmod 644 "${CONFIG_FILE}"

# Create readiness marker file
echo "Creating readiness marker at ${TACTICAL_READY_FILE}..."
mkdir -p "$(dirname "${TACTICAL_READY_FILE}")"
touch "${TACTICAL_READY_FILE}"
echo "Container initialization completed at $(date -u +"%Y-%m-%dT%H:%M:%SZ")" > "${TACTICAL_READY_FILE}"

echo "Readiness marker created successfully"

# Verify index.html exists
if [ ! -f "${PUBLIC_DIR}/index.html" ]; then
    echo "ERROR: index.html not found at ${PUBLIC_DIR}/index.html"
    echo "Available files in ${PUBLIC_DIR}:"
    ls -la "${PUBLIC_DIR}/" || true
    exit 1
fi

echo "Application files verified"

# Optional: Inject config.js reference into index.html if not present
INDEX_HTML="${PUBLIC_DIR}/index.html"
if ! grep -q "config.js" "${INDEX_HTML}"; then
    echo "Injecting config.js reference into index.html..."
    # Create a backup
    cp "${INDEX_HTML}" "${INDEX_HTML}.bak"

    # Inject script tag before closing head tag
    sed -i 's|</head>|  <script src="/config.js"></script>\n</head>|' "${INDEX_HTML}"

    if [ $? -eq 0 ]; then
        echo "Successfully injected config.js reference"
        rm "${INDEX_HTML}.bak"
    else
        echo "WARNING: Failed to inject config.js reference, restoring backup"
        mv "${INDEX_HTML}.bak" "${INDEX_HTML}"
    fi
else
    echo "config.js reference already present in index.html"
fi

echo "==================================="
echo "Container ready to serve traffic"
echo "==================================="

# Continue with the default nginx entrypoint
exec "$@"
