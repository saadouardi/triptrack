import { createApp } from "./app"
import { initializeDatabase } from "./utils/database"

const PORT = process.env.PORT || 3000

const startServer = async (): Promise<void> => {
  try {
    // Initialize database
    await initializeDatabase()

    // Create Express app
    const app = createApp()

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error("Error starting server:", error)
    process.exit(1)
  }
}

startServer()
