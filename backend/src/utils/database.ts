import { Sequelize } from "sequelize"
import { TripModel } from "../models/trip.model"
import { DestinationModel } from "../models/destination.model"
import { TripDestinationModel } from "../models/trip-destination.model"

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error("DATABASE_URL must be configured")
}

export const sequelize = new Sequelize(databaseUrl, {
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  dialect: "postgres",
})

export const initializeDatabase = async (): Promise<void> => {
  try {
    TripModel.initialize(sequelize)
    DestinationModel.initialize(sequelize)
    TripDestinationModel.initialize(sequelize)

    TripDestinationModel.associate()

    await sequelize.sync({ alter: process.env.NODE_ENV === "development" })
    console.log("Database synchronized successfully")
  } catch (error) {
    console.error("Error initializing database:", error)
    throw error
  }
}
