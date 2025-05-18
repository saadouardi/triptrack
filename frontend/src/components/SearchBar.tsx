"use client"

import type React from "react"
import { useState } from "react"
import { searchTrips } from "../services/api"
import type { Trip } from "../types/trip.types"

interface SearchBarProps {
  onSearch: (results: Trip[]) => void
  onReset: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onReset }) => {
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [searchDate, setSearchDate] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchTerm && !searchDate) {
      setError("Please enter a search term or date")
      return
    }

    try {
      setLoading(true)
      setError(null)

      const searchParams: { name?: string; date?: string } = {}
      if (searchTerm) searchParams.name = searchTerm
      if (searchDate) searchParams.date = searchDate

      const results = await searchTrips(searchParams)
      onSearch(results)
    } catch (err) {
      setError("Failed to search trips. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSearchTerm("")
    setSearchDate("")
    setError(null)
    onReset()
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="searchTerm" className="block text-gray-700 font-medium mb-1">
              Search by Name
            </label>
            <input
              type="text"
              id="searchTerm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter trip name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="searchDate" className="block text-gray-700 font-medium mb-1">
              Search by Date
            </label>
            <input
              type="date"
              id="searchDate"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading || (!searchTerm && !searchDate)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default SearchBar
