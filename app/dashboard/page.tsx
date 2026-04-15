"use client";

import { useState, useEffect } from "react";

// Interface for stats data
interface Stats {
  totalBuses: number;
  activeDrivers: number;
  todaysTrips: number;
  scheduledTrips: number;
  inProgressTrips: number;
  completedTrips: number;
  pendingMaintenance: number;
}

export default function DashboardPage() {
  // State to store statistics
  const [stats, setStats] = useState<Stats>({
    totalBuses: 0,
    activeDrivers: 0,
    todaysTrips: 0,
    scheduledTrips: 0,
    inProgressTrips: 0,
    completedTrips: 0,
    pendingMaintenance: 0,
  });

  // Loading state
  const [loading, setLoading] = useState(true);

  // Fetch stats when component loads
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch all statistics from APIs
  const fetchStats = async () => {
    try {
      // Fetch data from all endpoints simultaneously
      const [busesRes, driversRes, tripsRes, maintenanceRes] = await Promise.all([
        fetch("/api/buses"),
        fetch("/api/drivers"),
        fetch("/api/trips"),
        fetch("/api/maintenance"),
      ]);

      // Parse JSON responses
      const buses = await busesRes.json();
      const drivers = await driversRes.json();
      const trips = await tripsRes.json();
      const maintenance = await maintenanceRes.json();

      // Get today's date (start of day)
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get tomorrow's date (end of today)
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Filter today's trips (trips with departure time today)
      const todaysTrips = trips.filter((trip: any) => {
        const departureDate = new Date(trip.departureTime);
        return departureDate >= today && departureDate < tomorrow;
      });

      // Count trips by status (for today's operations)
      const scheduledTrips = todaysTrips.filter((trip: any) => trip.status === "scheduled").length;
      const inProgressTrips = todaysTrips.filter((trip: any) => trip.status === "in_progress").length;
      const completedTrips = todaysTrips.filter((trip: any) => trip.status === "completed").length;

      // Count active drivers
      const activeDrivers = drivers.filter((driver: any) => driver.status === "active").length;

      // Count pending maintenance (scheduled or in_progress)
      const pendingMaintenance = maintenance.filter(
        (m: any) => m.status === "scheduled" || m.status === "in_progress"
      ).length;

      // Update stats state
      setStats({
        totalBuses: buses.length,
        activeDrivers: activeDrivers,
        todaysTrips: todaysTrips.length,
        scheduledTrips: scheduledTrips,
        inProgressTrips: inProgressTrips,
        completedTrips: completedTrips,
        pendingMaintenance: pendingMaintenance,
      });

      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Welcome Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
        <h1 className="text-3xl font-bold text-amber-700 mb-2">
          Welcome to Safiri Systems
        </h1>
        <p className="text-gray-600">
          Internal Operations Management Dashboard
        </p>
      </div>

      {/* Fleet Overview Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Fleet Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Total Buses */}
          <div className="bg-amber-100 p-6 rounded-lg border border-amber-200">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Total Buses
            </h3>
            <p className="text-4xl font-bold text-gray-900">
              {loading ? "..." : stats.totalBuses}
            </p>
          </div>

          {/* Active Drivers */}
          <div className="bg-amber-100 p-6 rounded-lg border border-amber-200">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Active Drivers
            </h3>
            <p className="text-4xl font-bold text-gray-900">
              {loading ? "..." : stats.activeDrivers}
            </p>
          </div>

          {/* Pending Maintenance */}
          <div className="bg-amber-100 p-6 rounded-lg border border-amber-200">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Pending Maintenance
            </h3>
            <p className="text-4xl font-bold text-gray-900">
              {loading ? "..." : stats.pendingMaintenance}
            </p>
          </div>
        </div>
      </div>

      {/* Today's Operations Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Today's Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Total Today's Trips */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Total Trips Today
            </h3>
            <p className="text-4xl font-bold text-blue-900">
              {loading ? "..." : stats.todaysTrips}
            </p>
          </div>

          {/* Scheduled Trips */}
          <div className="bg-blue-100 p-6 rounded-lg border border-blue-200">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Scheduled
            </h3>
            <p className="text-4xl font-bold text-blue-800">
              {loading ? "..." : stats.scheduledTrips}
            </p>
          </div>

          {/* In Progress Trips */}
          <div className="bg-yellow-100 p-6 rounded-lg border border-yellow-200">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              In Progress
            </h3>
            <p className="text-4xl font-bold text-yellow-800">
              {loading ? "..." : stats.inProgressTrips}
            </p>
          </div>

          {/* Completed Trips */}
          <div className="bg-green-100 p-6 rounded-lg border border-green-200">
            <h3 className="text-gray-600 text-sm font-medium mb-2">
              Completed
            </h3>
            <p className="text-4xl font-bold text-green-800">
              {loading ? "..." : stats.completedTrips}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}