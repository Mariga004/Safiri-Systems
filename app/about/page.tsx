"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function AboutPage() {
  const { isSignedIn } = useUser();
  
  // If signed in, go to dashboard, otherwise go to welcome
  const homeLink = isSignedIn ? "/dashboard" : "/welcome";

  return (
    <div className="min-h-screen bg-amber-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href={homeLink} className="text-2xl font-bold text-amber-700">
            Safiri Systems
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 px-6 py-12">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h1 className="text-3xl font-bold text-amber-700 mb-6">About Safiri Systems</h1>
          
          <div className="space-y-4 text-gray-700">
            <p>
              Safiri Systems is an internal operations management platform designed for bus transport companies 
              to efficiently manage their fleet, routes, drivers, trips, and maintenance schedules.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Our Mission</h2>
            <p>
              To provide a comprehensive, user-friendly system that streamlines bus transport operations 
              and improves administrative efficiency.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Key Features</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Fleet management (buses and drivers)</li>
              <li>Route planning and tracking</li>
              <li>Trip scheduling and monitoring</li>
              <li>Maintenance record keeping</li>
              <li>Real-time operational dashboard</li>
            </ul>
          </div>

          <div className="mt-8">
            <Link 
              href={homeLink}
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Home
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-6 text-center text-sm text-gray-600">
          © 2026 Safiri Systems. All rights reserved.
        </div>
      </footer>
    </div>
  );
}