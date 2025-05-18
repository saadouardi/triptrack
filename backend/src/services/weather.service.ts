import fetch from "node-fetch"

export class WeatherService {
  private apiKey: string
  private baseUrl: string

  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY || ""
    this.baseUrl = "https://api.openweathermap.org/data/2.5"
  }

  public async getWeatherForLocation(location: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/weather?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric`,
      )

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching weather data:", error)
      throw error
    }
  }

  public async getForecastForLocation(location: string, days = 5): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/forecast?q=${encodeURIComponent(location)}&appid=${this.apiKey}&units=metric&cnt=${days * 8}`,
      )

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error fetching weather forecast:", error)
      throw error
    }
  }
}
