import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Hostel SaaS</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login" className="text-gray-700 hover:text-gray-900">
                Login
              </Link>
              <Link
                href="/auth/register"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Manage Your Hostel
            <span className="text-blue-600"> Effortlessly</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A complete SaaS solution for hostel management. Track bookings, manage rooms, handle payments, and grow your business.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <Link
                href="/auth/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10"
              >
                Start Free Trial
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link
                href="/dashboard"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10"
              >
                View Demo
              </Link>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900">Everything You Need</h2>
          <div className="mt-12 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-600 text-2xl">🔐</div>
              <h3 className="mt-4 text-lg font-medium">Secure Authentication</h3>
              <p className="mt-2 text-gray-600">JWT-based authentication with role-based access control.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-600 text-2xl">🏨</div>
              <h3 className="mt-4 text-lg font-medium">Multi-Tenant Architecture</h3>
              <p className="mt-2 text-gray-600">Each hostel has isolated data with separate database scoping.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-blue-600 text-2xl">💰</div>
              <h3 className="mt-4 text-lg font-medium">Subscription Plans</h3>
              <p className="mt-2 text-gray-600">Free, Pro, and Enterprise plans to suit your needs.</p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-16 bg-white rounded-lg shadow p-8">
          <h2 className="text-3xl font-bold text-center text-gray-900">Simple Pricing</h2>
          <div className="mt-8 grid gap-8 grid-cols-1 md:grid-cols-3">
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold">Free</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="mt-4 space-y-2">
                <li>✓ 1 Hostel</li>
                <li>✓ 10 Rooms</li>
                <li>✓ Basic Features</li>
              </ul>
              <Link href="/auth/register">
                <button className="mt-6 w-full bg-gray-100 text-gray-900 py-2 rounded-md hover:bg-gray-200">
                  Get Started
                </button>
              </Link>
            </div>
            <div className="border-2 border-blue-600 rounded-lg p-6">
              <div className="text-blue-600 text-sm font-semibold">MOST POPULAR</div>
              <h3 className="text-xl font-bold">Pro</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">$10</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="mt-4 space-y-2">
                <li>✓ 5 Hostels</li>
                <li>✓ Unlimited Rooms</li>
                <li>✓ Advanced Features</li>
                <li>✓ Email Support</li>
              </ul>
              <Link href="/auth/register">
                <button className="mt-6 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                  Try Free for 14 Days
                </button>
              </Link>
            </div>
            <div className="border rounded-lg p-6">
              <h3 className="text-xl font-bold">Enterprise</h3>
              <div className="mt-4">
                <span className="text-3xl font-bold">$50</span>
                <span className="text-gray-600">/month</span>
              </div>
              <ul className="mt-4 space-y-2">
                <li>✓ Unlimited Hostels</li>
                <li>✓ Unlimited Rooms</li>
                <li>✓ All Features</li>
                <li>✓ Priority Support</li>
              </ul>
              <Link href="/auth/register">
                <button className="mt-6 w-full bg-gray-100 text-gray-900 py-2 rounded-md hover:bg-gray-200">
                  Contact Sales
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center">© 2024 Hostel SaaS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
