"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function TripFormPage() {
  // Next.js router for navigation
  const router = useRouter();
  
  // Get URL parameters (to detect if editing)
  const searchParams = useSearchParams();
  const tripId = searchParams.get("id");  // Get trip ID from URL (?id=123)
  const isEditing = !!tripId;  // If tripId exists, we're editing

  // Form state - stores all input values
  const [formData, setFormData] = useState({
    busId: "",
    routeId: "",
    driverId: "",
    departureTime: "",
    arrivalTime: "",
    status: "scheduled",  // Default status
    notes: "",
  });

  // State to store lists for the dropdowns
  const [buses, setBuses] = useState<any[]>([]);
  const [routes, setRoutes] = useState<any[]>([]);
  const [drivers, setDrivers] = useState<any[]>([]);
  
  // Loading state
  const [loading, setLoading] = useState(false);

  // When component loads, fetch buses, routes, drivers, and trip data (if editing)
  useEffect(() => {
    fetchBuses();
    fetchRoutes();
    fetchDrivers();
    
    if (isEditing) {
      fetchTrip();
    }
  }, [isEditing]);

  // Fetch all buses for the dropdown
  const fetchBuses = async () => {
    try {
      const response = await fetch("/api/buses");
      const data = await response.json();
      setBuses(data);  // Store buses in state
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  // Fetch all routes for the dropdown
  const fetchRoutes = async () => {
    try {
      const response = await fetch("/api/routes");
      const data = await response.json();
      setRoutes(data);  // Store routes in state
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  // Fetch all drivers for the dropdown
  const fetchDrivers = async () => {
    try {
      const response = await fetch("/api/drivers");
      const data = await response.json();
      setDrivers(data);  // Store drivers in state
    } catch (error) {
      console.error("Error fetching drivers:", error);
    }
  };

  // Fetch trip data when editing
  const fetchTrip = async () => {
    try {
      // Get all trips
      const response = await fetch("/api/trips");
      const trips = await response.json();
      
      // Find the specific trip we're editing
      const trip = trips.find((t: any) => t.id === parseInt(tripId!));

      if (trip) {
        // Pre-fill the form with existing data
        // Format datetime-local inputs: "YYYY-MM-DDTHH:MM"
        const formatDateTimeLocal = (dateString: string) => {
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          return `${year}-${month}-${day}T${hours}:${minutes}`;
        };

        setFormData({
          busId: trip.busId.toString(),
          routeId: trip.routeId.toString(),
          driverId: trip.driverId.toString(),
          departureTime: formatDateTimeLocal(trip.departureTime),
          arrivalTime: formatDateTimeLocal(trip.arrivalTime),
          status: trip.status,
          notes: trip.notes || "",
        });
      }
    } catch (error) {
      console.error("Error fetching trip:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent page reload
    setLoading(true);  // Show loading state

    try {
      const url = "/api/trips";
      const method = isEditing ? "PUT" : "POST";  // PUT for update, POST for create
      
      // If editing, include the trip ID in the body
      const body = isEditing
        ? { ...formData, id: parseInt(tripId!) }
        : formData;

      // Send request to API
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // If successful, go back to trips list
      if (response.ok) {
        router.push("/dashboard/trips");
      }
    } catch (error) {
      console.error("Error saving trip:", error);
    } finally {
      setLoading(false);  // Stop loading
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* White card container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
        
        {/* Page title - changes based on add/edit mode */}
        <h1 className="text-2xl font-bold text-amber-700 mb-6">
          {isEditing ? "Edit Trip" : "Schedule New Trip"}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Bus Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bus <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.busId}
              onChange={(e) =>
                setFormData({ ...formData, busId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
            >
              <option value="">Select a Bus</option>
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.plateNumber} - {bus.model} ({bus.capacity} seats)
                </option>
              ))}
            </select>
          </div>

          {/* Route Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Route <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.routeId}
              onChange={(e) =>
                setFormData({ ...formData, routeId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
            >
              <option value="">Select a Route</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.name} ({route.origin} → {route.destination})
                </option>
              ))}
            </select>
          </div>

          {/* Driver Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Driver <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.driverId}
              onChange={(e) =>
                setFormData({ ...formData, driverId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
            >
              <option value="">Select a Driver</option>
              {drivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.firstName} {driver.lastName} - {driver.licenseNumber}
                </option>
              ))}
            </select>
          </div>

          {/* Departure and Arrival Time - Side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Departure Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Departure Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.departureTime}
                onChange={(e) =>
                  setFormData({ ...formData, departureTime: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
              />
            </div>

            {/* Arrival Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arrival Time <span className="text-red-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={formData.arrivalTime}
                onChange={(e) =>
                  setFormData({ ...formData, arrivalTime: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
              />
            </div>
          </div>

          {/* Status Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
            >
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Notes (Optional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              placeholder="Any special instructions or notes..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.notes.length}/500 characters
            </p>
          </div>

          {/* Form Buttons - Cancel and Submit */}
          <div className="flex justify-between pt-4">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => router.push("/dashboard/trips")}
              className="text-gray-600 hover:text-gray-900"
              disabled={loading}  // Disable while saving
            >
              Cancel
            </button>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="text-amber-600 hover:text-amber-700 font-medium"
              disabled={loading}  // Disable while saving
            >
              {/* Button text changes based on loading and edit mode */}
              {loading
                ? "Saving..."  // Show while submitting
                : isEditing
                ? "Update Trip"  // Show when editing
                : "Schedule Trip"}  {/* Show when adding */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}