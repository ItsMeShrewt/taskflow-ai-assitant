#!/bin/bash

# Quick start script for Docker setup
echo "🐳 Smart Todo List - Docker Setup"
echo "=================================="
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

echo "1️⃣  Stopping existing containers..."
docker-compose down

echo ""
echo "2️⃣  Building Docker images (this may take a few minutes)..."
docker-compose build --no-cache

echo ""
echo "3️⃣  Starting containers..."
docker-compose up -d

echo ""
echo "4️⃣  Waiting for application to be ready..."
sleep 10

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Access your application:"
echo "   🌐 Todo List App: http://localhost:8000"
echo "   🗄️  PHPMyAdmin:    http://localhost:8080"
echo ""
echo "📊 Check logs:"
echo "   docker-compose logs -f app"
echo ""
echo "🛑 Stop containers:"
echo "   docker-compose down"
echo ""
