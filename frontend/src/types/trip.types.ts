export interface Trip {
  id: string
  name: string
  description: string
  startDate: string
  endDate: string
  image?: string
  participants?: string[]
  createdAt: string
  updatedAt: string
  Destinations?: Destination[]
}

export interface CreateTripDto {
  name: string
  description: string
  startDate: string
  endDate: string
  image?: string
  participants?: string[]
}

export interface UpdateTripDto {
  name?: string
  description?: string
  startDate?: string
  endDate?: string
  image?: string
  participants?: string[]
}

export interface TripDestinationDto {
  destinationIds: string[]
}

export interface Destination {
  id: string
  name: string
  description: string
  startDate?: string
  endDate?: string
  activities?: string[]
  photos?: string[]
  location?: string
  createdAt: string
  updatedAt: string
}

export interface CreateDestinationDto {
  name: string
  description: string
  startDate?: string
  endDate?: string
  activities?: string[]
  photos?: string[]
  location?: string
}

export interface UpdateDestinationDto {
  name?: string
  description?: string
  startDate?: string
  endDate?: string
  activities?: string[]
  photos?: string[]
  location?: string
}

export interface WeatherData {
  main: {
    temp: number
    feels_like: number
    humidity: number
  }
  weather: {
    id: number
    main: string
    description: string
    icon: string
  }[]
  name: string
}

export interface Statistics {
  totalTrips: number
  totalDestinations: number
  upcomingTrips: number
  ongoingTrips: number
  completedTrips: number
  averageTripDuration: number
  mostVisitedDestinations: {
    id: string
    name: string
    location: string
    tripCount: number
  }[]
  tripsByMonth: {
    year: number
    month: number
    count: number
  }[]
}
