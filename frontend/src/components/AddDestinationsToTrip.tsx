"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getDestinations, getTripById, addDestinationsToTrip } from "../services/api"
import type { Destination, Trip } from "../types/trip.types"

const AddDestinationsToTrip: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [trip, setTrip] = useState<Trip | null>(null)
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        if (!id) return

        // Fetch trip and destinations in parallel
        const [tripData, destinationsData] = await Promise.all([getTripById(id), getDestinations()])

        setTrip(tripData)

        // Filter out destinations that are already part of the trip
        const tripDestinationIds = tripData.Destinations?.map((d) => d.id) || []
        const availableDestinations = destinationsData.filter((d) => !tripDestinationIds.includes(d.id))

        setDestinations(availableDestinations)
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

  const handleToggleDestination = (destinationId: string) => {
    setSelectedDestinations((prev) => {
      if (prev.includes(destinationId)) {
        return prev.filter((id) => id !== destinationId)
      } else {
        return [...prev, destinationId]
      }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!id || selectedDestinations.length === 0) return

    try {
      setSubmitting(true)
      setError(null)

      await addDestinationsToTrip(id, selectedDestinations)
      navigate(`/trips/${id}`)
    } catch (err: any) {
      setError(err.message || "Failed to add destinations to trip. Please try again.")
      console.error(err)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="text-center p-4">Loading...</div>
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }

  if (!trip) {
    return <div className="text-center p-4 text-red-500">Trip not found</div>
  }

  if (destinations.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Add Destinations to {trip.name}</h1>
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          No available destinations to add. Please create new destinations first.
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => navigate(`/trips/${id}`)}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Back to Trip
          </button>
          <button
            onClick={() => navigate("/destinations/new")}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            Create New Destination
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add Destinations to {trip.name}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Select destinations to add to your trip. You can select multiple destinations.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations.map((destination) => (
              <div
                key={destination.id}
                className={`border rounded-lg p-4 cursor-pointer ${
                  selectedDestinations.includes(destination.id)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-blue-300"
                }`}
                onClick={() => handleToggleDestination(destination.id)}
              >
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    checked={selectedDestinations.includes(destination.id)}
                    onChange={() => handleToggleDestination(destination.id)}
                    className="mt-1 mr-2"
                  />
                  <div>
                    <h3 className="font-semibold">{destination.name}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{destination.description}</p>
                    {destination.location && (
                      <p className="text-sm text-gray-500 mt-1">Location: {destination.location}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(`/trips/${id}`)}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || selectedDestinations.length === 0}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {submitting ? "Adding..." : "Add Selected Destinations"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddDestinationsToTrip
