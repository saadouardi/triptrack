import type { Request, Response } from "express"
import { DestinationService } from "../services/destination.service"
import type { CreateDestinationDto, UpdateDestinationDto } from "../types/destination.types"

export class DestinationController {
  private destinationService = new DestinationService()

  public getAllDestinations = async (req: Request, res: Response): Promise<void> => {
    try {
      const destinations = await this.destinationService.getAllDestinations()
      res.status(200).json(destinations)
    } catch (error) {
      console.error("Error getting all destinations:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  public getDestinationById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const destination = await this.destinationService.getDestinationById(id)

      if (!destination) {
        res.status(404).json({ message: "Destination not found" })
        return
      }

      res.status(200).json(destination)
    } catch (error) {
      console.error("Error getting destination by ID:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  public createDestination = async (req: Request, res: Response): Promise<void> => {
    try {
      const destinationData: CreateDestinationDto = req.body

      // Validate required fields
      if (!destinationData.name || !destinationData.description) {
        res.status(400).json({ message: "Missing required fields" })
        return
      }

      // Validate dates if provided
      if (destinationData.startDate && destinationData.endDate) {
        const startDate = new Date(destinationData.startDate)
        const endDate = new Date(destinationData.endDate)

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          res.status(400).json({ message: "Invalid date format" })
          return
        }

        if (startDate > endDate) {
          res.status(400).json({ message: "Start date must be before end date" })
          return
        }

        destinationData.startDate = startDate
        destinationData.endDate = endDate
      }

      const destination = await this.destinationService.createDestination(destinationData)
      res.status(201).json(destination)
    } catch (error) {
      console.error("Error creating destination:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  public updateDestination = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const destinationData: UpdateDestinationDto = req.body

      // Validate dates if provided
      if (destinationData.startDate && destinationData.endDate) {
        const startDate = new Date(destinationData.startDate)
        const endDate = new Date(destinationData.endDate)

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          res.status(400).json({ message: "Invalid date format" })
          return
        }

        if (startDate > endDate) {
          res.status(400).json({ message: "Start date must be before end date" })
          return
        }
      }

      const updatedDestination = await this.destinationService.updateDestination(id, destinationData)

      if (!updatedDestination) {
        res.status(404).json({ message: "Destination not found" })
        return
      }

      res.status(200).json(updatedDestination)
    } catch (error) {
      console.error("Error updating destination:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  public deleteDestination = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const deleted = await this.destinationService.deleteDestination(id)

      if (!deleted) {
        res.status(404).json({ message: "Destination not found" })
        return
      }

      res.status(204).end()
    } catch (error) {
      console.error("Error deleting destination:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }

  public getTripsForDestination = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params
      const trips = await this.destinationService.getTripsForDestination(id)
      res.status(200).json(trips)
    } catch (error) {
      console.error("Error getting trips for destination:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }
}
