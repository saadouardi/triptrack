import express, { type Application } from "express"
import cors from "cors"
import morgan from "morgan"
import { errorMiddleware } from "./middleware/error.middleware"
import tripRoutes from "./routes/trip.routes"
import destinationRoutes from "./routes/destination.routes"
import searchRoutes from "./routes/search.routes"
import weatherRoutes from "./routes/weather.routes"
import statisticsRoutes from "./routes/statistics.routes"

export const createApp = (): Application => {
  const app = express()

  // Middleware
  app.use(cors())
  app.use(express.json())
  app.use(morgan("dev"))

  // Routes
  app.use("/api/trips", tripRoutes)
  app.use("/api/destinations", destinationRoutes)
  app.use("/api/search", searchRoutes)
  app.use("/api/weather", weatherRoutes)
  app.use("/api/statistics", statisticsRoutes)

  // Error handling
  app.use(errorMiddleware)

  return app
}
