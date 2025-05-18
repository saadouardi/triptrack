"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { getTripStatistics } from "../services/api"
import type { Statistics } from "../types/trip.types"

const Dashboard: React.FC = () => {
  const [statistics, setStatistics] = useState<Statistics | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setLoading(true)
        const data = await getTripStatistics()
        setStatistics(data)
        setError(null)
      } catch (err) {
        setError("Failed to fetch statistics. Please try again later.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchStatistics()
  }, [])

  if (loading) {
    return <div className="text-center p-4">Loading statistics...</div>
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">{error}</div>
  }

  if (!statistics) {
    return <div className="text-center p-4 text-red-500">Statistics not available</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Trip Planner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Trips</h2>
          <p className="text-3xl font-bold text-blue-600">{statistics.totalTrips}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Total Destinations</h2>
          <p className="text-3xl font-bold text-green-600">{statistics.totalDestinations}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Upcoming Trips</h2>
          <p className="text-3xl font-bold text-purple-600">{statistics.upcomingTrips}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Average Trip Duration</h2>
          <p className="text-3xl font-bold text-orange-600">{statistics.averageTripDuration} days</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Trip Status</h2>
          <div className="flex justify-around text-center">
            <div className="px-4">
              <p className="text-2xl font-bold text-green-500">{statistics.upcomingTrips}</p>
              <p className="text-gray-600">Upcoming</p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-bold text-blue-500">{statistics.ongoingTrips}</p>
              <p className="text-gray-600">Ongoing</p>
            </div>
            <div className="px-4">
              <p className="text-2xl font-bold text-gray-500">{statistics.completedTrips}</p>
              <p className="text-gray-600">Completed</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Most Visited Destinations</h2>
          {statistics.mostVisitedDestinations.length > 0 ? (
            <ul className="space-y-2">
              {statistics.mostVisitedDestinations.map((destination) => (
                <li key={destination.id} className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">{destination.name}</span>
                    {destination.location && <span className="text-gray-500 ml-2">({destination.location})</span>}
                  </div>
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                    {destination.tripCount} trips
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-center">No destination data available</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Trips by Month</h2>
          {statistics.tripsByMonth.length > 0 ? (
            <div className="h-64 flex items-end justify-around">
              {statistics.tripsByMonth.map((monthData, index) => {
                const maxCount = Math.max(...statistics.tripsByMonth.map((m) => m.count))
                const height = (monthData.count / maxCount) * 100

                return (
                  <div key={index} className="flex flex-col items-center">
                    <div className="w-12 bg-blue-500 rounded-t-md" style={{ height: `${height}%` }}></div>
                    <p className="text-xs mt-2">{`${monthData.month}/${monthData.year}`}</p>
                    <p className="text-xs font-bold">{monthData.count}</p>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-gray-500 text-center">No monthly data available</p>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-8 space-x-4">
        <Link to="/trips" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          View All Trips
        </Link>
        <Link to="/destinations" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded">
          View All Destinations
        </Link>
      </div>
    </div>
  )
}

export default Dashboard
