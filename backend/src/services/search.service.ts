import { Op } from "sequelize"
import { TripModel } from "../models/trip.model"
import { DestinationModel } from "../models/destination.model"
import type { Trip } from "../types/trip.types"

export class SearchService {
  public async searchTrips(query: { name?: string; date?: string }): Promise<Trip[]> {
    const { name, date } = query
    const whereClause: any = {}

    if (name) {
      whereClause.name = {
        [Op.iLike]: `%${name}%`,
      }
    }

    if (date) {
      const searchDate = new Date(date)
      whereClause[Op.and] = [
        {
          startDate: {
            [Op.lte]: searchDate,
          },
        },
        {
          endDate: {
            [Op.gte]: searchDate,
          },
        },
      ]
    }

    return TripModel.findAll({
      where: whereClause,
      include: [
        {
          model: DestinationModel,
          through: { attributes: [] },
        },
      ],
    })
  }
}
