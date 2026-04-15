import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-amber-100 flex flex-col">
      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Safiri Systems</span>
          </div>

          {/* Login Button */}
          <Link
            href="/sign-in"
            className="bg-amber-700 text-white px-6 py-2 rounded-lg hover:bg-amber-800 font-medium"
          >
            Login
          </Link>
        </div>
      </header>

      {/* Main Content - Centered */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold text-amber-700 mb-4">
            Welcome to Safiri Systems
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 font-medium">
            Smart. Managed. Travel.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="px-4 py-4">
          <div className="flex flex-row justify-between items-center gap-2 text-xs max-w-6xl mx-auto">
            <div className="flex flex-row flex-wrap gap-2">
              <Link href="/about" className="hover:text-amber-600 text-gray-600">
                About
              </Link>
              <Link href="/privacy" className="hover:text-amber-600 text-gray-600">
                Privacy
              </Link>
              <Link href="/terms" className="hover:text-amber-600 text-gray-600">
                Terms
              </Link>
              <Link href="/support" className="hover:text-amber-600 text-gray-600">
                Support
              </Link>
            </div>
            <div className="text-gray-600 whitespace-nowrap">
              © 2026 Safiri
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}