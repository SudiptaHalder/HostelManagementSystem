'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import {
  Building2,
  Users,
  Bed,
  Calendar,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  DollarSign,
  Globe2,
  Edit,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Star,
  Download
} from 'lucide-react';

interface HostelStats {
  monthlyRevenue: number;
  todayBookings: number;
  availableRooms: number;
  totalRooms: number;
  totalGuests: number;
  totalBookings: number;
  totalStaff: number;
}

interface Hostel {
  id: string;
  name: string;
  slug: string;
  plan: string;
  isActive: boolean;
  settings: any;
  createdAt: string;
  _count: {
    users: number;
    rooms: number;
    bookings: number;
    guests: number;
  };
}

export default function MyHostelPage() {
  const router = useRouter();
  const { user, hostel: contextHostel, isAuthenticated, isLoading } = useAuth();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [stats, setStats] = useState<HostelStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    fetchHostelData();
  }, [isAuthenticated, isLoading]);

  const fetchHostelData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5001/api/hostels/my-hostel', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setHostel(data.hostel);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch hostel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradePlan = () => {
    router.push('/hostels/upgrade');
  };

  if (isLoading || loading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!isAuthenticated || !hostel) {
    return null;
  }

  const planColor = hostel.plan === 'FREE' 
    ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    : hostel.plan === 'BASIC'
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    : hostel.plan === 'PREMIUM'
    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';

  const occupancyRate = stats ? ((stats.totalRooms - stats.availableRooms) / stats.totalRooms) * 100 : 0;

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <div className="flex items-center mb-2">
                <Building2 className="h-8 w-8 mr-3" />
                <h1 className="text-2xl font-bold">{hostel.name}</h1>
              </div>
              <div className="flex items-center space-x-4 text-sm opacity-90">
                <span className="flex items-center">
                  <Globe2 className="h-4 w-4 mr-1" />
                  hostelsaas.com/{hostel.slug}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${planColor}`}>
                  {hostel.plan} PLAN
                </span>
                <span className="flex items-center">
                  {hostel.isActive ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-1 text-green-300" />
                      <span className="text-green-300">Active</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-1 text-red-300" />
                      <span className="text-red-300">Inactive</span>
                    </>
                  )}
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <button
                onClick={() => router.push(`/hostels/${hostel.id}/edit`)}
                className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Hostel
              </button>
              {hostel.plan === 'FREE' && (
                <button
                  onClick={handleUpgradePlan}
                  className="inline-flex items-center px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Upgrade Plan
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  ${stats?.monthlyRevenue.toLocaleString() || '0'}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-4">
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +8.2% from last month
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {occupancyRate.toFixed(1)}%
                </p>
              </div>
              <Bed className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-4">
              <span className={`text-xs flex items-center ${
                occupancyRate >= 70 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-yellow-600 dark:text-yellow-400'
              }`}>
                {occupancyRate >= 70 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {occupancyRate >= 70 ? 'Above average' : 'Below average'}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Today's Bookings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.todayBookings || '0'}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-4">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {stats?.availableRooms || '0'} rooms available
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Guests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats?.totalGuests.toLocaleString() || '0'}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
            <div className="mt-4">
              <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                +15 this week
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {['overview', 'details', 'settings', 'reports'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          {activeTab === 'overview' && (
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Stats */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Performance Overview
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Rooms</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats?.totalRooms || '0'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Active Staff</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats?.totalStaff || '0'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats?.totalBookings.toLocaleString() || '0'}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Stay Duration</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">2.3 days</p>
                    </div>
                  </div>
                </div>

                {/* Plan Details */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Plan Details
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-5">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${planColor}`}>
                        {hostel.plan}
                      </span>
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Rooms Limit</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {hostel.plan === 'FREE' ? '10 rooms' : 'Unlimited'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Staff Accounts</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {hostel.plan === 'FREE' ? '3 users' : 'Unlimited'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Support</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {hostel.plan === 'FREE' ? 'Email only' : 'Priority support'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Cost</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {hostel.plan === 'FREE' ? '$0' : 
                           hostel.plan === 'BASIC' ? '$10' :
                           hostel.plan === 'PREMIUM' ? '$30' : '$50'}
                        </span>
                      </div>
                    </div>

                    {hostel.plan === 'FREE' && (
                      <button
                        onClick={handleUpgradePlan}
                        className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors"
                      >
                        Upgrade Plan
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
                Hostel Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contact Information */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Contact Information</h4>
                  <div className="space-y-3">
                    {hostel.settings?.address && (
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Address</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {hostel.settings.address}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {hostel.settings?.phone && (
                      <div className="flex items-center">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {hostel.settings.phone}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {hostel.settings?.email && (
                      <div className="flex items-center">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {hostel.settings.email}
                          </p>
                        </div>
                      </div>
                    )}
                    
                    {hostel.settings?.website && (
                      <div className="flex items-center">
                        <Globe className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Website</p>
                          <a 
                            href={hostel.settings.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            {hostel.settings.website}
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Operational Settings */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 dark:text-white">Operational Settings</h4>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Check-in Time</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {hostel.settings?.checkInTime || '2:00 PM'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Check-out Time</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {hostel.settings?.checkOutTime || '11:00 AM'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Currency</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {hostel.settings?.currency || 'USD'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Globe2 className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Timezone</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {hostel.settings?.timezone || 'UTC'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Reports & Analytics
                </h3>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900">
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Monthly Performance</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Occupancy Rate</span>
                        <span className="font-medium text-gray-900 dark:text-white">{occupancyRate.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-green-500 rounded-full" 
                          style={{ width: `${Math.min(occupancyRate, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Revenue Growth</span>
                        <span className="font-medium text-green-600 dark:text-green-400">+8.2%</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">Guest Satisfaction</span>
                        <span className="font-medium text-gray-900 dark:text-white">4.8/5</span>
                      </div>
                      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: '96%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Quick Insights</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Peak booking hours: 2 PM - 4 PM
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Most popular room type: Private
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-2 w-2 rounded-full bg-purple-500 mt-1.5 mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Average stay duration: 2.3 nights
                      </span>
                    </li>
                    <li className="flex items-start">
                      <div className="h-2 w-2 rounded-full bg-orange-500 mt-1.5 mr-3"></div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        Repeat guest rate: 28%
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
