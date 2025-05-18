import request from "supertest"
import { createApp } from "../src/app"
import { sequelize } from "../src/utils/database"
import { TripModel } from "../src/models/trip.model"
import { DestinationModel } from "../src/models/destination.model"
import { TripDestinationModel } from "../src/models/trip-destination.model"

const app = createApp()

describe("Trip API", () => {
  beforeAll(async () => {
    // Initialize models
    TripModel.initialize(sequelize)
    DestinationModel.initialize(sequelize)
    TripDestinationModel.initialize(sequelize)
    TripDestinationModel.associate()

    // Sync database
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  beforeEach(async () => {
    // Clear database before each test
    await TripDestinationModel.destroy({ where: {} })
    await TripModel.destroy({ where: {} })
    await DestinationModel.destroy({ where: {} })
  })

  describe("GET /api/trips", () => {
    it("should return an empty array when no trips exist", async () => {
      const response = await request(app).get("/api/trips")
      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it("should return all trips", async () => {
      // Create test trips
      await TripModel.create({
        name: "Summer Vacation",
        description: "A relaxing summer vacation",
        startDate: new Date("2025-06-01"),
        endDate: new Date("2025-06-15"),
      })

      await TripModel.create({
        name: "Winter Getaway",
        description: "A cozy winter trip",
        startDate: new Date("2025-12-20"),
        endDate: new Date("2025-12-27"),
      })

      const response = await request(app).get("/api/trips")
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(2)
      expect(response.body[0].name).toBe("Summer Vacation")
      expect(response.body[1].name).toBe("Winter Getaway")
    })
  })

  describe("POST /api/trips", () => {
    it("should create a new trip", async () => {
      const tripData = {
        name: "European Adventure",
        description: "Exploring Europe",
        startDate: "2025-07-01",
        endDate: "2025-07-15",
        participants: ["John", "Jane"],
      }

      const response = await request(app).post("/api/trips").send(tripData)
      expect(response.status).toBe(201)
      expect(response.body.name).toBe(tripData.name)
      expect(response.body.description).toBe(tripData.description)
      expect(new Date(response.body.startDate)).toEqual(new Date(tripData.startDate))
      expect(new Date(response.body.endDate)).toEqual(new Date(tripData.endDate))
      expect(response.body.participants).toEqual(tripData.participants)
    })

    it("should return 400 if required fields are missing", async () => {
      const tripData = {
        name: "European Adventure",
        // Missing description and dates
      }

      const response = await request(app).post("/api/trips").send(tripData)
      expect(response.status).toBe(400)
    })

    it("should return 400 if end date is before start date", async () => {
      const tripData = {
        name: "European Adventure",
        description: "Exploring Europe",
        startDate: "2025-07-15",
        endDate: "2025-07-01", // End date before start date
      }

      const response = await request(app).post("/api/trips").send(tripData)
      expect(response.status).toBe(400)
    })
  })

  // Additional tests for other endpoints would follow the same pattern
})
