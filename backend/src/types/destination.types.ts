export interface Destination {
  id: string
  name: string
  description: string
  startDate?: Date
  endDate?: Date
  activities?: string[]
  photos?: string[]
  location?: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateDestinationDto {
  name: string
  description: string
  startDate?: Date
  endDate?: Date
  activities?: string[]
  photos?: string[]
  location?: string
}

export interface UpdateDestinationDto {
  name?: string
  description?: string
  startDate?: Date
  endDate?: Date
  activities?: string[]
  photos?: string[]
  location?: string
}
