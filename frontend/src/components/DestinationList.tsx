"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getDestinations, deleteDestination } from "../services/api"
import type { Destination } from "../types/trip.types"
import { formatDate } from "../utils/dateUtils"

const DestinationList: React.FC = () => {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true)
        const data = await getDestinations()
        setDestinations(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch destinations. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchDestinations()
  }, [])

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this destination?")) {
      try {
        await deleteDestination(id)
        setDestinations(destinations.filter((destination) => destination.id !== id))
      } catch (err) {
        setError("Failed to delete destination. Please try again later.")
        console.error(err)
      }
    }
  }

  if (loading) {
    return <div className="text-center p-4">Loading destinations...</div>
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Destinations</h1>
        <Link to="/destinations/new" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          Create New Destination
        </Link>
      </div>

      {destinations.length === 0 ? (
        <div className="text-center p-8 bg-gray-100 rounded-lg">
          <p className="text-gray-500">No destinations found. Create your first destination!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((destination) => (
            <div key={destination.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-40 bg-gray-200">
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
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{destination.name}</h2>
                <p className="text-gray-600 mb-2 line-clamp-2">{destination.description}</p>
                {destination.location && (
                  <p className="text-gray-500 mb-2">
                    <strong>Location:</strong> {destination.location}
                  </p>
                )}
                {destination.startDate && destination.endDate && (
                  <p className="text-gray-500 mb-4">
                    <strong>Period:</strong> {formatDate(destination.startDate)} - {formatDate(destination.endDate)}
                  </p>
                )}
                <div className="flex justify-between">
                  <Link
                    to={`/destinations/${destination.id}/trips`}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm"
                  >
                    View Trips
                  </Link>
                  <div className="flex space-x-2">
                    <Link
                      to={`/destinations/${destination.id}/edit`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(destination.id)}
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

export default DestinationList
