"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { createTrip, getTripById, updateTrip } from "../services/api"
import type { CreateTripDto, UpdateTripDto } from "../types/trip.types"

interface TripFormProps {
  isEditing?: boolean
}

const TripForm: React.FC<TripFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateTripDto | UpdateTripDto>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    image: "",
    participants: [],
  })
  const [participantInput, setParticipantInput] = useState<string>("")

  useEffect(() => {
    const fetchTrip = async () => {
      if (isEditing && id) {
        try {
          setLoading(true)
          const trip = await getTripById(id)

          // Format dates for the form
          const formattedTrip = {
            ...trip,
            startDate: trip.startDate.split("T")[0],
            endDate: trip.endDate.split("T")[0],
          }

          setFormData(formattedTrip)
          setError(null)
        } catch (err) {
          setError("Failed to fetch trip details. Please try again later.")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchTrip()
  }, [isEditing, id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddParticipant = () => {
    if (participantInput.trim() && formData.participants) {
      setFormData({
        ...formData,
        participants: [...formData.participants, participantInput.trim()],
      })
      setParticipantInput("")
    } else if (participantInput.trim()) {
      setFormData({
        ...formData,
        participants: [participantInput.trim()],
      })
      setParticipantInput("")
    }
  }

  const handleRemoveParticipant = (index: number) => {
    if (formData.participants) {
      const updatedParticipants = [...formData.participants]
      updatedParticipants.splice(index, 1)
      setFormData({ ...formData, participants: updatedParticipants })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      if (isEditing && id) {
        await updateTrip(id, formData as UpdateTripDto)
      } else {
        await createTrip(formData as CreateTripDto)
      }

      navigate("/trips")
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return <div className="text-center p-4">Loading trip data...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? "Edit Trip" : "Create New Trip"}</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
            Trip Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="startDate" className="block text-gray-700 font-semibold mb-2">
              Start Date *
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-gray-700 font-semibold mb-2">
              End Date *
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">
            Image URL
          </label>
          <input
            type="url"
            id="image"
            name="image"
            value={formData.image || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Participants</label>
          <div className="flex">
            <input
              type="text"
              value={participantInput}
              onChange={(e) => setParticipantInput(e.target.value)}
              placeholder="Add participant"
              className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddParticipant}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
            >
              Add
            </button>
          </div>

          {formData.participants && formData.participants.length > 0 && (
            <div className="mt-2">
              <ul className="bg-gray-100 rounded-lg p-2">
                {formData.participants.map((participant, index) => (
                  <li key={index} className="flex justify-between items-center py-1">
                    <span>{participant}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveParticipant(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/trips")}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditing ? "Update Trip" : "Create Trip"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default TripForm
