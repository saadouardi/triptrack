import { TripModel } from "../models/trip.model"
import { DestinationModel } from "../models/destination.model"
import { Op } from "sequelize"

export class StatisticsService {
  public async getTripStatistics(): Promise<any> {
    try {
      const totalTrips = await TripModel.count()
      const totalDestinations = await DestinationModel.count()

      const upcomingTrips = await TripModel.count({
        where: {
          startDate: {
            [Op.gt]: new Date(),
          },
        },
      })

      const ongoingTrips = await TripModel.count({
        where: {
          startDate: {
            [Op.lte]: new Date(),
          },
          endDate: {
            [Op.gte]: new Date(),
          },
        },
      })

      const completedTrips = await TripModel.count({
        where: {
          endDate: {
            [Op.lt]: new Date(),
          },
        },
      })

      const averageTripDuration = await this.calculateAverageTripDuration()
      const mostVisitedDestinations = await this.getMostVisitedDestinations(5)
      const tripsByMonth = await this.getTripsByMonth()

      return {
        totalTrips,
        totalDestinations,
        upcomingTrips,
        ongoingTrips,
        completedTrips,
        averageTripDuration,
        mostVisitedDestinations,
        tripsByMonth,
      }
    } catch (error) {
      console.error("Error getting trip statistics:", error)
      throw error
    }
  }

  private async calculateAverageTripDuration(): Promise<number> {
    const trips = await TripModel.findAll({
      attributes: ["startDate", "endDate"],
    })

    if (trips.length === 0) return 0

    const totalDays = trips.reduce((sum, trip) => {
      const start = new Date(trip.startDate)
      const end = new Date(trip.endDate)
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))
      return sum + days
    }, 0)

    return Math.round(totalDays / trips.length)
  }

  private async getMostVisitedDestinations(limit: number): Promise<any[]> {
    const destinations = await DestinationModel.findAll({
      include: [
        {
          model: TripModel,
          through: { attributes: [] },
        },
      ],
    })

    const destinationsWithCount = destinations.map((destination) => ({
      id: destination.id,
      name: destination.name,
      location: destination.location,
      tripCount: (destination as any).Trips?.length || 0,
    }))

    return destinationsWithCount.sort((a, b) => b.tripCount - a.tripCount).slice(0, limit)
  }

  private async getTripsByMonth(): Promise<any[]> {
    const trips = await TripModel.findAll({
      attributes: ["startDate"],
    })

    const monthCounts: Record<string, number> = {}

    trips.forEach((trip) => {
      const date = new Date(trip.startDate)
      const monthYear = `${date.getFullYear()}-${date.getMonth() + 1}`

      if (!monthCounts[monthYear]) {
        monthCounts[monthYear] = 0
      }

      monthCounts[monthYear]++
    })

    return Object.entries(monthCounts)
      .map(([monthYear, count]) => {
        const [year, month] = monthYear.split("-").map(Number)
        return {
          year,
          month,
          count,
        }
      })
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year
        return a.month - b.month
      })
  }
}
