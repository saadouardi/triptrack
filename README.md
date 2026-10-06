# TripTrack

TripTrack is a full-stack trip-planning application for creating and managing trips, destinations, and the relationships between them.

The project demonstrates end-to-end TypeScript development, REST API design, relational data modeling, Docker-based local setup, automated backend testing, and third-party API integration.

## Tech stack

**Frontend**
- Next.js
- React
- TypeScript

**Backend**
- Node.js
- Express
- TypeScript
- Sequelize

**Database**
- PostgreSQL

**Tooling**
- Docker / Docker Compose
- Jest / Supertest
- Git / GitHub

## Core features

- Create, update, view, and delete trips
- Create, update, view, and delete destinations
- Add and remove destinations from trips
- Search trips by name or date
- View trips associated with a destination
- Trip statistics and summary views
- Weather integration for destinations

## API design

The backend exposes REST endpoints for trips, destinations, search, statistics, and weather data.

Examples:

```text
GET    /api/trips
POST   /api/trips
GET    /api/trips/:id
PUT    /api/trips/:id
DELETE /api/trips/:id

GET    /api/destinations
POST   /api/destinations
GET    /api/destinations/:id

GET    /api/search/trips?name=&date=
GET    /api/statistics
GET    /api/weather/:location
```

## Architecture

```text
Client
  |
  v
Next.js / React
  |
  | REST
  v
Express API
  |
  v
Sequelize
  |
  v
PostgreSQL

External weather data is integrated through the backend.
```

The backend is separated into controllers, routes, services, models, middleware, types, and utilities to keep responsibilities clear.

## Local setup

### Requirements

- Node.js
- PostgreSQL
- npm
- Optional: Docker / Docker Compose
- OpenWeatherMap API key for weather features

### Backend

```bash
cd backend
npm install
npm run build
npm start
```

### Tests

```bash
cd backend
npm test
```

### Docker

Create the required environment configuration, then:

```bash
docker compose up -d
```

## What this project demonstrates

- Full-stack TypeScript development
- REST API design
- Relational data modeling and N:M relationships
- Service/controller separation
- PostgreSQL with Sequelize
- Third-party API integration
- Automated backend testing
- Docker-based development workflows
- Team-oriented Git development

## Author

**Saad Ouardi**  
[Portfolio](https://saadouardi.vercel.app) · [LinkedIn](https://www.linkedin.com/in/saad-ouardi)
