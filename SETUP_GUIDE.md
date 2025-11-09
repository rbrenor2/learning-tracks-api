# Quick Setup Guide for Evaluators

This guide will help you quickly set up the Learning Tracks API with sample data for evaluation.

## Prerequisites

- **Node.js** (v18 or higher)
- **Docker** (for PostgreSQL database)
- **npm** (comes with Node.js)

## Quick Setup (Recommended)

### Option 1: Automated Setup Script

```bash
# Run the complete setup script
npm run setup:full
```

This script will:

- Start PostgreSQL container
- Install dependencies
- Build the application
- Create .env file with defaults
- Set up database schema
- Seed with sample data

### Option 2: Manual Setup

```bash
# 1. Start PostgreSQL database
docker-compose up -d postgres

# 2. Install dependencies
npm install

# 3. Create .env file (copy from .env.example or use defaults)
cp .env.example .env  # If you have one, or create manually

# 4. Seed the database
npm run seed

# 5. Start the API
npm run start:dev
```

## What Gets Created

### Sample Users

- **john.doe@example.com** / password123
- **jane.smith@example.com** / securepass456
- **bob.wilson@example.com** / mypassword789
- **alice.johnson@example.com** / strongpass321

### Sample Tracks (18 total)

- JavaScript Fundamentals
- React Basics / Advanced React
- Node.js Development / Express Framework
- TypeScript Essentials
- Database Design
- API Development
- Frontend/Backend Development
- Testing Strategies
- DevOps Basics
- And more...

### Sample Contents (10 total)

- YouTube videos about JavaScript, React, Node.js, TypeScript
- Various durations (30-70 minutes)
- Some marked as completed, others in progress
- Realistic titles and descriptions

### Content-Track Relationships

- Each content is associated with 2-4 relevant tracks
- Proper positioning and organization

## Database Management Commands

```bash
# Seed database with sample data
npm run seed

# Clear all data from database
npm run seed:clear

# Reset database (clear + seed)
npm run seed:reset

# Quick setup (start DB + seed)
npm run setup
```

## API Access

Once running:

- **API Base URL**: http://localhost:3000
- **Swagger Documentation**: http://localhost:3000/api
- **Authentication**: Use any of the sample user credentials

## Testing the API

### 1. Authentication

```bash
POST /auth
{
  "email": "john.doe@example.com",
  "password": "password123"
}
```

### 2. Get Contents

```bash
GET /contents
Authorization: Bearer {your-jwt-token}
```

### 3. Create Content

```bash
POST /contents
Authorization: Bearer {your-jwt-token}
{
  "videoId": "dQw4w9WgXcQ",
  "tracks": ["JavaScript Fundamentals", "Web Development"]
}
```
