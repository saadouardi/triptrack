"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getTrips, deleteTrip } from "../services/api"
import type { Trip } from "../types/trip.types"
import { formatDate } from "../utils/dateUtils"
import SearchBar from "./SearchBar"

const TripList: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTrips = async () => {
    try {
      setLoading(true)
      const data = await getTrips()
      setTrips(data)
      setError(null)
    } catch (err) {
      setError("Failed to fetch trips. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrips()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await deleteTrip(id)
        setTrips(trips.filter((trip) => trip.id !== id))
      } catch (err) {
        setError("Failed to delete trip. Please try again later.")
        console.error(err)
      }
    }
  }

  const handleSearch = (searchResults: Trip[]) => {
    setTrips(searchResults)
  }

  const handleResetSearch = () => {
    fetchTrips()
  }

  if (loading) {
    return <div className="text-center p-4">Loading trips...</div>
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Trips</h1>
        <Link to="/trips/new" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Create New Trip
        </Link>
      </div>

      <SearchBar onSearch={handleSearch} onReset={handleResetSearch} />

      {trips.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No trips found. Create your first trip!</p>
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
                <h2 className="text-xl font-semibold mb-2">{trip.name}</h2>
                <p className="text-gray-600 mb-2 line-clamp-2">{trip.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  <p>
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </p>
                  <p>{trip.Destinations?.length || 0} destinations</p>
                </div>
                <div className="flex justify-between">
                  <Link
                    to={`/trips/${trip.id}`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    View Details
                  </Link>
                  <div className="flex space-x-2">
                    <Link
                      to={`/trips/${trip.id}/edit`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(trip.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TripList
