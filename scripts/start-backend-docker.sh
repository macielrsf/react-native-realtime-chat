#!/bin/bash
# scripts/start-backend-docker.sh

echo "🚀 Starting backend with Docker..."

cd "$(dirname "$0")/.."

# Check if .env exists
if [ ! -f backend/.env ]; then
  echo "⚠️  Creating backend/.env from .env.example..."
  cp backend/.env.example backend/.env
fi

# Start Docker Compose
docker compose up --build -d

echo "✅ Backend started successfully!"
