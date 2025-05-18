"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { createDestination, getDestinationById, updateDestination } from "../services/api"
import type { CreateDestinationDto, UpdateDestinationDto } from "../types/trip.types"

interface DestinationFormProps {
  isEditing?: boolean
}

const DestinationForm: React.FC<DestinationFormProps> = ({ isEditing = false }) => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<CreateDestinationDto | UpdateDestinationDto>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    location: "",
    activities: [],
    photos: [],
  })
  const [activityInput, setActivityInput] = useState<string>("")
  const [photoInput, setPhotoInput] = useState<string>("")

  useEffect(() => {
    const fetchDestination = async () => {
      if (isEditing && id) {
        try {
          setLoading(true)
          const destination = await getDestinationById(id)

          // Format dates for the form
          const formattedDestination = {
            ...destination,
            startDate: destination.startDate ? destination.startDate.split("T")[0] : "",
            endDate: destination.endDate ? destination.endDate.split("T")[0] : "",
          }

          setFormData(formattedDestination)
          setError(null)
        } catch (err) {
          setError("Failed to fetch destination details. Please try again later.")
          console.error(err)
        } finally {
          setLoading(false)
        }
      }
    }

    fetchDestination()
  }, [isEditing, id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleAddActivity = () => {
    if (activityInput.trim() && formData.activities) {
      setFormData({
        ...formData,
        activities: [...formData.activities, activityInput.trim()],
      })
      setActivityInput("")
    } else if (activityInput.trim()) {
      setFormData({
        ...formData,
        activities: [activityInput.trim()],
      })
      setActivityInput("")
    }
  }

  const handleRemoveActivity = (index: number) => {
    if (formData.activities) {
      const updatedActivities = [...formData.activities]
      updatedActivities.splice(index, 1)
      setFormData({ ...formData, activities: updatedActivities })
    }
  }

  const handleAddPhoto = () => {
    if (photoInput.trim() && formData.photos) {
      setFormData({
        ...formData,
        photos: [...formData.photos, photoInput.trim()],
      })
      setPhotoInput("")
    } else if (photoInput.trim()) {
      setFormData({
        ...formData,
        photos: [photoInput.trim()],
      })
      setPhotoInput("")
    }
  }

  const handleRemovePhoto = (index: number) => {
    if (formData.photos) {
      const updatedPhotos = [...formData.photos]
      updatedPhotos.splice(index, 1)
      setFormData({ ...formData, photos: updatedPhotos })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setLoading(true)
      setError(null)

      if (isEditing && id) {
        await updateDestination(id, formData as UpdateDestinationDto)
      } else {
        await createDestination(formData as CreateDestinationDto)
      }

      navigate("/destinations")
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading && isEditing) {
    return <div className="text-center p-4">Loading destination data...</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{isEditing ? "Edit Destination" : "Create New Destination"}</h1>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
            Destination Name *
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

        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 font-semibold mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location || ""}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="startDate" className="block text-gray-700 font-semibold mb-2">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-gray-700 font-semibold mb-2">
              End Date
            </label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={formData.endDate || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Activities</label>
          <div className="flex">
            <input
              type="text"
              value={activityInput}
              onChange={(e) => setActivityInput(e.target.value)}
              placeholder="Add activity"
              className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddActivity}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
            >
              Add
            </button>
          </div>

          {formData.activities && formData.activities.length > 0 && (
            <div className="mt-2">
              <ul className="bg-gray-100 rounded-lg p-2">
                {formData.activities.map((activity, index) => (
                  <li key={index} className="flex justify-between items-center py-1">
                    <span>{activity}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveActivity(index)}
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

        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">Photos (URLs)</label>
          <div className="flex">
            <input
              type="url"
              value={photoInput}
              onChange={(e) => setPhotoInput(e.target.value)}
              placeholder="Add photo URL"
              className="flex-grow px-3 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleAddPhoto}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg"
            >
              Add
            </button>
          </div>

          {formData.photos && formData.photos.length > 0 && (
            <div className="mt-2">
              <ul className="bg-gray-100 rounded-lg p-2">
                {formData.photos.map((photo, index) => (
                  <li key={index} className="flex justify-between items-center py-1">
                    <a
                      href={photo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline truncate"
                    >
                      {photo}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="text-red-500 hover:text-red-700 ml-2"
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
            onClick={() => navigate("/destinations")}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Saving..." : isEditing ? "Update Destination" : "Create Destination"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default DestinationForm
