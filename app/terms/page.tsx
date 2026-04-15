"use client";

import Link from "next/link";
import { useUser } from "@clerk/nextjs";

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-amber-700 mb-6">Terms of Service</h1>
          
          <div className="space-y-4 text-gray-700">
            <p className="text-sm text-gray-500">Last Updated: March 20, 2026</p>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">1. Acceptance of Terms</h2>
            <p>
              By accessing and using Safiri Systems, you agree to be bound by these Terms of Service. 
              This platform is designed for internal business operations only.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">2. Authorized Use</h2>
            <p>
              This system is intended for authorized personnel only. Users must:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Maintain confidentiality of login credentials</li>
              <li>Use the system for business purposes only</li>
              <li>Not share access with unauthorized individuals</li>
              <li>Report any security concerns immediately</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">3. User Responsibilities</h2>
            <p>
              Users are responsible for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Accurate data entry and record keeping</li>
              <li>Maintaining data integrity</li>
              <li>Following company operational procedures</li>
              <li>Protecting sensitive business information</li>
            </ul>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">4. Data Accuracy</h2>
            <p>
              While we strive to maintain accurate records, users are responsible for verifying 
              critical information before making operational decisions.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">5. System Availability</h2>
            <p>
              We aim to provide continuous access to the system but do not guarantee 100% uptime. 
              Scheduled maintenance and updates may temporarily interrupt service.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">6. Modifications</h2>
            <p>
              We reserve the right to modify these terms at any time. Continued use of the system 
              constitutes acceptance of updated terms.
            </p>

            <h2 className="text-xl font-bold text-gray-900 mt-6 mb-3">7. Contact</h2>
            <p>
              For questions about these terms, contact:<br />
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