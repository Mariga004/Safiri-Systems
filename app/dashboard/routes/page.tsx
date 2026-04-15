"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Route {
  id: number;
  name: string;
  origin: string;
  destination: string;
  distance: number;
  estimatedTime: string;
  status: string;
  createdAt: string;
}

export default function RoutesPage() {
  const router = useRouter();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [filteredRoutes, setFilteredRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  useEffect(() => {
    const filtered = routes.filter(
      (route) =>
        route.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        route.destination.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRoutes(filtered);
  }, [searchTerm, routes]);

  const fetchRoutes = async () => {
    try {
      const response = await fetch("/api/routes");
      const data = await response.json();
      setRoutes(data);
      setFilteredRoutes(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching routes:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this route?")) return;

    try {
      const response = await fetch(`/api/routes?id=${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchRoutes();
        setOpenDropdown(null);
      }
    } catch (error) {
      console.error("Error deleting route:", error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const displayedRoutes = filteredRoutes.slice(0, entriesPerPage);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-amber-700">Routes</h1>
          <button
            onClick={() => router.push("/dashboard/routes/form")}
            className="bg-amber-700 text-white px-4 md:px-6 py-2 text-sm md:text-base rounded-lg hover:bg-amber-800 font-medium"
          >
            + Add New Route
          </button>
        </div>

        {/* Search and Entries */}
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

          {/* Search */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-900">Search:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search routes..."
              className="border-2 border-gray-400 rounded px-3 py-2 text-sm w-48 text-gray-900 font-medium bg-white placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm">
            {/* DEEP AMBER HEADERS */}
            <thead className="bg-amber-700 border-b border-amber-800">
              <tr>
                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Name
                </th>
                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Origin
                </th>
                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Destination
                </th>
                <th className="hidden md:table-cell px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Distance (km)
                </th>
                <th className="hidden md:table-cell px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Est. Time (Hrs)
                </th>
                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden md:table-cell px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-2 md:px-6 py-3 md:py-4 text-left text-xs font-bold text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : displayedRoutes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
                    No routes found
                  </td>
                </tr>
              ) : (
                displayedRoutes.map((route) => (
                  <tr key={route.id} className="hover:bg-gray-50">
                    <td className="px-2 md:px-6 py-2 md:py-4 font-medium text-gray-900">
                      {route.name}
                    </td>
                    <td className="px-2 md:px-6 py-2 md:py-4 text-gray-700">
                      {route.origin}
                    </td>
                    <td className="px-2 md:px-6 py-2 md:py-4 text-gray-700">
                      {route.destination}
                    </td>
                    <td className="hidden md:table-cell px-2 md:px-6 py-2 md:py-4 text-gray-700">
                      {route.distance}
                    </td>
                    <td className="hidden md:table-cell px-2 md:px-6 py-2 md:py-4 text-gray-700">
                      {route.estimatedTime}
                    </td>
                    <td className="px-2 md:px-6 py-2 md:py-4">
                      <span
                        className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${
                          route.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {route.status}
                      </span>
                    </td>
                    <td className="hidden md:table-cell px-2 md:px-6 py-2 md:py-4 text-gray-700">
                      {formatDate(route.createdAt)}
                    </td>
                    <td className="px-2 md:px-6 py-2 md:py-4 relative">
                      {/* Actions Button */}
                      <button
                        onClick={() =>
                          setOpenDropdown(openDropdown === route.id ? null : route.id)
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

                      {/* Dropdown Menu */}
                      {openDropdown === route.id && (
                        <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                          <button
                            onClick={() => {
                              router.push(`/dashboard/routes/form?id=${route.id}`);
                              setOpenDropdown(null);
                            }}
                            className="block w-full text-left px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(route.id)}
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

        {/* Results info */}
        <div className="mt-4 text-sm font-medium text-gray-900">
          Showing {displayedRoutes.length} of {filteredRoutes.length} routes
        </div>
      </div>
    </div>
  );
}