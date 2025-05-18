import type { Request, Response } from "express"
import { WeatherService } from "../services/weather.service"

export class WeatherController {
  private weatherService = new WeatherService()

  public getWeatherForLocation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { location } = req.params

      if (!location) {
        res.status(400).json({ message: "Location is required" })
        return
      }

      const weatherData = await this.weatherService.getWeatherForLocation(location)
      res.status(200).json(weatherData)
    } catch (error) {
      console.error("Error getting weather for location:", error)
      res.status(500).json({ message: "Error fetching weather data" })
    }
  }

  public getForecastForLocation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { location } = req.params
      const days = req.query.days ? Number.parseInt(req.query.days as string, 10) : 5

      if (!location) {
        res.status(400).json({ message: "Location is required" })
        return
      }

      if (isNaN(days) || days < 1 || days > 5) {
        res.status(400).json({ message: "Days must be between 1 and 5" })
        return
      }

      const forecastData = await this.weatherService.getForecastForLocation(location, days)
      res.status(200).json(forecastData)
    } catch (error) {
      console.error("Error getting forecast for location:", error)
      res.status(500).json({ message: "Error fetching forecast data" })
    }
  }
}
