#!/bin/bash
# scripts/seed.sh

echo "🌱 Seeding database with test users..."

API_URL="${1:-http://localhost:3001}"

# Create test users
curl -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Smith", "username": "alice", "password": "password123"}'

echo ""

curl -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name": "Bob Johnson", "username": "bob", "password": "password123"}'

echo ""

curl -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"name": "Charlie Brown", "username": "charlie", "password": "password123"}'

echo ""
echo "✅ Database seeded successfully!"
echo ""
echo "Test users:"
echo "  - alice / password123"
echo "  - bob / password123"
echo "  - charlie / password123"
