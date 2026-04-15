"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-amber-700 mb-6">Privacy Policy</h1>
          
          <div className="space-y-4 text-gray-700">
            <p className="text-sm text-gray-500">Last Updated: March 20, 2026</p>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Information We Collect</h2>
            <p>
              Safiri Systems is an internal management platform. We collect and store operational data including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Bus information (plate numbers, models, capacity)</li>
              <li>Driver information (names, license numbers, contact details)</li>
              <li>Route details</li>
              <li>Trip schedules</li>
              <li>Maintenance records</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. How We Use Information</h2>
            <p>
              All collected data is used solely for internal operations management purposes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fleet management and tracking</li>
              <li>Trip scheduling and monitoring</li>
              <li>Maintenance planning</li>
              <li>Operational reporting</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect your data:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Secure authentication via Clerk</li>
              <li>Encrypted database connections</li>
              <li>Access control and user permissions</li>
              <li>Regular security updates</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Data Retention</h2>
            <p>
              Operational data is retained for record-keeping and reporting purposes. 
              Historical data helps in analyzing trends and making informed decisions.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. Contact</h2>
            <p>
              For privacy-related questions, please contact:<br />
              Email: support@safirisystems.com
            </p>
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