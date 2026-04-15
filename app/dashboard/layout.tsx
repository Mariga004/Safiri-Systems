"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useUser();

  const WelcomeAdmin = () => {
  if (!user) return null;

  const name =
    user.firstName ||
    user.username ||
    user.emailAddresses[0]?.emailAddress?.split("@")[0] ||
    "User";

  return (
    <div className="w-full flex justify-center items-center h-2 bg-white">
      <div className="text-lg text-gray-600">
        WELCOME,{" "}
        <span className="font-semibold text-amber-700">
          {name.toUpperCase()}!
        </span>
      </div>
    </div>
  );
};

  // Helper function to check if link is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-amber-50 border-r border-amber-200 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo Section */}
        <div className="p-6">
          <Link href="/dashboard">
            <h1 className="text-2xl font-bold text-gray-900">Safiri Systems</h1>
            <p className="text-sm text-gray-600 mt-1">Internal Operations</p>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {/* Home Link - No background, amber text */}
          <Link
            href="/dashboard"
            className={`block px-4 py-3 rounded-lg font-medium text-sm tracking-wide transition-colors ${
              pathname === "/dashboard"
                ? "text-amber-600"
                : "text-amber-500 hover:text-amber-600"
            }`}
            onClick={() => setSidebarOpen(false)}
          >
            HOME
          </Link>

          {/* Operations Section - No background, amber text */}
          <div className="mt-4">
            <div className="px-4 py-2">
              <p className="text-sm font-medium text-amber-500 tracking-wide">
                OPERATIONS
              </p>
            </div>

            {/* Operations Links - Indented, WITH background */}
            <div className="mt-2 ml-2 space-y-1">
              <Link
                href="/dashboard/buses"
                className={`block px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                  isActive("/dashboard/buses")
                    ? "bg-amber-200 text-gray-900"
                    : "text-gray-700 hover:bg-amber-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                BUSES
              </Link>
              <Link
                href="/dashboard/routes"
                className={`block px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                  isActive("/dashboard/routes")
                    ? "bg-amber-200 text-gray-900"
                    : "text-gray-700 hover:bg-amber-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                ROUTES
              </Link>
              <Link
                href="/dashboard/drivers"
                className={`block px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                  isActive("/dashboard/drivers")
                    ? "bg-amber-200 text-gray-900"
                    : "text-gray-700 hover:bg-amber-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                DRIVERS
              </Link>
              <Link
                href="/dashboard/trips"
                className={`block px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                  isActive("/dashboard/trips")
                    ? "bg-amber-200 text-gray-900"
                    : "text-gray-700 hover:bg-amber-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                TRIPS
              </Link>
              <Link
                href="/dashboard/maintenance"
                className={`block px-4 py-2 rounded-lg text-xs font-medium tracking-wide transition-colors ${
                  isActive("/dashboard/maintenance")
                    ? "bg-amber-200 text-gray-900"
                    : "text-gray-700 hover:bg-amber-100"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                MAINTENANCE
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden backdrop-blur-md bg-black/20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top Bar - Mobile only with hamburger */}
      <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Hamburger Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-900 p-2"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Welcome Admin - Mobile */}
          <WelcomeAdmin />

          {/* Profile */}
          <UserButton afterSignOutUrl="/welcome" />
        </div>
      </header>

        {/* Desktop Top Bar - Welcome message + profile */}
        <header className="hidden lg:flex bg-white border-b border-gray-200 px-8 py-4 justify-between items-center">
          <WelcomeAdmin />
          <UserButton afterSignOutUrl="/welcome" />
        </header>

        {/* Page Content */}
        <main className="flex-1 bg-amber-100 p-4 lg:p-8">
          {children}
        </main>

        {/* Footer - Side by side on mobile */}
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="px-4 py-4">
            <div className="flex flex-col md:flex-row md:justify-center items-center gap-2 text-xs">
              
              <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-2 md:gap-4 text-center">
                <Link href="/about" className="hover:text-blue-600 text-amber-700 mb-2">
                  About
                </Link>
                <Link href="/privacy" className="hover:text-blue-600 text-amber-700 mb-2">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-blue-600 text-amber-700 mb-2">
                  Terms
                </Link>
                <Link href="/support" className="hover:text-blue-600 text-amber-700 mb-2">
                  Support
                </Link>
              </div>

              <div className="text-gray-800 whitespace-nowrap mt-2 md:mt-0 md:absolute md:right-4">
                © 2026 Safiri
              </div>

            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}