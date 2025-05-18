"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getDestinationById, getTripsForDestination } from "../services/api"
import type { Destination, Trip } from "../types/trip.types"
import { formatDate } from "../utils/dateUtils"

const DestinationTrips: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const [destination, setDestination] = useState<Destination | null>(null)
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (!id) return

        // Fetch destination and its trips in parallel
        const [destinationData, tripsData] = await Promise.all([getDestinationById(id), getTripsForDestination(id)])

        setDestination(destinationData)
        setTrips(tripsData)
        setError(null)
      } catch (err) {
        setError("Failed to fetch data. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }

  if (!destination) {
    return <div className="text-center p-4 text-red-500">Destination not found</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Link to="/destinations" className="text-blue-500 hover:underline">
          &larr; Back to Destinations
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="h-48 bg-gray-200">
          {destination.photos && destination.photos.length > 0 ? (
            <img
              src={destination.photos[0] || "/placeholder.svg"}
              alt={destination.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-300">
              <span className="text-gray-500">No image</span>
            </div>
          )}
        </div>
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{destination.name}</h1>
          <p className="text-gray-700 mb-4">{destination.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
          </div>

          {destination.activities && destination.activities.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold mb-2">Activities</h2>
              <ul className="list-disc list-inside">
                {destination.activities.map((activity, index) => (
                  <li key={index} className="text-gray-600">
                    {activity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Trips Including This Destination</h2>

      {trips.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No trips include this destination yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <div key={trip.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-gray-200">
                {trip.image ? (
                  <img src={trip.image || "/placeholder.svg"} alt={trip.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300">
                    <span className="text-gray-500">No image</span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{trip.name}</h3>
                <p className="text-gray-600 mb-2 line-clamp-2">{trip.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </p>
                  <p>{trip.Destinations?.length || 0} destinations</p>
                </div>
                <Link
                  to={`/trips/${trip.id}`}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                >
                  View Trip Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default DestinationTrips
