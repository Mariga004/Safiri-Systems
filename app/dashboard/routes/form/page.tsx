"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RouteFormPage() {
  // Next.js router for navigation
  const router = useRouter();
  
  // Get URL parameters (used to detect if we're editing)
  const searchParams = useSearchParams();
  const routeId = searchParams.get("id"); // Get route ID from URL (?id=123)
  const isEditing = !!routeId; // If routeId exists, we're editing, otherwise adding

  // Form state - stores all input values
  const [formData, setFormData] = useState({
    name: "",
    origin: "",
    destination: "",
    distance: "",
    estimatedTime: "",
    status: "active", // Default status
  });

  // Loading state - shows "Saving..." on button when submitting
  const [loading, setLoading] = useState(false);

  // When component loads, if we're editing, fetch the route data
  useEffect(() => {
    if (isEditing) {
      fetchRoute();
    }
  }, [isEditing]);

  // Fetch route data when editing
  const fetchRoute = async () => {
    try {
      // Get all routes from API
      const response = await fetch("/api/routes");
      const routes = await response.json();
      
      // Find the specific route we want to edit
      const route = routes.find((r: any) => r.id === parseInt(routeId!));
      
      // If route found, pre-fill the form with existing data
      if (route) {
        setFormData({
          name: route.name,
          origin: route.origin,
          destination: route.destination,
          distance: route.distance.toString(), // Convert number to string for input
          estimatedTime: route.estimatedTime,
          status: route.status,
        });
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // Show loading state

    try {
      const url = "/api/routes";
      const method = isEditing ? "PUT" : "POST"; // PUT for update, POST for create
      
      // If editing, include the route ID in the body
      const body = isEditing
        ? { ...formData, id: parseInt(routeId!) }
        : formData;

      // Send request to API
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // If successful, go back to routes list
      if (response.ok) {
        router.push("/dashboard/routes");
      }
    } catch (error) {
      console.error("Error saving route:", error);
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* White card container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
        {/* Page title - changes based on add/edit mode - AMBER COLOR */}
        <h1 className="text-2xl font-bold text-amber-700 mb-6">
          {isEditing ? "Edit Route" : "Add New Route"}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Route Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Route Name
            </label>
            <input
                type="text"
                required
                maxLength={100}
                value={formData.name}
                onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nairobi - Mombasa Express"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
            />
          </div>

          {/* Origin and Destination - Side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Origin */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Origin
                </label>
                <input
                    type="text"
                    required
                    maxLength={50}
                    value={formData.origin}
                    onChange={(e) =>
                        setFormData({ ...formData, origin: e.target.value })
                    }
                    placeholder="Nairobi"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
                />
            </div>

            {/* Destination */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Destination
              </label>
              <input
                type="text"
                required
                value={formData.destination}
                onChange={(e) =>
                  setFormData({ ...formData, destination: e.target.value })
                }
                placeholder="Mombasa"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
              />
            </div>
          </div>

          {/* Distance and Estimated Time - Side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance (km)
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                max="10000"
                required
                value={formData.distance}
                onChange={(e) =>
                    setFormData({ ...formData, distance: e.target.value })
                }
                placeholder="480"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
                />
            </div>

            {/* Estimated Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Time (Hrs)
              </label>
              <input
                type="text"
                required
                maxLength={20}
                value={formData.estimatedTime}
                onChange={(e) =>
                    setFormData({ ...formData, estimatedTime: e.target.value })
                }
                placeholder="6 hours"
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
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Form Buttons - Cancel and Submit */}
          <div className="flex justify-between pt-4">
            {/* Cancel Button - Goes back to routes list */}
            <button
              type="button"
              onClick={() => router.push("/dashboard/routes")}
              className="text-gray-600 hover:text-gray-900"
              disabled={loading} // Disable while saving
            >
              Cancel
            </button>
            
            {/* Submit Button - AMBER COLOR */}
            <button
              type="submit"
              className="text-amber-600 hover:text-amber-700 font-medium"
              disabled={loading} // Disable while saving
            >
              {/* Button text changes based on loading and edit mode */}
              {loading
                ? "Saving..." // Show while submitting
                : isEditing
                ? "Update Route" // Show when editing
                : "Add Route"} {/* Show when adding */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}