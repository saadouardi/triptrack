import { Router } from "express"
import { DestinationController } from "../controllers/destination.controller"

const router = Router()
const destinationController = new DestinationController()

router.get("/", destinationController.getAllDestinations)
router.post("/", destinationController.createDestination)
router.get("/:id", destinationController.getDestinationById)
router.put("/:id", destinationController.updateDestination)
router.delete("/:id", destinationController.deleteDestination)
router.get("/:id/trips", destinationController.getTripsForDestination)

export default router
