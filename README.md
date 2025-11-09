# Learning Tracks API

This API is created to serve the Learning Tracks app.
Learning Tracks is your personal Udemy for free content.

- Stop paying expensive courses just for a more organized content and better tracking of your progress.
- Quality content is out there and it is free, just needs some organization.
- With Learning Tracks you can set aside your favorite content about a topic you want to learn and track your progress.
- You can tag each added content so it can become a Learning Track you can follow.
- Finished consuming a content? Just mark it as completed.
- Want to see check you progress for a determined content? Just check the Tracks view.

## Description

The Learning Tracks API will serve both mobile apps and a web app.
It will be responsible for managing a few entities like:

- Content: it is formed by a Youtube URL, a completed property to track if the content was already consumed or not and some computed properties like content title, description and duration (provided by the Youtube API).
- Tracks: it is formed by a simple title string.

## Project structure

- `src/modules/` – Contains all **feature modules** (e.g., `auth`, `contents`, `tracks`, `users`, `youtube`) with their controllers, services, DTOs, and entities.
- `src/common/` – Shared **utilities** and code used across modules, including constants, guards, helpers, validators, interfaces, and enums.
- `db/` – Database-related files, such as the `schema.dbml` diagram, migrations, or seed data.
- `docs/` – Project **documentation**, including diagrams, usage guides, and the commit history correction file.

## Quick Setup

**New to this project?** Get up and running quickly with sample data:

**[Setup Guide](./SETUP_GUIDE.md)** - Complete setup instructions with one-command deployment

```bash
# Quick setup with sample data
npm run setup:full
```

This will automatically:

- Start PostgreSQL database
- Install dependencies
- Seed with realistic sample data (users, tracks, contents)
- Set up authentication-ready environment

## ⚙️ Environment Configuration

The application requires several environment variables for proper operation. Copy the example file and configure:

```bash
cp .env.example .env
```

### Required Variables

| Variable                 | Description                          | Example                                                          |
| ------------------------ | ------------------------------------ | ---------------------------------------------------------------- |
| `DATABASE_URL`           | PostgreSQL connection string         | `postgresql://postgres:postgres@localhost:5432/learningtracksdb` |
| `JWT_SECRET`             | Secret key for JWT token signing     | `your-super-secret-jwt-key-change-this-in-production`            |
| `JWT_EXPIRES_IN_SECONDS` | JWT token expiration time in seconds | `900` (15 minutes)                                               |

### Optional Variables

| Variable               | Description                                | Default/Example                                |
| ---------------------- | ------------------------------------------ | ---------------------------------------------- |
| `YOUTUBE_API_KEY`      | YouTube Data API v3 key for video metadata | Required for fetching real video data          |
| `YOUTUBE_API_BASE_URL` | YouTube API endpoint                       | `https://www.googleapis.com/youtube/v3/videos` |
| `PORT`                 | Application port                           | `3000`                                         |
| `NODE_ENV`             | Environment mode                           | `development`                                  |

### Getting API Keys

**YouTube API Key** (Optional - for production video fetching):

1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **YouTube Data API v3**
4. Create credentials → API Key
5. Add the key to your `.env` file

> **Note**: Without YouTube API key, the app uses mocked video data in development.

### 🐳 Database Setup

Using Docker (recommended):

```bash
docker-compose up -d postgres
```

Or use your own PostgreSQL instance and update the `DATABASE_URL` accordingly.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Database Management

```bash
# Seed database with sample data
$ npm run seed

# Clear all data from database
$ npm run seed:clear

# Reset database (clear + seed)
$ npm run seed:reset
```

## Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Complete setup instructions for evaluators and developers
- **[AI Usage Documentation](./docs/AI_USAGE.md)** - Guidelines and history of AI assistance in this project
- **[API Documentation](http://localhost:3000/api)** - Interactive Swagger documentation (when running)

## Next steps

- Add unit tests to entities.
- Add integration tests for the other modules like Auth and Users.
- Implement the missing CRUD parts of the Users module.
- Add tests for the Youtube service.
- Add integration with OpenAI to, based on a topic the user wants to learn, suggest a complete Learning Track with content suggestion.
- Add possibility to make a Learning Track public and share with friends.
