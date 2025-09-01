#!/bin/bash

# Docker Setup Script for Job Board Application

echo "🚀 Job Board Docker Setup"
echo "========================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are available"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "⚠️  No .env file found. Creating one..."
    cat > .env << EOL
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Note: MongoDB URI is automatically configured for Docker
# MONGODB_URI=mongodb://admin:password123@mongodb:27017/job-board?authSource=admin
EOL
    echo "📝 Created .env file. Please add your OpenAI API key."
    echo "   Edit .env and replace 'your_openai_api_key_here' with your actual API key."
    echo ""
fi

echo "🐳 Starting containers..."

# Ask user which environment to run
echo "Which environment would you like to start?"
echo "1) Development (hot reload, source code mounted)"
echo "2) Production (optimized build)"
echo -n "Enter your choice (1 or 2): "
read choice

case $choice in
    1)
        echo "🔧 Starting development environment..."
        docker-compose -f docker-compose.dev.yml up -d
        ;;
    2)
        echo "🏭 Starting production environment..."
        docker-compose up -d
        ;;
    *)
        echo "❌ Invalid choice. Starting development environment by default..."
        docker-compose -f docker-compose.dev.yml up -d
        ;;
esac

echo ""
echo "⏳ Waiting for services to start..."
sleep 10

# Check if containers are running
echo "📊 Container status:"
docker-compose ps

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📱 Access the application:"
echo "   • Application: http://localhost:3000"
echo "   • Database UI: http://localhost:8081"
echo ""
echo "🗄️  To populate with sample data:"
echo "   docker exec -it job-board-mongodb-dev mongosh job-board -u admin -p password123 --authenticationDatabase admin"
echo "   Then run the scripts in /docker-entrypoint-initdb.d/"
echo ""
echo "📊 MongoDB is running on port 27018 (to avoid conflicts with local MongoDB on 27017)"
echo ""
echo "📋 Useful commands:"
echo "   • View logs: docker-compose logs -f"
echo "   • Stop services: docker-compose down"
echo "   • Restart: docker-compose restart"
