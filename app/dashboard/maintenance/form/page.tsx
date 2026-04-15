"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function MaintenanceFormPage() {
  // Next.js router for navigation
  const router = useRouter();
  
  // Get URL parameters (to detect if editing)
  const searchParams = useSearchParams();
  const maintenanceId = searchParams.get("id");  // Get maintenance ID from URL (?id=123)
  const isEditing = !!maintenanceId;  // If maintenanceId exists, we're editing

  // Form state - stores all input values
  const [formData, setFormData] = useState({
    busId: "",
    type: "oil_change",  // Default type
    description: "",
    scheduledDate: "",
    completedDate: "",
    cost: "",
    status: "scheduled",  // Default status
  });

  // State to store list of buses for the dropdown
  const [buses, setBuses] = useState<any[]>([]);
  
  // Loading state
  const [loading, setLoading] = useState(false);

  // When component loads, fetch buses and maintenance data (if editing)
  useEffect(() => {
    fetchBuses();
    
    if (isEditing) {
      fetchMaintenance();
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

  // Fetch maintenance data when editing
  const fetchMaintenance = async () => {
    try {
      // Get all maintenance records
      const response = await fetch("/api/maintenance");
      const records = await response.json();
      
      // Find the specific record we're editing
      const record = records.find((m: any) => m.id === parseInt(maintenanceId!));

      if (record) {
        // Format dates for date inputs: "YYYY-MM-DD"
        const formatDate = (dateString: string | null) => {
          if (!dateString) return "";
          const date = new Date(dateString);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        // Pre-fill the form with existing data
        setFormData({
          busId: record.busId.toString(),
          type: record.type,
          description: record.description,
          scheduledDate: formatDate(record.scheduledDate),
          completedDate: formatDate(record.completedDate),
          cost: record.cost.toString(),
          status: record.status,
        });
      }
    } catch (error) {
      console.error("Error fetching maintenance:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent page reload
    setLoading(true);  // Show loading state

    try {
      const url = "/api/maintenance";
      const method = isEditing ? "PUT" : "POST";  // PUT for update, POST for create
      
      // If editing, include the maintenance ID in the body
      const body = isEditing
        ? { ...formData, id: parseInt(maintenanceId!) }
        : formData;

      // Send request to API
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // If successful, go back to maintenance list
      if (response.ok) {
        router.push("/dashboard/maintenance");
      }
    } catch (error) {
      console.error("Error saving maintenance:", error);
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
          {isEditing ? "Edit Maintenance Record" : "Add Maintenance Record"}
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
                  {bus.plateNumber} - {bus.model}
                </option>
              ))}
            </select>
          </div>

          {/* Maintenance Type Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maintenance Type <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
            >
              <option value="oil_change">Oil Change</option>
              <option value="tire_replacement">Tire Replacement</option>
              <option value="brake_service">Brake Service</option>
              <option value="engine_repair">Engine Repair</option>
              <option value="transmission_service">Transmission Service</option>
              <option value="ac_service">AC Service</option>
              <option value="battery_replacement">Battery Replacement</option>
              <option value="inspection">Inspection</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe the maintenance work needed..."
              rows={4}
              maxLength={500}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          {/* Scheduled Date and Completed Date - Side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Scheduled Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Scheduled Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.scheduledDate}
                onChange={(e) =>
                  setFormData({ ...formData, scheduledDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
              />
            </div>

            {/* Completed Date (Optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Completed Date (Optional)
              </label>
              <input
                type="date"
                value={formData.completedDate}
                onChange={(e) =>
                  setFormData({ ...formData, completedDate: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
              />
            </div>
          </div>

          {/* Cost */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cost (KES) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.cost}
              onChange={(e) =>
                setFormData({ ...formData, cost: e.target.value })
              }
              placeholder="5000"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
            />
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

          {/* Form Buttons - Cancel and Submit */}
          <div className="flex justify-between pt-4">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => router.push("/dashboard/maintenance")}
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
                ? "Update Maintenance"  // Show when editing
                : "Add Maintenance"}  {/* Show when adding */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}