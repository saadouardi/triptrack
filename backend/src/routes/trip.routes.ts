import { Router } from "express"
import { TripController } from "../controllers/trip.controller"

const router = Router()
const tripController = new TripController()

router.get("/", tripController.getAllTrips)
router.post("/", tripController.createTrip)
router.get("/:id", tripController.getTripById)
router.put("/:id", tripController.updateTrip)
router.delete("/:id", tripController.deleteTrip)
router.post("/:id/destinations", tripController.addDestinationsToTrip)
router.delete("/:id/destinations/:destinationId", tripController.removeDestinationFromTrip)

export default router
