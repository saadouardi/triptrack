export interface Trip {
  id: string
  name: string
  description: string
  startDate: Date
  endDate: Date
  image?: string
  participants?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface CreateTripDto {
  name: string
  description: string
  startDate: Date
  endDate: Date
  image?: string
  participants?: string[]
}

export interface UpdateTripDto {
  name?: string
  description?: string
  startDate?: Date
  endDate?: Date
  image?: string
  participants?: string[]
}

export interface TripDestinationDto {
  destinationIds: string[]
}
