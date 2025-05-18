import type { Request, Response } from "express"
import { TripService } from "../services/trip.service"
import type { CreateTripDto, TripDestinationDto, UpdateTripDto } from "../types/trip.types"

export class TripController {
  private tripService = new TripService()

  public getAllTrips = async (req: Request, res: Response): Promise<void> => {
    try {
      const trips = await this.tripService.getAllTrips()
      res.status(200).json(trips)
    } catch (error) {
      console.error("Error getting all trips:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  public getTripById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const trip = await this.tripService.getTripById(id)

      if (!trip) {
        res.status(404).json({ message: "Trip not found" })
        return
      }

      res.status(200).json(trip)
    } catch (error) {
      console.error("Error getting trip by ID:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  public createTrip = async (req: Request, res: Response): Promise<void> => {
    try {
      const tripData: CreateTripDto = req.body

      // Validate required fields
      if (!tripData.name || !tripData.description || !tripData.startDate || !tripData.endDate) {
        res.status(400).json({ message: "Missing required fields" })
        return
      }

      // Validate dates
      const startDate = new Date(tripData.startDate)
      const endDate = new Date(tripData.endDate)

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        res.status(400).json({ message: "Invalid date format" })
        return
      }

      if (startDate > endDate) {
        res.status(400).json({ message: "Start date must be before end date" })
        return
      }

      const trip = await this.tripService.createTrip({
        ...tripData,
        startDate,
        endDate,
      })

      res.status(201).json(trip)
    } catch (error) {
      console.error("Error creating trip:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  public updateTrip = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const tripData: UpdateTripDto = req.body

      // Validate dates if provided
      if (tripData.startDate && tripData.endDate) {
        const startDate = new Date(tripData.startDate)
        const endDate = new Date(tripData.endDate)

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          res.status(400).json({ message: "Invalid date format" })
          return
        }

        if (startDate > endDate) {
          res.status(400).json({ message: "Start date must be before end date" })
          return
        }
      }

      const updatedTrip = await this.tripService.updateTrip(id, tripData)

      if (!updatedTrip) {
        res.status(404).json({ message: "Trip not found" })
        return
      }

      res.status(200).json(updatedTrip)
    } catch (error) {
      console.error("Error updating trip:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  public deleteTrip = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const deleted = await this.tripService.deleteTrip(id)

      if (!deleted) {
        res.status(404).json({ message: "Trip not found" })
        return
      }

      res.status(204).end()
    } catch (error) {
      console.error("Error deleting trip:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  public addDestinationsToTrip = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const { destinationIds }: TripDestinationDto = req.body

      if (!destinationIds || !Array.isArray(destinationIds) || destinationIds.length === 0) {
        res.status(400).json({ message: "Invalid destination IDs" })
        return
      }

      const success = await this.tripService.addDestinationsToTrip(id, destinationIds)

      if (!success) {
        res.status(404).json({ message: "Trip or destinations not found" })
        return
      }

      res.status(200).json({ message: "Destinations added to trip successfully" })
    } catch (error) {
      console.error("Error adding destinations to trip:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  public removeDestinationFromTrip = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id, destinationId } = req.params
      const success = await this.tripService.removeDestinationFromTrip(id, destinationId)

      if (!success) {
        res.status(404).json({ message: "Trip or destination not found" })
        return
      }

      res.status(200).json({ message: "Destination removed from trip successfully" })
    } catch (error) {
      console.error("Error removing destination from trip:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }
}
