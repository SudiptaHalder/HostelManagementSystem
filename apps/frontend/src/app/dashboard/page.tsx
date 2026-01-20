'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRouter } from 'next/navigation';
import { Building2, Calendar, CreditCard, Users, Bed, TrendingUp } from 'lucide-react';

export default function DashboardPage() {
  const { user, hostel, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalRooms: 0,
    availableRooms: 0,
    totalGuests: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-1">
              {hostel?.name} • {hostel?.plan} Plan
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/hostels/settings')}
              className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
            >
              Settings
            </button>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <Bed className="h-5 w-5 text-blue-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Total Rooms</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalRooms}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {stats.availableRooms} available • {stats.totalRooms - stats.availableRooms} occupied
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-green-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Total Guests</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalGuests}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  {stats.activeBookings} active bookings
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <CreditCard className="h-5 w-5 text-purple-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Monthly Revenue</h3>
                  <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Occupancy Rate</h3>
                  <p className="text-2xl font-bold text-gray-900">{stats.occupancyRate}%</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Industry average: 65%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-indigo-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Upcoming Check-ins</h3>
                  <p className="text-2xl font-bold text-gray-900">3</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Next: Today, 2:00 PM
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-red-600" />
                  </div>
                </div>
                <div className="ml-5">
                  <h3 className="text-lg font-medium text-gray-900">Plan</h3>
                  <p className="text-2xl font-bold text-gray-900">{hostel?.plan}</p>
                </div>
              </div>
              <div className="mt-4">
                <button className="w-full text-sm bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <button
                onClick={() => router.push('/rooms/new')}
                className="p-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50"
              >
                <div className="text-blue-600 text-lg">+</div>
                <p className="mt-2 text-sm font-medium">Add Room</p>
              </button>
              <button
                onClick={() => router.push('/bookings/new')}
                className="p-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50"
              >
                <div className="text-green-600 text-lg">+</div>
                <p className="mt-2 text-sm font-medium">New Booking</p>
              </button>
              <button
                onClick={() => router.push('/guests/new')}
                className="p-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50"
              >
                <div className="text-purple-600 text-lg">+</div>
                <p className="mt-2 text-sm font-medium">Add Guest</p>
              </button>
              <button
                onClick={() => router.push('/payments/new')}
                className="p-4 border border-gray-300 rounded-lg text-center hover:bg-gray-50"
              >
                <div className="text-yellow-600 text-lg">+</div>
                <p className="mt-2 text-sm font-medium">Record Payment</p>
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <div className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">New booking created</p>
                    <p className="text-sm text-gray-500">Room 101 • John Doe • 2 nights</p>
                  </div>
                  <span className="text-sm text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Payment received</p>
                    <p className="text-sm text-gray-500">$150 • Booking #1234 • Credit Card</p>
                  </div>
                  <span className="text-sm text-gray-500">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">Guest checked out</p>
                    <p className="text-sm text-gray-500">Room 205 • Jane Smith</p>
                  </div>
                  <span className="text-sm text-gray-500">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
