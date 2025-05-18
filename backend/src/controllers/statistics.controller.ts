import type { Request, Response } from "express"
import { StatisticsService } from "../services/statistics.service"

export class StatisticsController {
  private statisticsService = new StatisticsService()

  public getTripStatistics = async (req: Request, res: Response): Promise<void> => {
    try {
      const statistics = await this.statisticsService.getTripStatistics()
      res.status(200).json(statistics)
    } catch (error) {
      console.error("Error getting trip statistics:", error)
      res.status(500).json({ message: "Internal server error" })
    }
  }
}
