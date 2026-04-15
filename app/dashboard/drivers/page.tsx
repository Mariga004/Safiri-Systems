"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// TypeScript interface for Driver with bus assignments
interface Driver {
  id: number;
  firstName: string;
  lastName: string;
  licenseNumber: string;
  licenseClass?: string; 
  psvBadgeNumber?: string;
  phone: string;
  status: string;
  createdAt: string;
  assignments: Array<{  // Array of bus assignments from BusDriver table
    status: string;  // active or inactive
    bus: {  // Bus details
      plateNumber: string;
      model: string;
    };
  }>;
}

export default function DriversPage() {
  // Next.js router for navigation
  const router = useRouter();
  
  // State to store all drivers from database
  const [drivers, setDrivers] = useState<Driver[]>([]);
  
  // State for filtered drivers (after search)
  const [filteredDrivers, setFilteredDrivers] = useState<Driver[]>([]);
  
  // Loading state
  const [loading, setLoading] = useState(true);
  
  // Search term state
  const [searchTerm, setSearchTerm] = useState("");
  
  // How many entries to show per page
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  
  // Track which dropdown is open (by driver ID)
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  // Fetch drivers when component loads
  useEffect(() => {
    fetchDrivers();
  }, []);

  // Filter drivers whenever search term or drivers list changes
  useEffect(() => {
    const filtered = drivers.filter(
      (driver) =>
        // Search in first name
        driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search in last name
        driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search in license number
        driver.licenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // Search in phone
        driver.phone.includes(searchTerm)
    );
    setFilteredDrivers(filtered);
  }, [searchTerm, drivers]);

  // Fetch all drivers from API
  const fetchDrivers = async () => {
    try {
      const response = await fetch("/api/drivers");
      const data = await response.json();
      setDrivers(data);  // Store in state
      setFilteredDrivers(data);  // Also set filtered list
      setLoading(false);  // Stop loading
    } catch (error) {
      console.error("Error fetching drivers:", error);
      setLoading(false);
    }
  };

  // Delete a driver
  const handleDelete = async (id: number) => {
    // Ask for confirmation
    if (!confirm("Are you sure you want to delete this driver?")) return;

    try {
      // Send DELETE request to API
      const response = await fetch(`/api/drivers?id=${id}`, {
        method: "DELETE",
      });

      // If successful, refresh the list
      if (response.ok) {
        fetchDrivers();
        setOpenDropdown(null);  // Close any open dropdown
      }
    } catch (error) {
      console.error("Error deleting driver:", error);
    }
  };

  // Format date to readable string
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get the bus assigned to this driver
  // Returns "Not Assigned" if no active assignment
  const getAssignedBus = (driver: Driver) => {
    // Find active assignment (status = "active")
    const activeBus = driver.assignments.find((assignment) => assignment.status === "active");
    
    if (activeBus) {
      // Return formatted string with plate number and model
      return `${activeBus.bus.plateNumber} - ${activeBus.bus.model}`;
    }
    
    return "Not Assigned";
  };

  // Limit displayed drivers to entriesPerPage
  const displayedDrivers = filteredDrivers.slice(0, entriesPerPage);

  return (
    <div className="max-w-6xl mx-auto">
      {/* White card container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        
        {/* Header with title and Add button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-700">Drivers</h1>
          <button
            onClick={() => router.push("/dashboard/drivers/form")}
            className="bg-amber-700 text-white px-4 md:px-6 py-2 text-sm md:text-base rounded-lg hover:bg-amber-800 font-medium"
          >
            + Add New Driver
          </button>
        </div>

        {/* Search and Entries controls */}
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
          
          {/* Show entries dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-900">Show</label>
            <select
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(Number(e.target.value))}
              className="border-2 border-gray-400 rounded px-3 py-2 text-sm font-medium text-gray-900 bg-white"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <label className="text-sm font-medium text-gray-900">entries</label>
          </div>

          {/* Search input */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-900">Search:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search drivers..."
              className="border-2 border-gray-400 rounded px-3 py-2 text-sm w-48 text-gray-900 font-medium bg-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            
            {/* Table Headers - Deep amber background */}
            <thead className="bg-amber-700 border-b border-amber-800">
              <tr>
                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  License No.
                </th>
                <th className="hidden md:table-cell px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase">
                  License Class
                </th>
                <th className="hidden md:table-cell px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase">
                  PSV Badge No
                </th>
                <th className="hidden md:table-cell px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Phone
                </th>
                <th className="hidden md:table-cell px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Assigned Bus
                </th>
                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden md:table-cell px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                Added On
                </th>
                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
<tbody className="bg-white divide-y divide-gray-200">
  {loading ? (
    <tr>
      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
        Loading...
      </td>
    </tr>
  ) : displayedDrivers.length === 0 ? (
    <tr>
      <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
        No drivers found
      </td>
    </tr>
  ) : (
    displayedDrivers.map((driver) => (
      <tr key={driver.id} className="hover:bg-gray-50">
        {/* Full Name */}
        <td className="px-2 md:px-6 py-2 md:py-4 font-medium text-gray-900">
          {driver.firstName} {driver.lastName}
        </td>
        
        {/* License Number */}
        <td className="px-2 md:px-6 py-2 md:py-4 text-gray-700">
          {driver.licenseNumber}
        </td>

        <td className="hidden md:table-cell px-2 md:px-6 py-2 md:py-4 text-gray-700">
          {driver.licenseClass || "-"}
        </td>

        <td className="hidden md:table-cell px-2 md:px-6 py-2 md:py-4 text-gray-700">
          {driver.psvBadgeNumber || "-"}
        </td>

        {/* Phone (hidden on mobile) */} 
        <td className="hidden md:table-cell px-2 md:px-6 py-2 md:py-4 text-gray-700"> 
          {driver.phone} 
        </td>
        
        {/* Assigned Bus (hidden on mobile) */}
        <td className="hidden md:table-cell px-2 md:px-6 py-2 md:py-4 text-gray-700">
          {getAssignedBus(driver)}
        </td>
        
        {/* Status Badge */}
        <td className="px-2 md:px-6 py-2 md:py-4">
          <span
            className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
              driver.status === "active"
                ? "bg-green-100 text-green-800"
                : driver.status === "on_leave"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {driver.status}
          </span>
        </td>
        
        {/* Created Date (hidden on mobile) */}
        <td className="hidden md:table-cell px-2 md:px-6 py-2 md:py-4 text-gray-700">
          {formatDate(driver.createdAt)}
        </td>
        
        {/* Actions Dropdown */}
        <td className="px-2 md:px-6 py-2 md:py-4 relative">
          <button
            onClick={() =>
              setOpenDropdown(openDropdown === driver.id ? null : driver.id)
            }
            className="bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 font-medium flex items-center gap-1"
          >
            Actions
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {openDropdown === driver.id && (
            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg z-20 border border-gray-200">
              <button
                onClick={() => {
                  router.push(`/dashboard/drivers/form?id=${driver.id}`);
                  setOpenDropdown(null);
                }}
                className="block w-full text-left px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 font-medium"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(driver.id)}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </td>
      </tr>
    ))
  )}
</tbody>
          </table>
        </div>

        {/* Results Counter */}
        <div className="mt-4 text-sm font-medium text-gray-900">
          Showing {displayedDrivers.length} of {filteredDrivers.length} drivers
        </div>
      </div>
    </div>
  );
}