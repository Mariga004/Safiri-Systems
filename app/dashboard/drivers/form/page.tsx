"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function DriverFormPage() {
  // Next.js router for navigation
  const router = useRouter();
  
  // Get URL parameters (to detect if editing)
  const searchParams = useSearchParams();
  const driverId = searchParams.get("id");  // Get driver ID from URL (?id=123)
  const isEditing = !!driverId;  // If driverId exists, we're editing

  // Form state - stores all input values
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    licenseNumber: "",
    licenseClass: "",      
    psvBadgeNumber: "",  
    phone: "",
    status: "active",  // Default status
    assignedBusId: "",  // The bus this driver is assigned to
  });

  // State to store list of buses for the dropdown
  const [buses, setBuses] = useState<any[]>([]);
  
  // Loading state
  const [loading, setLoading] = useState(false);

  // When component loads, fetch buses and driver data (if editing)
  useEffect(() => {
    fetchBuses();
    if (isEditing) {
      fetchDriver();
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

  // Fetch driver data when editing
  const fetchDriver = async () => {
    try {
      // Get all drivers
      const response = await fetch("/api/drivers");
      const drivers = await response.json();
      
      // Find the specific driver we're editing
      const driver = drivers.find((d: any) => d.id === parseInt(driverId!));

      if (driver) {
        // Find the active bus assignment (if any)
        const activeAssignment = driver.assignments.find(
          (a: any) => a.status === "active"
        );

        // Pre-fill the form with existing data
        setFormData({
          firstName: driver.firstName,
          lastName: driver.lastName,
          licenseNumber: driver.licenseNumber,
          licenseClass: driver.licenseClass || "",       
          psvBadgeNumber: driver.psvBadgeNumber || "",
          phone: driver.phone,
          status: driver.status,
          // If there's an active assignment, set the bus ID, otherwise empty
          assignedBusId: activeAssignment ? activeAssignment.busId.toString() : "",
        });
      }
    } catch (error) {
      console.error("Error fetching driver:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();  // Prevent page reload
    setLoading(true);  // Show loading state

    try {
      const url = "/api/drivers";
      const method = isEditing ? "PUT" : "POST";  // PUT for update, POST for create
      
      // If editing, include the driver ID in the body
      const body = isEditing
        ? { ...formData, id: parseInt(driverId!) }
        : formData;

      // Send request to API
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      // HANDLE ERRORS FIRST
      if (!response.ok) {
        const data = await response.json();
        alert(data.error); // 👈 NOW YOU WILL SEE THE ERROR
        setLoading(false);
        return;
      }

      // SUCCESS
      router.push("/dashboard/drivers");
          } catch (error) {
            console.error("Error saving driver:", error);
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
          {isEditing ? "Edit Driver" : "Add New Driver"}
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* First Name and Last Name - Side by side on desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name
              </label>
              <input
                type="text"
                required
                maxLength={50}  // Validation: max 50 characters
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="Teddy"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name
              </label>
              <input
                type="text"
                required
                maxLength={50}  // Validation: max 50 characters
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Menza"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
              />
            </div>
          </div>

          {/* License Number - Auto-uppercase */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Number
            </label>
            <input
              type="text"
              required
              maxLength={20}  // Validation: max 20 characters
              value={formData.licenseNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  licenseNumber: e.target.value.toUpperCase(),  // Auto-convert to uppercase
                })
              }
              placeholder="DLR-A1B2C3D4E"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
            />
          </div>
          {/* License Class */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Class
            </label>
            <input
              type="text"
              value={formData.licenseClass}
              onChange={(e) =>
                setFormData({ ...formData, licenseClass: e.target.value.toUpperCase() })
              }
              placeholder="D3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
            />
          </div>

          {/* PSV Badge Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              PSV Badge Number
            </label>
            <input
              type="text"
              value={formData.psvBadgeNumber}
              onChange={(e) =>
                setFormData({ ...formData, psvBadgeNumber: e.target.value.toUpperCase() })
              }
              placeholder="PSV-33410-M"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              required
              maxLength={15}  // Validation: max 15 characters
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="0712345678"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
            />
          </div>

          {/* Assigned Bus Dropdown - THIS IS THE BUS ASSIGNMENT FEATURE! */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assigned Bus (Optional)
            </label>
            <select
              value={formData.assignedBusId}
              onChange={(e) =>
                setFormData({ ...formData, assignedBusId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white text-base"
            >
              {/* First option - No bus assigned */}
              <option value="">No Bus Assigned</option>
              
              {/* Loop through all buses and create an option for each */}
              {buses.map((bus) => (
                <option key={bus.id} value={bus.id}>
                  {bus.plateNumber} - {bus.model}
                </option>
              ))}
            </select>
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
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Form Buttons - Cancel and Submit */}
          <div className="flex justify-between pt-4">
            {/* Cancel Button */}
            <button
              type="button"
              onClick={() => router.push("/dashboard/drivers")}
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
                ? "Update Driver"  // Show when editing
                : "Add Driver"}  {/* Show when adding */}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}