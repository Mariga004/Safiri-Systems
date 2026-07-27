"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";

interface Trip {
  id: number;
  departureTime: string;
  arrivalTime: string;
  status: string;
  notes: string;
  createdAt: string;
  bus: {
    plateNumber: string;
    model: string;
  };
  route: {
    name: string;
    origin: string;
    destination: string;
  };
  driver: {
    firstName: string;
    lastName: string;
  };
}

export default function TripsPage() {
  const router = useRouter();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    const filtered = trips.filter(
      (trip) =>
        trip.bus.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.driver.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.driver.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trip.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTrips(filtered);
  }, [searchTerm, trips]);

  const fetchTrips = async () => {
    try {
      const response = await fetch("/api/trips");
      const data = await response.json();
      setTrips(data);
      setFilteredTrips(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching trips:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;

    try {
      const response = await fetch(`/api/trips?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTrips();
        setOpenDropdown(null);
      }
    } catch (error) {
      console.error("Error deleting trip:", error);
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const displayedTrips = filteredTrips.slice(0, entriesPerPage);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-700">Trips</h1>
          {isAdmin && (
            <button
              onClick={() => router.push("/dashboard/trips/form")}
              className="bg-amber-700 text-white px-4 md:px-6 py-2 text-sm md:text-base rounded-lg hover:bg-amber-800 font-medium"
            >
              + Add New Trip
            </button>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
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

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-900">Search:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search trips..."
              className="border-2 border-gray-400 rounded px-3 py-2 text-sm w-48 text-gray-900 font-medium bg-white placeholder:text-gray-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            <thead className="bg-amber-700 border-b border-amber-800">
              <tr>
                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Bus
                </th>
                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Route
                </th>
                <th className="hidden md:table-cell px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Departure
                </th>
                <th className="hidden md:table-cell px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Arrival
                </th>
                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : displayedTrips.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No trips found
                  </td>
                </tr>
              ) : (
                displayedTrips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50">
                    
                    <td className="px-2 md:px-6 py-2 md:py-4 font-medium text-gray-900">
                      <div>{trip.bus.plateNumber}</div>
                      <div className="text-xs text-gray-500">{trip.bus.model}</div>
                    </td>
                    
                    <td className="px-2 md:px-6 py-2 md:py-4 text-gray-700">
                      <div className="font-medium">{trip.route.name}</div>
                      <div className="text-xs text-gray-500">
                        {trip.route.origin} → {trip.route.destination}
                      </div>
                    </td>
                    
                    <td className="hidden md:table-cell px-2 md:px-6 py-2 md:py-4 text-gray-700">
                      {trip.driver.firstName} {trip.driver.lastName}
                    </td>
                    
                    <td className="px-2 md:px-6 py-2 md:py-4 text-gray-700">
                      {formatDateTime(trip.departureTime)}
                    </td>
                    
                    <td className="hidden md:table-cell px-2 md:px-6 py-2 md:py-4 text-gray-700">
                      {formatDateTime(trip.arrivalTime)}
                    </td>
                    
                    <td className="px-2 md:px-6 py-2 md:py-4">
                      <span
                        className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                          trip.status === "scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : trip.status === "in_progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : trip.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {trip.status}
                      </span>
                    </td>
                    
                    <td className="px-2 md:px-6 py-2 md:py-4 relative">
                      {isAdmin ? (
                        <>
                          <button
                            onClick={() =>
                              setOpenDropdown(openDropdown === trip.id ? null : trip.id)
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

                          {openDropdown === trip.id && (
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                              <button
                                onClick={() => {
                                  router.push(`/dashboard/trips/form?id=${trip.id}`);
                                  setOpenDropdown(null);
                                }}
                                className="block w-full text-left px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 font-medium"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(trip.id)}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">View only</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-sm font-medium text-gray-900">
          Showing {displayedTrips.length} of {filteredTrips.length} trips
        </div>
      </div>
    </div>
  );
}