import type React from "react"
import { Link, useLocation } from "react-router-dom"

const Navbar: React.FC = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`)
  }

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              Trip Planner
            </Link>
          </div>

          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/") ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/trips"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/trips") ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Trips
            </Link>
            <Link
              to="/destinations"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                isActive("/destinations")
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Destinations
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
