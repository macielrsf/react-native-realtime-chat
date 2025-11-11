#!/bin/bash
# scripts/dev-setup.sh

echo "🔧 Setting up development environment..."

cd "$(dirname "$0")/.."

# Backend setup
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Frontend setup
echo "📱 Installing frontend dependencies..."
cd frontend
npm install

# iOS setup (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
  echo "🍎 Installing iOS pods..."
  cd ios
  pod install
  cd ..
fi

cd ..

echo "✅ Development environment setup complete!"
echo ""
echo "Next steps:"
echo "  1. Start backend: ./scripts/start-backend-docker.sh"
echo "  2. Seed database: ./scripts/seed.sh"
echo "  3. Run frontend:"
echo "     - iOS: cd frontend && npm run ios"
echo "     - Android: cd frontend && npm run android"
