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

## Environment

- Only the complete database url is needed in the following variable: DATABASE_URL

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
