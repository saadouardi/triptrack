"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { getTripById, removeDestinationFromTrip, getWeatherForLocation } from "../services/api"
import type { Trip, WeatherData } from "../types/trip.types"
import { formatDate } from "../utils/dateUtils"

const TripDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [weatherLoading, setWeatherLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        setLoading(true)
        if (!id) return
        const data = await getTripById(id)
        setTrip(data)
        setError(null)

        // If the trip has destinations with locations, fetch weather for the first one
        if (data.Destinations && data.Destinations.length > 0 && data.Destinations[0].location) {
          fetchWeather(data.Destinations[0].location)
        }
      } catch (err) {
        setError("Failed to fetch trip details. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchTrip()
  }, [id])

  const fetchWeather = async (location: string) => {
    try {
      setWeatherLoading(true)
      const data = await getWeatherForLocation(location)
      setWeather(data)
    } catch (err) {
      console.error("Failed to fetch weather data:", err)
    } finally {
      setWeatherLoading(false)
    }
  }

  const handleRemoveDestination = async (destinationId: string) => {
    if (!id) return
    if (window.confirm("Are you sure you want to remove this destination from the trip?")) {
      try {
        await removeDestinationFromTrip(id, destinationId)
        // Update the trip state by removing the destination
        if (trip) {
          setTrip({
            ...trip,
            Destinations: trip.Destinations?.filter((dest) => dest.id !== destinationId) || [],
          })
        }
      } catch (err) {
        setError("Failed to remove destination. Please try again later.")
        console.error(err)
      }
    }
  }

  if (loading) {
    return <div className="text-center p-4">Loading trip details...</div>
  }

  if (error || !trip) {
    return <div className="text-center p-4 text-red-500">{error || "Trip not found"}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link to="/trips" className="text-blue-500 hover:underline">
          &larr; Back to Trips
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="h-64 bg-gray-200">
          {trip.image ? (
            <img src={trip.image || "/placeholder.svg"} alt={trip.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{trip.name}</h1>
            <div className="flex space-x-2">
              <Link
                to={`/trips/${trip.id}/edit`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
              >
                Edit Trip
              </Link>
              <Link
                to={`/trips/${trip.id}/destinations/add`}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Add Destinations
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-gray-700 mb-4">{trip.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">
                  <strong>Start Date:</strong> {formatDate(trip.startDate)}
                </p>
                <p className="text-gray-600">
                  <strong>End Date:</strong> {formatDate(trip.endDate)}
                </p>
              </div>
              <div>
                {trip.participants && trip.participants.length > 0 && (
                  <div>
                    <p className="text-gray-600">
                      <strong>Participants:</strong>
                    </p>
                    <ul className="list-disc list-inside">
                      {trip.participants.map((participant, index) => (
                        <li key={index} className="text-gray-600">
                          {participant}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4">Destinations</h2>

            {trip.Destinations && trip.Destinations.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trip.Destinations.map((destination) => (
                  <div key={destination.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold mb-2">{destination.name}</h3>
                      <button
                        onClick={() => handleRemoveDestination(destination.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                    <p className="text-gray-600 mb-2">{destination.description}</p>
                    {destination.location && (
                      <p className="text-gray-600">
                        <strong>Location:</strong> {destination.location}
                      </p>
                    )}
                    {destination.startDate && destination.endDate && (
                      <p className="text-gray-600">
                        <strong>Period:</strong> {formatDate(destination.startDate)} - {formatDate(destination.endDate)}
                      </p>
                    )}
                    {destination.activities && destination.activities.length > 0 && (
                      <div className="mt-2">
                        <p className="text-gray-600">
                          <strong>Activities:</strong>
                        </p>
                        <ul className="list-disc list-inside">
                          {destination.activities.map((activity, index) => (
                            <li key={index} className="text-gray-600">
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {destination.location && destination.id === trip.Destinations?.[0].id && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold mb-2">Weather in {destination.location}</h4>
                        {weatherLoading ? (
                          <p>Loading weather data...</p>
                        ) : weather ? (
                          <div className="flex items-center">
                            <img
                              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}.png`}
                              alt={weather.weather[0].description}
                              className="w-12 h-12"
                            />
                            <div>
                              <p className="font-bold">{Math.round(weather.main.temp)}°C</p>
                              <p className="capitalize">{weather.weather[0].description}</p>
                            </div>
                          </div>
                        ) : (
                          <p>Weather data not available</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 bg-gray-100 rounded-lg">
                <p className="text-gray-500">No destinations added to this trip yet.</p>
                <Link
                  to={`/trips/${trip.id}/destinations/add`}
                  className="mt-4 inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Add Destinations
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TripDetail
