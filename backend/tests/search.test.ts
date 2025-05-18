import request from "supertest"
import { createApp } from "../src/app"
import { sequelize } from "../src/utils/database"
import { TripModel } from "../src/models/trip.model"
import { DestinationModel } from "../src/models/destination.model"
import { TripDestinationModel } from "../src/models/trip-destination.model"

const app = createApp()

describe("Search API", () => {
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

    await TripModel.create({
      name: "Spring Break",
      description: "A fun spring break",
      startDate: new Date("2025-03-15"),
      endDate: new Date("2025-03-22"),
    })
  })

  describe("GET /api/search/trips", () => {
    it("should return trips matching the name search", async () => {
      const response = await request(app).get("/api/search/trips?name=summer")
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(1)
      expect(response.body[0].name).toBe("Summer Vacation")
    })

    it("should return trips matching the date search", async () => {
      const response = await request(app).get("/api/search/trips?date=2025-06-10")
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(1)
      expect(response.body[0].name).toBe("Summer Vacation")
    })

    it("should return 400 if no search parameters are provided", async () => {
      const response = await request(app).get("/api/search/trips")
      expect(response.status).toBe(400)
    })

    it("should return 400 if date format is invalid", async () => {
      const response = await request(app).get("/api/search/trips?date=invalid-date")
      expect(response.status).toBe(400)
    })
  })
})
