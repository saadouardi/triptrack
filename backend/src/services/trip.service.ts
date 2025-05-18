import { TripModel } from "../models/trip.model"
import { DestinationModel } from "../models/destination.model"
import { TripDestinationModel } from "../models/trip-destination.model"
import type { CreateTripDto, Trip, UpdateTripDto } from "../types/trip.types"

export class TripService {
  public async getAllTrips(): Promise<Trip[]> {
    return TripModel.findAll({
      include: [
        {
          model: DestinationModel,
          through: { attributes: [] },
        },
      ],
    })
  }

  public async getTripById(id: string): Promise<Trip | null> {
    return TripModel.findByPk(id, {
      include: [
        {
          model: DestinationModel,
          through: { attributes: [] },
        },
      ],
    })
  }

  public async createTrip(tripData: CreateTripDto): Promise<Trip> {
    return TripModel.create(tripData)
  }

  public async updateTrip(id: string, tripData: UpdateTripDto): Promise<Trip | null> {
    const trip = await TripModel.findByPk(id)
    if (!trip) return null

    return trip.update(tripData)
  }

  public async deleteTrip(id: string): Promise<boolean> {
    const deleted = await TripModel.destroy({ where: { id } })
    return deleted > 0
  }

  public async addDestinationsToTrip(tripId: string, destinationIds: string[]): Promise<boolean> {
    const trip = await TripModel.findByPk(tripId)
    if (!trip) return false

    const destinations = await DestinationModel.findAll({
      where: { id: destinationIds },
    })

    if (destinations.length !== destinationIds.length) return false

    const tripDestinations = destinationIds.map((destId, index) => ({
      tripId,
      destinationId: destId,
      order: index + 1,
    }))

    await TripDestinationModel.bulkCreate(tripDestinations)
    return true
  }

  public async removeDestinationFromTrip(tripId: string, destinationId: string): Promise<boolean> {
    const deleted = await TripDestinationModel.destroy({
      where: { tripId, destinationId },
    })
    return deleted > 0
  }

  public async searchTripsByName(name: string): Promise<Trip[]> {
    return TripModel.findAll({
      where: {
        name: {
          [Symbol.for("like")]: `%${name}%`,
        },
      },
      include: [
        {
          model: DestinationModel,
          through: { attributes: [] },
        },
      ],
    })
  }

  public async searchTripsByDate(date: Date): Promise<Trip[]> {
    return TripModel.findAll({
      where: {
        [Symbol.for("or")]: [
          {
            startDate: {
              [Symbol.for("lte")]: date,
            },
            endDate: {
              [Symbol.for("gte")]: date,
            },
          },
        ],
      },
      include: [
        {
          model: DestinationModel,
          through: { attributes: [] },
        },
      ],
    })
  }
}
