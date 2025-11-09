#!/bin/bash

# Database setup and seeding script for Learning Tracks API
# This script sets up the PostgreSQL database and seeds it with sample data

set -e  # Exit on any error

echo "🚀 Starting Learning Tracks API Database Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker and try again.${NC}"
    exit 1
fi

# Function to check if database is ready
wait_for_db() {
    echo -e "${BLUE}⏳ Waiting for PostgreSQL to be ready...${NC}"
    
    for i in {1..30}; do
        if docker exec learning-tracks-postgres pg_isready -U postgres > /dev/null 2>&1; then
            echo -e "${GREEN}✅ PostgreSQL is ready!${NC}"
            return 0
        fi
        echo -e "${YELLOW}⏳ Attempt $i/30: PostgreSQL not ready yet...${NC}"
        sleep 2
    done
    
    echo -e "${RED}❌ PostgreSQL failed to start within 60 seconds${NC}"
    return 1
}

# Start PostgreSQL container
echo -e "${BLUE}🐳 Starting PostgreSQL container...${NC}"
docker-compose up -d postgres

# Wait for database to be ready
wait_for_db

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📦 Installing Node.js dependencies...${NC}"
    npm install
fi

# Build the application
echo -e "${BLUE}🔨 Building the application...${NC}"
npm run build

# Set up environment variables if .env doesn't exist
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}📝 Creating .env file with default values...${NC}"
    cat > .env << EOL
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/learningtracksdb

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=3600

# YouTube API (Optional - for fetching real video data)
YOUTUBE_API_KEY=your-youtube-api-key-here
YOUTUBE_API_BASE_URL=https://www.googleapis.com/youtube/v3/videos

# Application
PORT=3000
NODE_ENV=development
EOL
    echo -e "${GREEN}✅ Created .env file. Please update with your actual API keys if needed.${NC}"
fi

# Run database migrations/sync
echo -e "${BLUE}🗃️  Setting up database schema...${NC}"
echo -e "${YELLOW}ℹ️  Database schema will be created automatically (synchronize: true)${NC}"

# Seed the database
echo -e "${BLUE}🌱 Seeding database with sample data...${NC}"
npm run seed

echo ""
echo -e "${GREEN}🎉 Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}📋 What's been created:${NC}"
echo -e "   ${GREEN}✅${NC} PostgreSQL database running on port 5432"
echo -e "   ${GREEN}✅${NC} Database schema synchronized"
echo -e "   ${GREEN}✅${NC} Sample data seeded:"
echo -e "      - 4 sample users (passwords: password123, securepass456, etc.)"
echo -e "      - 18 learning tracks (JavaScript, React, Node.js, etc.)"
echo -e "      - 10 sample contents with YouTube video IDs"
echo -e "      - Content-track relationships established"
echo ""
echo -e "${BLUE}🚀 Next steps:${NC}"
echo -e "   1. Start the API: ${YELLOW}npm run start:dev${NC}"
echo -e "   2. Visit: ${YELLOW}http://localhost:3000/api${NC} (Swagger documentation)"
echo -e "   3. Login with: ${YELLOW}john.doe@example.com / password123${NC}"
echo ""
echo -e "${BLUE}💡 Useful commands:${NC}"
echo -e "   ${YELLOW}npm run seed${NC}         - Add sample data"
echo -e "   ${YELLOW}npm run seed:clear${NC}   - Clear all data"
echo -e "   ${YELLOW}npm run seed:reset${NC}   - Clear and re-seed"
echo -e "   ${YELLOW}docker-compose down${NC}  - Stop database"
echo ""
echo -e "${GREEN}🎊 Your Learning Tracks API is ready for evaluation!${NC}"