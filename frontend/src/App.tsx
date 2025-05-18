import type React from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Dashboard from "./components/Dashboard"
import TripList from "./components/TripList"
import TripDetail from "./components/TripDetail"
import TripForm from "./components/TripForm"
import DestinationList from "./components/DestinationList"
import DestinationForm from "./components/DestinationForm"
import AddDestinationsToTrip from "./components/AddDestinationsToTrip"
import DestinationTrips from "./components/DestinationTrips"
import "./App.css"

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />

            {/* Trip Routes */}
            <Route path="/trips" element={<TripList />} />
            <Route path="/trips/new" element={<TripForm />} />
            <Route path="/trips/:id" element={<TripDetail />} />
            <Route path="/trips/:id/edit" element={<TripForm isEditing />} />
            <Route path="/trips/:id/destinations/add" element={<AddDestinationsToTrip />} />

            {/* Destination Routes */}
            <Route path="/destinations" element={<DestinationList />} />
            <Route path="/destinations/new" element={<DestinationForm />} />
            <Route path="/destinations/:id/edit" element={<DestinationForm isEditing />} />
            <Route path="/destinations/:id/trips" element={<DestinationTrips />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
