import { Sequelize } from "sequelize"
import { TripModel } from "../models/trip.model"
import { DestinationModel } from "../models/destination.model"
import { TripDestinationModel } from "../models/trip-destination.model"

const DATABASE_URL = process.env.DATABASE_URL || "postgres://postgres:saad@localhost:5432/trip_planner"

export const sequelize = new Sequelize(DATABASE_URL, {
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  dialect: "postgres",
})

export const initializeDatabase = async (): Promise<void> => {
  try {
    // Initialize models
    TripModel.initialize(sequelize)
    DestinationModel.initialize(sequelize)
    TripDestinationModel.initialize(sequelize)

    // Set up associations
    TripDestinationModel.associate()

    // Sync database
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" })
    console.log("Database synchronized successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}
