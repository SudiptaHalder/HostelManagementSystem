'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bell, 
  Search, 
  Command, 
  HelpCircle, 
  Settings, 
  Moon, 
  Sun,
  User,
  ChevronDown,
  LogOut,
  Mail,
  Shield,
  Wifi,
  CheckCircle,
  XCircle,
  Plus,
  Calendar,
  Bed,
  Users,
  CreditCard,
  Building2  // Added Building2 icon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import QuickActionsModal from './QuickActionsModal';

export default function Header() {
  const pathname = usePathname();
  const { user, hostel, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [systemStatus, setSystemStatus] = useState({
    api: 'online',
    database: 'online',
    sync: 'synced',
    security: 'protected',
  });

  const notifications = [
    { id: 1, text: 'New booking from John Doe', time: '2 min ago', type: 'booking', unread: true },
    { id: 2, text: 'Payment of $150 received', time: '1 hour ago', type: 'payment', unread: true },
    { id: 3, text: 'Room 101 check-out today', time: '3 hours ago', type: 'reminder', unread: false },
    { id: 4, text: 'System backup completed', time: '5 hours ago', type: 'system', unread: false },
    { id: 5, text: 'New staff member added', time: '1 day ago', type: 'staff', unread: false },
  ];

  const quickAddItems = [
    { label: 'New Booking', href: '/bookings/new', icon: Calendar, color: 'blue' },
    { label: 'Add Room', href: '/rooms/new', icon: Bed, color: 'green' },
    { label: 'Register Guest', href: '/guests/new', icon: Users, color: 'purple' },
    { label: 'Record Payment', href: '/payments/new', icon: CreditCard, color: 'yellow' },
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Initialize dark mode from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K for quick actions
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowQuickActions(true);
      }
      // Cmd/Ctrl + / for search focus
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        const searchInput = document.querySelector('input[type="search"]') as HTMLInputElement;
        if (searchInput) {
          searchInput.focus();
        }
      }
      // Escape to close modals
      if (e.key === 'Escape') {
        setShowNotifications(false);
        setShowUserMenu(false);
        setShowQuickActions(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getPageTitle = () => {
    const path = pathname;
    if (path === '/dashboard') return 'Dashboard';
    if (path.startsWith('/hostels')) return 'Hostels';
    if (path.startsWith('/rooms')) return 'Rooms';
    if (path.startsWith('/guests')) return 'Guests';
    if (path.startsWith('/bookings')) return 'Bookings';
    if (path.startsWith('/payments')) return 'Payments';
    if (path.startsWith('/settings')) return 'Settings';
    if (path.startsWith('/reports')) return 'Reports';
    return 'Dashboard';
  };

  const getBreadcrumbs = () => {
    const path = pathname.split('/').filter(p => p);
    if (path.length === 0) return ['Dashboard'];
    
    const breadcrumbs = ['Dashboard'];
    path.forEach((segment, index) => {
      if (segment !== 'new' && segment !== 'edit' && !segment.includes('[')) {
        breadcrumbs.push(segment.charAt(0).toUpperCase() + segment.slice(1));
      }
    });
    return breadcrumbs;
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Left side - Breadcrumbs & Search */}
            <div className="flex-1 flex items-center max-w-2xl">
              {/* Breadcrumbs for mobile */}
              <div className="lg:hidden mr-4">
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {getPageTitle()}
                </h1>
              </div>

              {/* Search */}
              <div className="hidden lg:block flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-700 rounded-lg leading-5 bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 dark:focus:placeholder-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Search bookings, guests, rooms..."
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 border border-gray-300 dark:border-gray-700 rounded text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
                      ⌘/
                    </kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - Actions */}
            <div className="ml-4 flex items-center space-x-2 sm:space-x-4">
              {/* Quick Actions Button */}
              <button
                onClick={() => setShowQuickActions(true)}
                className="hidden sm:flex items-center px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                title="Quick Actions (⌘K)"
              >
                <Command className="h-4 w-4 mr-2" />
                Quick Actions
                <kbd className="ml-2 px-1.5 py-0.5 text-xs border border-gray-300 dark:border-gray-700 rounded bg-gray-50 dark:bg-gray-900">
                  ⌘K
                </kbd>
              </button>

              {/* Mobile Quick Actions */}
              <button
                onClick={() => setShowQuickActions(true)}
                className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Quick Actions"
              >
                <Command className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Quick Add Menu */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setShowUserMenu(false)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Quick Add
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowUserMenu(false);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowNotifications(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-40">
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
                          <span className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300">
                            Mark all as read
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                          You have {unreadCount} unread notifications
                        </p>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 ${
                              notification.unread ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                            }`}
                          >
                            <div className="flex items-start">
                              <div className={`h-2 w-2 mt-2 rounded-full mr-3 ${
                                notification.unread ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                              }`} />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.text}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  {notification.time}
                                </p>
                              </div>
                              <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                                notification.type === 'booking' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                                  : notification.type === 'payment'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
                              }`}>
                                {notification.type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <Link
                          href="/notifications"
                          className="block text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500"
                          onClick={() => setShowNotifications(false)}
                        >
                          View all notifications
                        </Link>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Dark Mode Toggle - Fixed: Added closing button tag */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserMenu(!showUserMenu);
                    setShowNotifications(false);
                  }}
                  className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="User menu"
                >
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <span className="text-sm font-medium text-white">
                      {user?.name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user?.role || 'Admin'}
                    </p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-40">
                      {/* User Info */}
                      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {user?.name?.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {user?.name || 'User'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {user?.email || 'user@example.com'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Quick Links */}
                      <div className="p-2">
                        <Link
                          href="/profile"
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <User className="h-4 w-4 mr-3" />
                          My Profile
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Settings className="h-4 w-4 mr-3" />
                          Account Settings
                        </Link>
                        <Link
                          href="/support"
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <HelpCircle className="h-4 w-4 mr-3" />
                          Help & Support
                        </Link>
                      </div>

                      {/* System Status */}
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                          System Status
                        </h4>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">API</span>
                            <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                              <Wifi className="h-3 w-3 mr-1" />
                              Online
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Security</span>
                            <span className="flex items-center text-sm text-green-600 dark:text-green-400">
                              <Shield className="h-3 w-3 mr-1" />
                              Protected
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Logout */}
                      <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={logout}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Breadcrumbs & Page Title (Desktop) */}
          <div className="hidden lg:block pb-4">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                {getBreadcrumbs().map((crumb, index) => (
                  <li key={index} className="flex items-center">
                    {index > 0 && (
                      <span className="text-gray-400 mx-2">/</span>
                    )}
                    {index === getBreadcrumbs().length - 1 ? (
                      <span className="text-gray-900 dark:text-white font-medium">
                        {crumb}
                      </span>
                    ) : (
                      <Link
                        href={index === 0 ? '/dashboard' : '#'}
                        className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                      >
                        {crumb}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
            <div className="mt-2 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {getPageTitle()}
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {hostel?.name && (
                  <span className="flex items-center">
                    <span className="hidden sm:inline">Hostel:</span>
                    <Building2 className="h-3 w-3 mx-1" />
                    <span className="font-medium">{hostel.name}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <div className="lg:hidden pb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Search..."
              />
            </div>
          </div>
        </div>
      </header>

      {/* Quick Actions Modal */}
      <QuickActionsModal 
        isOpen={showQuickActions} 
        onClose={() => setShowQuickActions(false)} 
      />
    </>
  );
}