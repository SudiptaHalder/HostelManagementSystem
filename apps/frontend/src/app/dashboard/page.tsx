'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useRouter } from 'next/navigation';
import { 
  Building2, 
  Calendar, 
  CreditCard, 
  Users, 
  Bed, 
  TrendingUp,
  PlusCircle,
  FileText,
  Settings,
  Bell,
  Wifi,
  Shield,
  Download,
  Upload,
  Printer,
  MessageSquare,
  HelpCircle,
  Star,
  Zap,
  Target,
  BarChart3,
  Filter
} from 'lucide-react';

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

  // Quick Actions Data
  const quickActions = [
    {
      id: 1,
      title: 'New Booking',
      description: 'Create a new reservation',
      icon: Calendar,
      color: 'bg-blue-500',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      hoverColor: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
      href: '/bookings/new',
      shortcut: '⌘ + B',
      badge: 'Popular',
    },
    {
      id: 2,
      title: 'Add Room',
      description: 'Register a new room',
      icon: Bed,
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      hoverColor: 'hover:bg-green-100 dark:hover:bg-green-900/30',
      href: '/rooms/new',
      shortcut: '⌘ + R',
    },
    {
      id: 3,
      title: 'Register Guest',
      description: 'Add new guest profile',
      icon: Users,
      color: 'bg-purple-500',
      textColor: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      hoverColor: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
      href: '/guests/new',
      shortcut: '⌘ + G',
    },
    {
      id: 4,
      title: 'Record Payment',
      description: 'Process a payment',
      icon: CreditCard,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      hoverColor: 'hover:bg-yellow-100 dark:hover:bg-yellow-900/30',
      href: '/payments/new',
      shortcut: '⌘ + P',
    },
    {
      id: 5,
      title: 'Generate Report',
      description: 'Create analytics report',
      icon: BarChart3,
      color: 'bg-indigo-500',
      textColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
      hoverColor: 'hover:bg-indigo-100 dark:hover:bg-indigo-900/30',
      href: '/reports/generate',
      shortcut: '⌘ + E',
    },
    {
      id: 6,
      title: 'Print Invoice',
      description: 'Print booking invoice',
      icon: Printer,
      color: 'bg-gray-500',
      textColor: 'text-gray-600 dark:text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-900/20',
      hoverColor: 'hover:bg-gray-100 dark:hover:bg-gray-900/30',
      href: '/invoices',
      shortcut: '⌘ + I',
    },
    {
      id: 7,
      title: 'Send Notification',
      description: 'Notify guests/staff',
      icon: Bell,
      color: 'bg-red-500',
      textColor: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      hoverColor: 'hover:bg-red-100 dark:hover:bg-red-900/30',
      href: '/notifications/send',
      shortcut: '⌘ + N',
    },
    {
      id: 8,
      title: 'Quick Check-in',
      description: 'Fast guest check-in',
      icon: Zap,
      color: 'bg-orange-500',
      textColor: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20',
      hoverColor: 'hover:bg-orange-100 dark:hover:bg-orange-900/30',
      href: '/checkin/quick',
      shortcut: '⌘ + Q',
      badge: 'Fast',
    },
  ];

  const secondaryActions = [
    {
      id: 1,
      title: 'Import Data',
      description: 'Import from CSV/Excel',
      icon: Upload,
      color: 'bg-teal-500',
      href: '/data/import',
    },
    {
      id: 2,
      title: 'Export Data',
      description: 'Export to CSV/Excel',
      icon: Download,
      color: 'bg-cyan-500',
      href: '/data/export',
    },
    {
      id: 3,
      title: 'Help & Support',
      description: 'Get help or support',
      icon: HelpCircle,
      color: 'bg-pink-500',
      href: '/support',
    },
    {
      id: 4,
      title: 'System Settings',
      description: 'Configure system',
      icon: Settings,
      color: 'bg-gray-600',
      href: '/settings',
    },
  ];

  const featuredActions = [
    {
      id: 1,
      title: 'Today\'s Check-ins',
      count: 3,
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      href: '/bookings?filter=today-checkin',
    },
    {
      id: 2,
      title: 'Pending Payments',
      count: 2,
      icon: CreditCard,
      color: 'from-green-500 to-green-600',
      href: '/payments?status=pending',
    },
    {
      id: 3,
      title: 'Available Rooms',
      count: stats.availableRooms,
      icon: Bed,
      color: 'from-purple-500 to-purple-600',
      href: '/rooms?status=available',
    },
    {
      id: 4,
      title: 'Staff Online',
      count: 5,
      icon: Users,
      color: 'from-orange-500 to-orange-600',
      href: '/staff',
    },
  ];

  const recentlyUsed = [
    {
      id: 1,
      title: 'Room 101 Booking',
      time: '10 min ago',
      icon: Calendar,
      href: '/bookings/123',
    },
    {
      id: 2,
      title: 'Guest Registration',
      time: '25 min ago',
      icon: Users,
      href: '/guests/456',
    },
    {
      id: 3,
      title: 'Payment Receipt',
      time: '1 hour ago',
      icon: CreditCard,
      href: '/payments/789',
    },
    {
      id: 4,
      title: 'Room Maintenance',
      time: '2 hours ago',
      icon: Settings,
      href: '/maintenance/101',
    },
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {hostel?.name} • {hostel?.plan} Plan • Here's what's happening today
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/hostels/my-hostel')}
              className="inline-flex items-center px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Building2 className="h-4 w-4 mr-2" />
              My Hostel
            </button>
            <button
              onClick={() => router.push('/settings')}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Stats cards remain the same... */}
          {/* ... (keep your existing stats cards here) ... */}
        </div>

        {/* Quick Actions Section */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Frequent tasks and shortcuts for faster workflow
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                View All
              </button>
              <button className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <Filter className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Featured Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {featuredActions.map((action) => (
              <button
                key={action.id}
                onClick={() => router.push(action.href)}
                className={`bg-gradient-to-r ${action.color} rounded-xl p-4 text-white hover:shadow-lg transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-bold">{action.count}</p>
                    <p className="text-sm opacity-90 mt-1">{action.title}</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                    <action.icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 text-xs opacity-80 flex items-center">
                  <span>Click to view →</span>
                </div>
              </button>
            ))}
          </div>

          {/* Main Quick Actions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={() => router.push(action.href)}
                className={`${action.bgColor} ${action.hoverColor} border border-gray-200 dark:border-gray-800 rounded-xl p-4 text-left transition-all hover:border-gray-300 dark:hover:border-gray-700 hover:translate-y-[-2px] group`}
              >
                <div className="flex items-start justify-between">
                  <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  {action.badge && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-white/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300">
                      {action.badge}
                    </span>
                  )}
                </div>
                
                <div className="mt-4">
                  <h3 className={`font-medium ${action.textColor}`}>{action.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {action.description}
                  </p>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                    {action.shortcut}
                  </span>
                  <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${action.textColor}`}>
                    <PlusCircle className="h-4 w-4" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Secondary Actions & Recently Used */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Secondary Actions */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  More Actions
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {secondaryActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => router.push(action.href)}
                      className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 border border-gray-200 dark:border-gray-800 transition-colors"
                    >
                      <div className={`h-8 w-8 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                        <action.icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {action.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {action.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recently Used */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recently Used
                </h3>
                <button className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Clear
                </button>
              </div>
              <div className="space-y-3">
                {recentlyUsed.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => router.push(item.href)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-gray-900 flex items-center justify-center mr-3">
                        <item.icon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.time}
                        </p>
                      </div>
                    </div>
                    <div className="text-gray-400 dark:text-gray-600">
                      →
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Productivity Tips */}
          <div className="mt-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
            <div className="flex items-start">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white">Productivity Tip</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Use keyboard shortcuts to navigate faster. Press <kbd className="px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">⌘</kbd> + <kbd className="px-2 py-1 text-xs bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded">K</kbd> to open command palette.
                </p>
              </div>
              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                Learn more
              </button>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-800 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">System Status</h3>
            <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              All Systems Operational
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <Wifi className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">API</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <Shield className="h-5 w-5 text-green-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Security</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Protected</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <Download className="h-5 w-5 text-blue-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Sync</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Up to date</p>
              </div>
            </div>
            <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <MessageSquare className="h-5 w-5 text-purple-500 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">Support</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
