import type { Request, Response } from "express"
import { SearchService } from "../services/search.service"

export class SearchController {
  private searchService = new SearchService()

  public searchTrips = async (req: Request, res: Response): Promise<void> => {
    try {
      const { name, date } = req.query as { name?: string; date?: string }

      if (!name && !date) {
        res.status(400).json({ message: "At least one search parameter (name or date) is required" })
        return
      }

      // Validate date format if provided
      if (date) {
        const searchDate = new Date(date)
        if (isNaN(searchDate.getTime())) {
          res.status(400).json({ message: "Invalid date format" })
          return
        }
      }

      const trips = await this.searchService.searchTrips({ name, date })
      res.status(200).json(trips)
    } catch (error) {
      console.error("Error searching trips:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }
}
