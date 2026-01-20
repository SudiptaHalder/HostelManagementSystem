'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Building2, 
  Users, 
  Bed, 
  Calendar,
  CreditCard,
  MoreVertical,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface Hostel {
  id: string;
  name: string;
  slug: string;
  plan: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    users: number;
    rooms: number;
    bookings: number;
  };
}

export default function HostelsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [hostels, setHostels] = useState<Hostel[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    free: 0,
    paid: 0,
  });

  // Fetch hostels
  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    fetchHostels();
  }, [isAuthenticated, isLoading, currentPage, search, filter]);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = `http://localhost:5001/api/hostels?page=${currentPage}&limit=10`;
      if (search) url += `&search=${search}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        // If not super admin, redirect to my hostel
        router.push('/hostels/my-hostel');
        return;
      }

      const data = await response.json();
      
      if (response.ok) {
        setHostels(data.hostels);
        setTotalPages(data.pagination.pages);
        
        // Calculate stats
        const total = data.pagination.total;
        const active = data.hostels.filter((h: Hostel) => h.isActive).length;
        const inactive = total - active;
        const free = data.hostels.filter((h: Hostel) => h.plan === 'FREE').length;
        const paid = total - free;
        
        setStats({ total, active, inactive, free, paid });
      }
    } catch (error) {
      console.error('Failed to fetch hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHostel = async (hostelId: string) => {
    if (!confirm('Are you sure you want to delete this hostel? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/hostels/${hostelId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchHostels(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to delete hostel:', error);
    }
  };

  const handleStatusChange = async (hostelId: string, isActive: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/hostels/${hostelId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        fetchHostels(); // Refresh the list
      }
    } catch (error) {
      console.error('Failed to update hostel status:', error);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading...</div>
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hostels</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {user?.role === 'SUPER_ADMIN' 
                ? 'Manage all hostels in the system' 
                : 'View your hostel details'}
            </p>
          </div>
          {user?.role === 'SUPER_ADMIN' && (
            <button
              onClick={() => router.push('/hostels/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Hostel
            </button>
          )}
        </div>

        {/* Stats Cards */}
        {user?.role === 'SUPER_ADMIN' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Total Hostels</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                </div>
                <Building2 className="h-8 w-8 text-blue-500" />
              </div>
              <div className="mt-2">
                <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Active</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.active}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {((stats.active / stats.total) * 100).toFixed(1)}% of total
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Paid Plans</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.paid}</p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-500" />
              </div>
              <div className="mt-2">
                <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  ${stats.paid * 10}/month MRR
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Rooms/Hostel</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {hostels.length > 0 
                      ? Math.round(hostels.reduce((sum, h) => sum + h._count.rooms, 0) / hostels.length)
                      : 0}
                  </p>
                </div>
                <Bed className="h-8 w-8 text-orange-500" />
              </div>
              <div className="mt-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Across all hostels
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        {user?.role === 'SUPER_ADMIN' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search hostels by name or slug..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="appearance-none bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Hostels</option>
                    <option value="active">Active Only</option>
                    <option value="inactive">Inactive Only</option>
                    <option value="free">Free Plan</option>
                    <option value="paid">Paid Plans</option>
                  </select>
                  <Filter className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Hostels Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : user?.role === 'SUPER_ADMIN' ? (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Hostel
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Plan
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Statistics
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {hostels.map((hostel) => (
                      <tr key={hostel.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                              <Building2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {hostel.name}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {hostel.slug}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            hostel.plan === 'FREE' 
                              ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                              : hostel.plan === 'BASIC'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                              : hostel.plan === 'PREMIUM'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                              : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300'
                          }`}>
                            {hostel.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Users className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {hostel._count.users}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Bed className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {hostel._count.rooms}
                              </span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                              <span className="text-sm text-gray-900 dark:text-white">
                                {hostel._count.bookings}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {hostel.isActive ? (
                              <>
                                <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                                <span className="text-sm text-green-600 dark:text-green-400">Active</span>
                              </>
                            ) : (
                              <>
                                <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                                <span className="text-sm text-red-600 dark:text-red-400">Inactive</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(hostel.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => router.push(`/hostels/${hostel.id}`)}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => router.push(`/hostels/${hostel.id}/edit`)}
                              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
                              title="Edit"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusChange(hostel.id, hostel.isActive)}
                              className={hostel.isActive 
                                ? "text-yellow-600 dark:text-yellow-400 hover:text-yellow-900 dark:hover:text-yellow-300"
                                : "text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300"
                              }
                              title={hostel.isActive ? "Deactivate" : "Activate"}
                            >
                              {hostel.isActive ? (
                                <XCircle className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteHostel(hostel.id)}
                              className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                              title="Delete"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700 dark:text-gray-400">
                      Showing page {currentPage} of {totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-700 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Redirecting to Your Hostel
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                You don't have permission to view all hostels. Redirecting to your hostel dashboard...
              </p>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        {user?.role === 'SUPER_ADMIN' && hostels.length > 0 && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Average Monthly Revenue</p>
                  <p className="text-2xl font-bold mt-1">${(stats.paid * 10).toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 opacity-90" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Conversion Rate</p>
                  <p className="text-2xl font-bold mt-1">
                    {stats.total > 0 ? ((stats.paid / stats.total) * 100).toFixed(1) : 0}%
                  </p>
                </div>
                <Users className="h-8 w-8 opacity-90" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">Total Rooms Managed</p>
                  <p className="text-2xl font-bold mt-1">
                    {hostels.reduce((sum, h) => sum + h._count.rooms, 0).toLocaleString()}
                  </p>
                </div>
                <Bed className="h-8 w-8 opacity-90" />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
