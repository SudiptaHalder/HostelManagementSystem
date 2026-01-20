'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Building2, 
  Bed, 
  Users, 
  Calendar,
  CreditCard,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User,
  Bell,
  HelpCircle,
  BarChart3,
  FileText,
  Wifi,
  Shield,
  Moon,
  Sun,
  PlusCircle,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  onCollapse?: (collapsed: boolean) => void;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Hostels', href: '/hostels', icon: Building2 },
  { name: 'Rooms', href: '/rooms', icon: Bed },
  { name: 'Guests', href: '/guests', icon: Users },
  { name: 'Bookings', href: '/bookings', icon: Calendar },
  { name: 'Payments', href: '/payments', icon: CreditCard },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Documents', href: '/documents', icon: FileText },
];

const secondaryNavigation = [
  { name: 'Support', href: '/support', icon: HelpCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar({ onCollapse }: SidebarProps) {
  const pathname = usePathname();
  const { user, hostel, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [notifications] = useState([
    { id: 1, text: 'New booking received', time: '2 min ago', read: false },
    { id: 2, text: 'Payment completed', time: '1 hour ago', read: false },
    { id: 3, text: 'Room maintenance required', time: '3 hours ago', read: true },
  ]);
  const [unreadNotifications] = useState(2);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-collapse on mobile
  useEffect(() => {
    if (isMobile) {
      setCollapsed(true);
    }
  }, [isMobile]);

  const toggleSidebar = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    onCollapse?.(newCollapsed);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const sidebarWidth = collapsed ? 'w-20' : 'w-64';
  const logoText = collapsed ? 'HS' : 'Hostel SaaS';

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 ${sidebarWidth} z-30`}>
        <div className="flex flex-col flex-grow bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              {!collapsed && (
                <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">{logoText}</h1>
              )}
            </div>
            <button
              onClick={toggleSidebar}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>

          {/* Hostel Info (Only when expanded) */}
          {!collapsed && hostel && (
            <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {hostel.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {hostel.plan} Plan
                  </p>
                </div>
                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-full">
                  Active
                </span>
              </div>
              <div className="mt-2">
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  15 of 20 rooms occupied
                </p>
              </div>
            </div>
          )}

          {/* Quick Add Button */}
          {!collapsed && (
            <div className="px-4 py-3">
              <button
                onClick={() => setShowQuickActions(!showQuickActions)}
                className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Quick Add
              </button>
              
              {showQuickActions && (
                <div className="mt-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg">
                  <div className="p-2">
                    <Link
                      href="/bookings/new"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
                    >
                      <PlusCircle className="h-4 w-4 mr-3 text-blue-500" />
                      New Booking
                    </Link>
                    <Link
                      href="/rooms/new"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg mb-1"
                    >
                      <PlusCircle className="h-4 w-4 mr-3 text-green-500" />
                      Add Room
                    </Link>
                    <Link
                      href="/guests/new"
                      className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      <PlusCircle className="h-4 w-4 mr-3 text-purple-500" />
                      Register Guest
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Main Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    active
                      ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-l-4 border-blue-500'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent'
                  }`}
                  title={collapsed ? item.name : ''}
                >
                  <item.icon className={`h-5 w-5 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  {!collapsed && (
                    <span className="ml-3">{item.name}</span>
                  )}
                  {active && !collapsed && (
                    <span className="ml-auto w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Secondary Navigation */}
          <div className="px-2 py-4 space-y-1 border-t border-gray-200 dark:border-gray-800">
            {secondaryNavigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    active
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                  title={collapsed ? item.name : ''}
                >
                  <item.icon className={`h-5 w-5 ${active ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}`} />
                  {!collapsed && (
                    <span className="ml-3">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* User Profile & Settings */}
          <div className="border-t border-gray-200 dark:border-gray-800 p-4">
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center w-full text-left hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 transition-colors"
                aria-label="User menu"
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                {!collapsed && (
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user?.role || 'Admin'}
                    </p>
                  </div>
                )}
                {!collapsed && (
                  <div className="ml-2 relative">
                    <Bell className="h-4 w-4 text-gray-400" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {unreadNotifications}
                      </span>
                    )}
                  </div>
                )}
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && !collapsed && (
                <div className="absolute bottom-full left-0 mb-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
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

                  {/* Notifications */}
                  <div className="max-h-64 overflow-y-auto">
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                        Notifications
                      </div>
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded-lg ${
                            !notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''
                          }`}
                        >
                          <div className="flex items-start">
                            <div className={`h-2 w-2 mt-1.5 rounded-full mr-3 ${
                              !notification.read ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900 dark:text-white">
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
                  </div>

                  {/* Settings */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                    <button
                      onClick={toggleDarkMode}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      {darkMode ? (
                        <Sun className="h-4 w-4 mr-3" />
                      ) : (
                        <Moon className="h-4 w-4 mr-3" />
                      )}
                      {darkMode ? 'Light Mode' : 'Dark Mode'}
                    </button>
                    <Link
                      href="/profile"
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <User className="h-4 w-4 mr-3" />
                      My Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Settings className="h-4 w-4 mr-3" />
                      Account Settings
                    </Link>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* System Status (Only when expanded) */}
            {!collapsed && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center">
                    <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                    <span className="text-gray-500 dark:text-gray-400">System Online</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Wifi className="h-3 w-3 text-gray-400" title="Connected" />
                    <Shield className="h-3 w-3 text-green-400" title="Secure" />
                    <CheckCircle className="h-3 w-3 text-blue-400" title="Synced" />
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Last sync: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {!collapsed && isMobile && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity"
            onClick={() => {
              setCollapsed(true);
              onCollapse?.(true);
            }}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl z-40 lg:hidden overflow-y-auto transform transition-transform">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <h1 className="ml-3 text-xl font-bold text-gray-900 dark:text-white">Hostel SaaS</h1>
                </div>
                <button
                  onClick={() => {
                    setCollapsed(true);
                    onCollapse?.(true);
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                  aria-label="Close sidebar"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
                </button>
              </div>
              
              {/* Mobile sidebar content */}
              <div className="flex-1 overflow-y-auto">
                {/* Mobile navigation - similar to desktop but mobile optimized */}
                <nav className="px-2 py-4 space-y-1">
                  {navigation.map((item) => {
                    const active = isActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center px-3 py-3 text-sm font-medium rounded-lg ${
                          active
                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => {
                          setCollapsed(true);
                          onCollapse?.(true);
                        }}
                      >
                        <item.icon className="h-5 w-5 mr-3" />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
              </div>
              
              {/* Mobile footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                <button
                  onClick={logout}
                  className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Click outside handler for dropdowns */}
      {(showUserMenu || showQuickActions) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowUserMenu(false);
            setShowQuickActions(false);
          }}
        />
      )}
    </>
  );
}
