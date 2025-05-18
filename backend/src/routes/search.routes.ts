import { Router } from "express"
import { SearchController } from "../controllers/search.controller"

const router = Router()
const searchController = new SearchController()

router.get("/trips", searchController.searchTrips)

export default router
