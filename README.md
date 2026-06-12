# Recipe Browser — Frontend Auth

Starting code for the Frontend Authentication chapter in TripleTen's AI-Assisted Software Engineering program.

## Setup

```bash
npm install          # installs root dependency (concurrently)
npm run install:all  # installs server/ and client/ deps
npm run dev          # starts both servers
```

The backend runs on `http://localhost:3001`. The frontend runs on `http://localhost:5173`.

## Test account

The server starts with one user already registered. Use these credentials while working through the lessons:

| Field    | Value              |
|----------|--------------------|
| Name     | Test User          |
| Email    | test@example.com   |
| Password | password123        |

> The server stores users in memory, so registered accounts are lost on restart. The test account above is always available.

## Tests

Tests for each lesson are in `client/tests/` and can be run from the project root:

```bash
node client/tests/lesson-02.js
```

Replace `02` with the lesson number (02–08).

## Solutions

Solutions can be found in the `draft/solution` branch.
