# Trip Planner Application

A comprehensive trip planning application that allows users to create, manage, and organize trips and destinations.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Setup Instructions](#setup-instructions)
- [Testing the API](#testing-the-api)
- [Freestyle Features](#freestyle-features)

## Features

### Core Functionality

- **Trip Management**: Create, read, update, and delete trips
- **Destination Management**: Create, read, update, and delete destinations
- **Trip-Destination Relationship**: Add and remove destinations from trips
- **Search Functionality**: Search trips by name or date
- **Destination Trips**: View all trips that include a specific destination

### Frontend Features

- Responsive UI built with React and TypeScript
- List and detail views for trips and destinations
- Forms for creating and editing trips and destinations
- Search functionality integrated with the backend API
- Navigation between related entities

### Freestyle Features

1. **Trip Statistics Dashboard** (Freestyle Task #1)
   - Overview of trip metrics (total trips, destinations, etc.)
   - Trip status breakdown (upcoming, ongoing, completed)
   - Most visited destinations
   - Trips by month visualization

2. **Weather Integration** (Freestyle Task #2)
   - Fetches weather data for trip destinations
   - Displays current weather conditions on trip detail page
   - Uses OpenWeatherMap API

## Project Structure

\`\`\`
trip-planner/
├── backend/                 # Node.js + TypeScript backend
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Utility functions
│   │   ├── types/           # TypeScript type definitions
│   │   ├── app.ts           # Express app setup
│   │   └── server.ts        # Server entry point
│   ├── tests/               # Automated tests
│   └── ...
├── frontend/                # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── services/        # API service functions
│   │   ├── types/           # TypeScript type definitions
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main application component
│   │   └── ...
│   └── ...
├── docker-compose.yml       # Docker configuration
└── README.md                # Project documentation
\`\`\`

## API Routes

### Trip Routes

| Method | Endpoint                                | Description                           |
|--------|----------------------------------------|---------------------------------------|
| GET    | /api/trips                             | Get all trips                         |
| POST   | /api/trips                             | Create a new trip                     |
| GET    | /api/trips/:id                         | Get a trip by ID                      |
| PUT    | /api/trips/:id                         | Update a trip                         |
| DELETE | /api/trips/:id                         | Delete a trip                         |
| POST   | /api/trips/:id/destinations            | Add destinations to a trip            |
| DELETE | /api/trips/:id/destinations/:destId    | Remove a destination from a trip      |

### Destination Routes

| Method | Endpoint                      | Description                           |
|--------|------------------------------|---------------------------------------|
| GET    | /api/destinations            | Get all destinations                  |
| POST   | /api/destinations            | Create a new destination              |
| GET    | /api/destinations/:id        | Get a destination by ID               |
| PUT    | /api/destinations/:id        | Update a destination                  |
| DELETE | /api/destinations/:id        | Delete a destination                  |
| GET    | /api/destinations/:id/trips  | Get all trips for a destination       |

### Search Routes

| Method | Endpoint                      | Description                           |
|--------|------------------------------|---------------------------------------|
| GET    | /api/search/trips?name=&date= | Search trips by name and/or date      |

### Statistics Routes (Freestyle Task #1)

| Method | Endpoint                      | Description                           |
|--------|------------------------------|---------------------------------------|
| GET    | /api/statistics              | Get trip statistics and metrics       |

### Weather Routes (Freestyle Task #2)

| Method | Endpoint                           | Description                           |
|--------|-----------------------------------|---------------------------------------|
| GET    | /api/weather/:location            | Get current weather for a location    |
| GET    | /api/weather/:location/forecast   | Get weather forecast for a location   |

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL (or Docker for containerized setup)

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

\`\`\`
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://postgres:postgres@localhost:5432/trip_planner
WEATHER_API_KEY=your_openweathermap_api_key
\`\`\`

### Option 1: Local Setup

1. **Clone the repository**

\`\`\`bash
git clone https://code.fbi.h-da.de/your-username/FWE-SS-25-123456.git
cd FWE-SS-25-123456
\`\`\`

2. **Set up the backend**

\`\`\`bash
cd backend
npm install
npm run build
npm start
\`\`\`

3. **Set up the frontend**

\`\`\`bash
cd ../frontend
npm install
npm start
\`\`\`

4. **Access the application**

- Backend API: http://localhost:3000/api
- Frontend: http://localhost:3001

### Option 2: Docker Setup

1. **Clone the repository**

\`\`\`bash
git clone https://code.fbi.h-da.de/your-username/FWE-SS-25-123456.git
cd FWE-SS-25-123456
\`\`\`

2. **Create a .env file in the project root with your OpenWeatherMap API key**

\`\`\`
WEATHER_API_KEY=your_openweathermap_api_key
\`\`\`

3. **Start the Docker containers**

\`\`\`bash
docker-compose up -d
\`\`\`

4. **Access the application**

- Backend API: http://localhost:3000/api
- Frontend: http://localhost:3001

## Testing the API

### Automated Tests

The project includes automated tests for the backend API. To run the tests:

\`\`\`bash
cd backend
npm test
\`\`\`

### Manual Testing with Postman

1. Import the Postman collection from the `backend/postman` directory
2. Set up an environment variable `baseUrl` with the value `http://localhost:3000/api`
3. Run the requests to test the API endpoints

### Example API Requests

#### Create a Trip

\`\`\`bash
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Summer Vacation",
    "description": "A relaxing summer vacation",
    "startDate": "2025-06-01",
    "endDate": "2025-06-15",
    "participants": ["John", "Jane"]
  }'
\`\`\`

#### Create a Destination

\`\`\`bash
curl -X POST http://localhost:3000/api/destinations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paris",
    "description": "City of Love",
    "location": "France",
    "activities": ["Visit Eiffel Tower", "Louvre Museum"]
  }'
\`\`\`

#### Add Destinations to a Trip

\`\`\`bash
curl -X POST http://localhost:3000/api/trips/{tripId}/destinations \
  -H "Content-Type: application/json" \
  -d '{
    "destinationIds": ["destination-id-1", "destination-id-2"]
  }'
\`\`\`

#### Search Trips

\`\`\`bash
curl -X GET "http://localhost:3000/api/search/trips?name=Summer"
\`\`\`

## Freestyle Features

### Freestyle Task #1: Trip Statistics Dashboard

The Trip Statistics Dashboard provides valuable insights into trip data, including:

- **Overview Statistics**: Total trips, destinations, upcoming trips, and average trip duration
- **Trip Status Breakdown**: Visual representation of upcoming, ongoing, and completed trips
- **Most Visited Destinations**: Ranking of destinations by the number of trips they're included in
- **Trips by Month**: Bar chart visualization of trip distribution by month

This feature extends the core functionality by providing analytics and visualizations that help users understand their travel patterns and make better planning decisions.

### Freestyle Task #2: Weather Integration

The Weather Integration feature enhances trip planning by providing real-time weather information:

- **Current Weather**: Displays current weather conditions for trip destinations
- **Weather Icons**: Visual representation of weather conditions
- **Temperature and Conditions**: Shows temperature and weather description

This feature consumes data from the OpenWeatherMap API to provide users with valuable weather information for their trip destinations, helping them better prepare for their travels.

---

This project was developed as part of the Frontend Web Engineering course (SS 2025) at Hochschule Darmstadt.
