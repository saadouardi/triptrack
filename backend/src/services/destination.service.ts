import { DestinationModel } from "../models/destination.model"
import { TripModel } from "../models/trip.model"
import type { CreateDestinationDto, Destination, UpdateDestinationDto } from "../types/destination.types"

export class DestinationService {
  public async getAllDestinations(): Promise<Destination[]> {
    return DestinationModel.findAll()
  }

  public async getDestinationById(id: string): Promise<Destination | null> {
    return DestinationModel.findByPk(id)
  }

  public async createDestination(destinationData: CreateDestinationDto): Promise<Destination> {
    return DestinationModel.create(destinationData)
  }

  public async updateDestination(id: string, destinationData: UpdateDestinationDto): Promise<Destination | null> {
    const destination = await DestinationModel.findByPk(id)
    if (!destination) return null

    return destination.update(destinationData)
  }

  public async deleteDestination(id: string): Promise<boolean> {
    const deleted = await DestinationModel.destroy({ where: { id } })
    return deleted > 0
  }

  public async getTripsForDestination(destinationId: string): Promise<TripModel[]> {
    const destination = await DestinationModel.findByPk(destinationId, {
      include: [
        {
          model: TripModel,
          through: { attributes: [] },
        },
      ],
    })

    if (!destination) return []
    return destination.get("Trips") as TripModel[]
  }
}
