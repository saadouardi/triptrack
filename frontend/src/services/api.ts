import type {
  Trip,
  CreateTripDto,
  UpdateTripDto,
  Destination,
  CreateDestinationDto,
  UpdateDestinationDto,
  WeatherData,
  Statistics,
} from "../types/trip.types"

const API_URL = "http://localhost:3000/api"

// Trip API calls
export const getTrips = async (): Promise<Trip[]> => {
  const response = await fetch(`${API_URL}/trips`)
  if (!response.ok) {
    throw new Error("Failed to fetch trips")
  }
  return response.json()
}

export const getTripById = async (id: string): Promise<Trip> => {
  const response = await fetch(`${API_URL}/trips/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch trip")
  }
  return response.json()
}

export const createTrip = async (tripData: CreateTripDto): Promise<Trip> => {
  const response = await fetch(`${API_URL}/trips`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to create trip")
  }
  return response.json()
}

export const updateTrip = async (id: string, tripData: UpdateTripDto): Promise<Trip> => {
  const response = await fetch(`${API_URL}/trips/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tripData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to update trip")
  }
  return response.json()
}

export const deleteTrip = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/trips/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete trip")
  }
}

export const addDestinationsToTrip = async (tripId: string, destinationIds: string[]): Promise<void> => {
  const response = await fetch(`${API_URL}/trips/${tripId}/destinations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ destinationIds }),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to add destinations to trip")
  }
}

export const removeDestinationFromTrip = async (tripId: string, destinationId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/trips/${tripId}/destinations/${destinationId}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to remove destination from trip")
  }
}

// Destination API calls
export const getDestinations = async (): Promise<Destination[]> => {
  const response = await fetch(`${API_URL}/destinations`)
  if (!response.ok) {
    throw new Error("Failed to fetch destinations")
  }
  return response.json()
}

export const getDestinationById = async (id: string): Promise<Destination> => {
  const response = await fetch(`${API_URL}/destinations/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch destination")
  }
  return response.json()
}

export const createDestination = async (destinationData: CreateDestinationDto): Promise<Destination> => {
  const response = await fetch(`${API_URL}/destinations`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(destinationData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to create destination")
  }
  return response.json()
}

export const updateDestination = async (id: string, destinationData: UpdateDestinationDto): Promise<Destination> => {
  const response = await fetch(`${API_URL}/destinations/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(destinationData),
  })
  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || "Failed to update destination")
  }
  return response.json()
}

export const deleteDestination = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/destinations/${id}`, {
    method: "DELETE",
  })
  if (!response.ok) {
    throw new Error("Failed to delete destination")
  }
}

export const getTripsForDestination = async (destinationId: string): Promise<Trip[]> => {
  const response = await fetch(`${API_URL}/destinations/${destinationId}/trips`)
  if (!response.ok) {
    throw new Error("Failed to fetch trips for destination")
  }
  return response.json()
}

// Search API calls
export const searchTrips = async (params: { name?: string; date?: string }): Promise<Trip[]> => {
  const queryParams = new URLSearchParams()
  if (params.name) queryParams.append("name", params.name)
  if (params.date) queryParams.append("date", params.date)

  const response = await fetch(`${API_URL}/search/trips?${queryParams.toString()}`)
  if (!response.ok) {
    throw new Error("Failed to search trips")
  }
  return response.json()
}

// Weather API calls (Freestyle Task #2)
export const getWeatherForLocation = async (location: string): Promise<WeatherData> => {
  const response = await fetch(`${API_URL}/weather/${encodeURIComponent(location)}`)
  if (!response.ok) {
    throw new Error("Failed to fetch weather data")
  }
  return response.json()
}

// Statistics API calls (Freestyle Task #1)
export const getTripStatistics = async (): Promise<Statistics> => {
  const response = await fetch(`${API_URL}/statistics`)
  if (!response.ok) {
    throw new Error("Failed to fetch trip statistics")
  }
  return response.json()
}
