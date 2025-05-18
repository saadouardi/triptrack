import request from "supertest"
import { createApp } from "../src/app"
import { sequelize } from "../src/utils/database"
import { TripModel } from "../src/models/trip.model"
import { DestinationModel } from "../src/models/destination.model"
import { TripDestinationModel } from "../src/models/trip-destination.model"

const app = createApp()

describe("Destination API", () => {
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

  describe("GET /api/destinations", () => {
    it("should return an empty array when no destinations exist", async () => {
      const response = await request(app).get("/api/destinations")
      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })

    it("should return all destinations", async () => {
      // Create test destinations
      await DestinationModel.create({
        name: "Paris",
        description: "City of Love",
        location: "France",
      })

      await DestinationModel.create({
        name: "Rome",
        description: "Eternal City",
        location: "Italy",
      })

      const response = await request(app).get("/api/destinations")
      expect(response.status).toBe(200)
      expect(response.body.length).toBe(2)
      expect(response.body[0].name).toBe("Paris")
      expect(response.body[1].name).toBe("Rome")
    })
  })

  describe("POST /api/destinations", () => {
    it("should create a new destination", async () => {
      const destinationData = {
        name: "Barcelona",
        description: "Beautiful city in Spain",
        location: "Spain",
        activities: ["Visit Sagrada Familia", "Walk on La Rambla"],
      }

      const response = await request(app).post("/api/destinations").send(destinationData)
      expect(response.status).toBe(201)
      expect(response.body.name).toBe(destinationData.name)
      expect(response.body.description).toBe(destinationData.description)
      expect(response.body.location).toBe(destinationData.location)
      expect(response.body.activities).toEqual(destinationData.activities)
    })

    it("should return 400 if required fields are missing", async () => {
      const destinationData = {
        name: "Barcelona",
        // Missing description
      }

      const response = await request(app).post("/api/destinations").send(destinationData)
      expect(response.status).toBe(400)
    })
  })

  // Additional tests for other endpoints would follow the same pattern
})
