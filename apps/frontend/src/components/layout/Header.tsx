'use client';

import { useState } from 'react';
import { Bell, Search, Menu, X, Plus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, hostel } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickMenu, setShowQuickMenu] = useState(false);

  const notifications = [
    { id: 1, text: 'New booking from John Doe', time: '2 min ago', type: 'booking' },
    { id: 2, text: 'Payment of $150 received', time: '1 hour ago', type: 'payment' },
    { id: 3, text: 'Room 101 check-out today', time: '3 hours ago', type: 'reminder' },
  ];

  const quickActions = [
    { label: 'New Booking', href: '/bookings/new', color: 'blue' },
    { label: 'Add Room', href: '/rooms/new', color: 'green' },
    { label: 'Register Guest', href: '/guests/new', color: 'purple' },
    { label: 'Record Payment', href: '/payments/new', color: 'yellow' },
  ];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Left side - Search */}
          <div className="flex-1 flex items-center max-w-2xl">
            <div className="w-full">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search bookings, guests, rooms..."
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right side - Actions */}
          <div className="ml-4 flex items-center space-x-3">
            {/* Quick Actions Menu */}
            <div className="relative">
              <button
                onClick={() => setShowQuickMenu(!showQuickMenu)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Quick Add
              </button>
              
              {showQuickMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="py-1">
                    {quickActions.map((action) => (
                      <a
                        key={action.label}
                        href={action.href}
                        className={`flex items-center px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 ${
                          action.color === 'blue' ? 'text-blue-600 dark:text-blue-400' :
                          action.color === 'green' ? 'text-green-600 dark:text-green-400' :
                          action.color === 'purple' ? 'text-purple-600 dark:text-purple-400' :
                          'text-yellow-600 dark:text-yellow-400'
                        }`}
                      >
                        <Plus className="h-4 w-4 mr-3" />
                        {action.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
              >
                <Bell className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">You have 3 unread notifications</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700"
                      >
                        <div className="flex items-start">
                          <div className={`h-2 w-2 mt-2 rounded-full ${
                            notification.type === 'booking' ? 'bg-blue-500' :
                            notification.type === 'payment' ? 'bg-green-500' :
                            'bg-yellow-500'
                          }`}></div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {notification.text}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href="/notifications"
                      className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
                    >
                      View all notifications
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* User Profile */}
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-sm font-medium text-white">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div className="ml-3 hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.name || 'User'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {hostel?.name || 'Hostel'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="pb-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2">
              <li>
                <a href="/dashboard" className="text-gray-400 hover:text-gray-500">
                  Dashboard
                </a>
              </li>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li className="text-gray-900 dark:text-white font-medium">
                Current Page
              </li>
            </ol>
          </nav>
          <div className="mt-2 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name?.split(' ')[0] || 'User'}!
            </h2>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Last updated: Today, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
