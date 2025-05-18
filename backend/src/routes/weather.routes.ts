import { Router } from "express"
import { WeatherController } from "../controllers/weather.controller"

const router = Router()
const weatherController = new WeatherController()

router.get("/:location", weatherController.getWeatherForLocation)
router.get("/:location/forecast", weatherController.getForecastForLocation)

export default router
