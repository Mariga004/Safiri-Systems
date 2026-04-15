"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function BusFormPage() {
  // Router for navigation
  const router = useRouter();
  
  // Get URL parameters (e.g., ?id=5)
  const searchParams = useSearchParams();
  
  // Check if we have a bus ID in the URL
  const busId = searchParams.get("id");
  
  // If busId exists, we're EDITING. If not, we're ADDING
  const isEditing = !!busId;

  // Loading state - only show loading when editing (need to fetch bus data)
  const [loading, setLoading] = useState(isEditing);
  
  // Form data state - stores all input values
  const [formData, setFormData] = useState({
    plateNumber: "",
    model: "",
    capacity: "",
    status: "active",
  });

  // Fetch bus data when editing (runs once when component loads)
  useEffect(() => {
    if (isEditing) {
      fetchBus();
    }
  }, [busId]);

  // Function to fetch existing bus data from API (only for editing)
  const fetchBus = async () => {
    try {
      // Get all buses from API
      const response = await fetch("/api/buses");
      const buses = await response.json();
      
      // Find the specific bus we're editing by ID
      const bus = buses.find((b: any) => b.id === parseInt(busId!));

      // If bus found, populate the form with its data
      if (bus) {
        setFormData({
          plateNumber: bus.plateNumber,
          model: bus.model,
          capacity: bus.capacity.toString(), // Convert number to string for input
          status: bus.status,
        });
      }
      
      // Stop showing loading spinner
      setLoading(false);
    } catch (error) {
      console.error("Error fetching bus:", error);
      setLoading(false);
    }
  };

  // Function to handle form submission (works for both Add and Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevent page refresh on form submit
    e.preventDefault();

    try {
      // Make API call - method and body change based on Add vs Edit
      const response = await fetch("/api/buses", {
        method: isEditing ? "PUT" : "POST", // PUT for edit, POST for add
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEditing
            ? { id: busId, ...formData } // Include ID when editing
            : formData // No ID when adding new bus
        ),
      });

      // If successful, go back to buses list page
      if (response.ok) {
        router.push("/dashboard/buses");
      }
    } catch (error) {
      console.error("Error saving bus:", error);
    }
  };

  // Show loading message while fetching bus data (only when editing)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-900 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-2xl mx-auto">
        {/* Page title - changes based on Add vs Edit */}
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          {isEditing ? "Edit Bus" : "Add New Bus"}
        </h1>

        {/* Form container with amber background */}
        <div className="bg-amber-50 rounded-lg p-8 shadow">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Plate Number Input */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                Plate Number
              </label>
              <input
                type="text"
                required
                maxLength={20}
                value={formData.plateNumber}
                onChange={(e) =>
                  setFormData({ 
                    ...formData, 
                    plateNumber: e.target.value.toUpperCase() // Auto-uppercase
                  })
                }
                placeholder="KCA123A"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
              />
            </div>

            {/* Model Input */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                Model
              </label>
              <input
                type="text"
                required
                maxLength={50}
                value={formData.model}
                onChange={(e) =>
                  setFormData({ ...formData, model: e.target.value })
                }
                placeholder="Toyota Coaster"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
              />
            </div>

            {/* Capacity Input */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                Capacity
              </label>
              <input
                type="number"
                required
                min={1}
                max={100}
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                placeholder="35"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
              />
            </div>

            {/* Status Dropdown */}
            <div>
              <label className="block text-base font-medium text-gray-900 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                // Update formData when user selects
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-4 py-3 text-base text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Under Maintenance</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-4">
            {/* Cancel Button - text link style */}
            <button
                type="button"
                onClick={() => router.push("/dashboard/buses")}
                className="text-gray-700 hover:text-gray-900 font-medium"
            >
                Cancel
            </button>
            
            {/* Submit Button - text link style */}
            <button
                type="submit"
                className="text-blue-600 hover:text-blue-900 font-medium"
            >
                {isEditing ? "Update Bus" : "Add Bus"}
            </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}