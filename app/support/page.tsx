"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function SupportPage() {
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
          <h1 className="text-3xl font-bold text-amber-700 mb-6">Support</h1>
          
          <div className="space-y-4 text-gray-700">
            <p>
              Need help with Safiri Systems? We're here to assist you with any questions or issues.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Contact Information</h2>
            <div className="bg-amber-200 border border-amber-200 rounded-lg p-6 space-y-3">
              <p>
                <strong>Email:</strong> support@safirisystems.com
              </p>
              <p>
                <strong>Phone:</strong> +254 115 619 343
              </p>
              <p>
                <strong>Business Hours:</strong> Monday - Friday, 8:00 AM - 5:00 PM EAT
              </p>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Common Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">How do I reset my password?</h3>
                <p>Click the "Forgot Password" link on the login page and follow the instructions sent to your email.</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">How do I add a new bus to the system?</h3>
                <p>Navigate to the Buses page and click the "+ Add New Bus" button. Fill in the required information and submit.</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">How do I schedule a trip?</h3>
                <p>Go to the Trips page, click "+ Add New Trip", select the bus, route, and driver, then set the departure and arrival times.</p>
              </div>

              <div>
                <h3 className="font-bold text-gray-900 mb-2">How do I track maintenance records?</h3>
                <p>Use the Maintenance page to add, view, and update maintenance records for your fleet.</p>
              </div>
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">Technical Support</h2>
            <p>
              For technical issues or system errors, please contact our support team with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Description of the issue</li>
              <li>Steps to reproduce the problem</li>
              <li>Screenshots (if applicable)</li>
              <li>Your browser and device information</li>
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