'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  X,
  Search,
  Calendar,
  Bed,
  Users,
  CreditCard,
  FileText,
  Settings,
  Bell,
  Printer,
  MessageSquare,
  HelpCircle,
  Star,
  Zap,
  Target,
  BarChart3,
  Download,
  Upload,
  Building2,
  Lock,
  Wifi,
  Shield,
  Key,
  Mail,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Globe,
  Filter,
  Command
} from 'lucide-react';

interface QuickAction {
  id: number;
  title: string;
  description: string;
  icon: any;
  category: string;
  href: string;
  shortcut: string;
  color: string;
  badge?: string;
}

interface QuickActionsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickActionsModal({ isOpen, onClose }: QuickActionsModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAction, setSelectedAction] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: 'All Actions', count: 24 },
    { id: 'bookings', name: 'Bookings', count: 6 },
    { id: 'rooms', name: 'Rooms', count: 4 },
    { id: 'guests', name: 'Guests', count: 5 },
    { id: 'payments', name: 'Payments', count: 3 },
    { id: 'reports', name: 'Reports', count: 4 },
    { id: 'system', name: 'System', count: 2 },
  ];

  const allActions: QuickAction[] = [
    // Bookings
    {
      id: 1,
      title: 'New Booking',
      description: 'Create a new reservation',
      icon: Calendar,
      category: 'bookings',
      href: '/bookings/new',
      shortcut: '⌘ + B',
      color: 'bg-blue-500',
      badge: 'Popular',
    },
    {
      id: 2,
      title: 'Quick Check-in',
      description: 'Fast guest check-in process',
      icon: Zap,
      category: 'bookings',
      href: '/checkin/quick',
      shortcut: '⌘ + Q',
      color: 'bg-green-500',
      badge: 'Fast',
    },
    {
      id: 3,
      title: 'Check-out',
      description: 'Process guest departure',
      icon: Calendar,
      category: 'bookings',
      href: '/checkout',
      shortcut: '⌘ + O',
      color: 'bg-orange-500',
    },
    {
      id: 4,
      title: 'View Today\'s Arrivals',
      description: 'See all check-ins today',
      icon: Calendar,
      category: 'bookings',
      href: '/bookings?filter=today',
      shortcut: '⌘ + T',
      color: 'bg-purple-500',
    },
    {
      id: 5,
      title: 'Booking Calendar',
      description: 'View calendar overview',
      icon: Calendar,
      category: 'bookings',
      href: '/calendar',
      shortcut: '⌘ + C',
      color: 'bg-indigo-500',
    },
    {
      id: 6,
      title: 'Manage Reservations',
      description: 'View and edit all bookings',
      icon: Calendar,
      category: 'bookings',
      href: '/bookings',
      shortcut: '⌘ + M',
      color: 'bg-pink-500',
    },

    // Rooms
    {
      id: 7,
      title: 'Add Room',
      description: 'Register a new room',
      icon: Bed,
      category: 'rooms',
      href: '/rooms/new',
      shortcut: '⌘ + R',
      color: 'bg-green-500',
    },
    {
      id: 8,
      title: 'Room Maintenance',
      description: 'Report or schedule maintenance',
      icon: Settings,
      category: 'rooms',
      href: '/maintenance',
      shortcut: '⌘ + M',
      color: 'bg-yellow-500',
    },
    {
      id: 9,
      title: 'Room Assignments',
      description: 'Assign rooms to bookings',
      icon: Bed,
      category: 'rooms',
      href: '/rooms/assign',
      shortcut: '⌘ + A',
      color: 'bg-blue-500',
    },
    {
      id: 10,
      title: 'View Available Rooms',
      description: 'See all available rooms',
      icon: Bed,
      category: 'rooms',
      href: '/rooms?status=available',
      shortcut: '⌘ + V',
      color: 'bg-teal-500',
    },

    // Guests
    {
      id: 11,
      title: 'Register Guest',
      description: 'Add new guest profile',
      icon: Users,
      category: 'guests',
      href: '/guests/new',
      shortcut: '⌘ + G',
      color: 'bg-purple-500',
    },
    {
      id: 12,
      title: 'Guest Directory',
      description: 'Browse all guests',
      icon: Users,
      category: 'guests',
      href: '/guests',
      shortcut: '⌘ + D',
      color: 'bg-indigo-500',
    },
    {
      id: 13,
      title: 'VIP Guests',
      description: 'Manage VIP guest list',
      icon: Star,
      category: 'guests',
      href: '/guests/vip',
      shortcut: '⌘ + V',
      color: 'bg-yellow-500',
    },
    {
      id: 14,
      title: 'Guest Messages',
      description: 'Send messages to guests',
      icon: MessageSquare,
      category: 'guests',
      href: '/messages',
      shortcut: '⌘ + M',
      color: 'bg-blue-500',
    },
    {
      id: 15,
      title: 'Guest History',
      description: 'View guest stay history',
      icon: Users,
      category: 'guests',
      href: '/guests/history',
      shortcut: '⌘ + H',
      color: 'bg-gray-500',
    },

    // Payments
    {
      id: 16,
      title: 'Record Payment',
      description: 'Process a payment',
      icon: CreditCard,
      category: 'payments',
      href: '/payments/new',
      shortcut: '⌘ + P',
      color: 'bg-yellow-500',
    },
    {
      id: 17,
      title: 'View Invoices',
      description: 'See all invoices',
      icon: FileText,
      category: 'payments',
      href: '/invoices',
      shortcut: '⌘ + I',
      color: 'bg-green-500',
    },
    {
      id: 18,
      title: 'Payment Reports',
      description: 'Generate payment reports',
      icon: BarChart3,
      category: 'payments',
      href: '/reports/payments',
      shortcut: '⌘ + R',
      color: 'bg-blue-500',
    },

    // Reports
    {
      id: 19,
      title: 'Generate Report',
      description: 'Create analytics report',
      icon: BarChart3,
      category: 'reports',
      href: '/reports/generate',
      shortcut: '⌘ + E',
      color: 'bg-indigo-500',
    },
    {
      id: 20,
      title: 'Occupancy Report',
      description: 'View occupancy analytics',
      icon: BarChart3,
      category: 'reports',
      href: '/reports/occupancy',
      shortcut: '⌘ + O',
      color: 'bg-purple-500',
    },
    {
      id: 21,
      title: 'Revenue Report',
      description: 'View revenue analytics',
      icon: DollarSign,
      category: 'reports',
      href: '/reports/revenue',
      shortcut: '⌘ + R',
      color: 'bg-green-500',
    },
    {
      id: 22,
      title: 'Export Data',
      description: 'Export to CSV/Excel',
      icon: Download,
      category: 'reports',
      href: '/data/export',
      shortcut: '⌘ + X',
      color: 'bg-teal-500',
    },

    // System
    {
      id: 23,
      title: 'System Settings',
      description: 'Configure system settings',
      icon: Settings,
      category: 'system',
      href: '/settings',
      shortcut: '⌘ + ,',
      color: 'bg-gray-600',
    },
    {
      id: 24,
      title: 'Help & Support',
      description: 'Get help or support',
      icon: HelpCircle,
      category: 'system',
      href: '/support',
      shortcut: '⌘ + /',
      color: 'bg-pink-500',
    },
  ];

  const filteredActions = allActions.filter(action => {
    const matchesSearch = 
      action.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      action.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'all' || action.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleActionClick = (action: QuickAction) => {
    setSelectedAction(action.id);
    router.push(action.href);
    onClose();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      if (isOpen) {
        onClose();
      }
    }
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-800">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Command className="h-5 w-5 text-gray-400 mr-3" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Quick Actions
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search actions, commands, or categories..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                autoFocus
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <kbd className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">
                  ESC
                </kbd>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 rounded-full">
                    {category.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions List */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 200px)' }}>
            {filteredActions.length === 0 ? (
              <div className="p-8 text-center">
                <Search className="h-12 w-12 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No actions found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try searching for something else
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-4">
                {filteredActions.map((action) => (
                  <button
                    key={action.id}
                    onClick={() => handleActionClick(action)}
                    onMouseEnter={() => setSelectedAction(action.id)}
                    className={`p-4 rounded-lg text-left transition-all ${
                      selectedAction === action.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-900/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className={`h-10 w-10 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="flex items-center">
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              {action.title}
                            </h4>
                            {action.badge && (
                              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                                {action.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {action.description}
                          </p>
                          <div className="mt-2 flex items-center">
                            <span className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                              {action.shortcut}
                            </span>
                            <span className="mx-2 text-gray-400">•</span>
                            <span className="text-xs text-gray-500 dark:text-gray-500 capitalize">
                              {action.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-400 dark:text-gray-600">
                        →
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center space-x-4">
                <span className="flex items-center">
                  <Command className="h-3 w-3 mr-1" />
                  <span className="font-mono">K</span>
                  <span className="ml-2">Open command palette</span>
                </span>
                <span className="flex items-center">
                  <span className="font-mono">ESC</span>
                  <span className="ml-2">Close</span>
                </span>
              </div>
              <div>
                <span>{filteredActions.length} actions found</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
