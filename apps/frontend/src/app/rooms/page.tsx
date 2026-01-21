'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import {
  Bed,
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
  Users,
  DollarSign,
  Clock,
  Wifi,
  Tv,
  Coffee,
  Wind,
  Bath,
  Car,
  DoorClosed,
  DoorOpen,
  Star,
  MoreVertical,
  Calendar,
  User,
  MapPin,
  Phone
} from 'lucide-react';

interface Room {
  id: string;
  roomNumber: string;
  name: string;
  type: 'PRIVATE' | 'DORM' | 'FAMILY' | 'DELUXE';
  beds: number;
  maxGuests: number;
  pricePerNight: number;
  isAvailable: boolean;
  amenities: string[];
  description?: string;
  floor: number;
  size: number; // in square meters
  _count: {
    bookings: number;
  };
  currentBooking?: {
    guestName: string;
    checkIn: string;
    checkOut: string;
    status: string;
  };
}

export default function RoomsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const [floorFilter, setFloorFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    occupied: 0,
    private: 0,
    dorm: 0,
    family: 0,
    deluxe: 0,
    totalBeds: 0,
    occupancyRate: 0,
    monthlyRevenue: 0
  });

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    fetchRooms();
  }, [isAuthenticated, isLoading, currentPage, search, filter, roomTypeFilter, floorFilter]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = `http://localhost:5001/api/rooms?page=${currentPage}&limit=12`;
      if (search) url += `&search=${search}`;
      if (roomTypeFilter !== 'all') url += `&type=${roomTypeFilter}`;
      if (floorFilter !== 'all') url += `&floor=${floorFilter}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setRooms(data.rooms);
        setTotalPages(data.pagination.pages);
        calculateStats(data.rooms, data.pagination.total);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (roomsList: Room[], total: number) => {
    const available = roomsList.filter(r => r.isAvailable).length;
    const occupied = total - available;
    const privateRooms = roomsList.filter(r => r.type === 'PRIVATE').length;
    const dormRooms = roomsList.filter(r => r.type === 'DORM').length;
    const familyRooms = roomsList.filter(r => r.type === 'FAMILY').length;
    const deluxeRooms = roomsList.filter(r => r.type === 'DELUXE').length;
    const totalBeds = roomsList.reduce((sum, r) => sum + r.beds, 0);
    const occupancyRate = total > 0 ? (occupied / total) * 100 : 0;
    const monthlyRevenue = roomsList.reduce((sum, r) => sum + (r.pricePerNight * r._count.bookings), 0);

    setStats({
      total,
      available,
      occupied,
      private: privateRooms,
      dorm: dormRooms,
      family: familyRooms,
      deluxe: deluxeRooms,
      totalBeds,
      occupancyRate,
      monthlyRevenue
    });
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (!confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/rooms/${roomId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchRooms();
        setIsModalOpen(false);
        setSelectedRoom(null);
      }
    } catch (error) {
      console.error('Failed to delete room:', error);
      alert('Failed to delete room');
    }
  };

  const handleStatusChange = async (roomId: string, isAvailable: boolean) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/rooms/${roomId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAvailable: !isAvailable }),
      });

      if (response.ok) {
        fetchRooms();
        if (selectedRoom?.id === roomId) {
          setSelectedRoom(prev => prev ? { ...prev, isAvailable: !isAvailable } : null);
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Failed to update room status:', error);
      alert('Failed to update status');
    }
  };

  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRoom(null);
  };

  const getRoomTypeColor = (type: string) => {
    switch (type) {
      case 'PRIVATE': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'DORM': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'FAMILY': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      case 'DELUXE': return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case 'wifi': return <Wifi className="h-4 w-4" />;
      case 'tv': return <Tv className="h-4 w-4" />;
      case 'ac': return <Wind className="h-4 w-4" />;
      case 'breakfast': return <Coffee className="h-4 w-4" />;
      case 'bathroom': return <Bath className="h-4 w-4" />;
      case 'parking': return <Car className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Rooms Management</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage all rooms, check availability, and assign bookings
            </p>
          </div>
          <button
            onClick={() => router.push('/rooms/new')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Room
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Rooms</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <Bed className="h-8 w-8 text-blue-500" />
            </div>
            <div className="mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {stats.available} available, {stats.occupied} occupied
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.occupancyRate.toFixed(1)}%
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <span className={`text-xs flex items-center ${
                stats.occupancyRate >= 80 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-yellow-600 dark:text-yellow-400'
              }`}>
                {stats.occupancyRate >= 80 ? 'High occupancy' : 'Moderate occupancy'}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Beds</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalBeds}</p>
              </div>
              <Bed className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Capacity for {stats.totalBeds * 2} guests
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Revenue</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${stats.monthlyRevenue.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-amber-500" />
            </div>
            <div className="mt-2">
              <span className="text-xs text-green-600 dark:text-green-400">
                From {stats.total} rooms
              </span>
            </div>
          </div>
        </div>

        {/* Room Type Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Room Type Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Private</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.private}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rooms</p>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">Dorm</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.dorm}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rooms</p>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Family</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.family}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rooms</p>
            </div>
            <div className="text-center p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
              <p className="text-sm text-amber-600 dark:text-amber-400 font-medium">Deluxe</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.deluxe}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Rooms</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
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
                  placeholder="Search rooms by number, name, or type..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <select
                  value={roomTypeFilter}
                  onChange={(e) => setRoomTypeFilter(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="PRIVATE">Private</option>
                  <option value="DORM">Dorm</option>
                  <option value="FAMILY">Family</option>
                  <option value="DELUXE">Deluxe</option>
                </select>
                <Filter className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={floorFilter}
                  onChange={(e) => setFloorFilter(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Floors</option>
                  <option value="0">Ground Floor</option>
                  <option value="1">1st Floor</option>
                  <option value="2">2nd Floor</option>
                  <option value="3">3rd Floor</option>
                </select>
                <Filter className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>

              <div className="relative">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="appearance-none bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Rooms</option>
                  <option value="available">Available Only</option>
                  <option value="occupied">Occupied Only</option>
                </select>
                <Filter className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {rooms.map((room) => (
                <div key={room.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow">
                  {/* Room Header */}
                  <div className={`p-4 ${room.isAvailable ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-gray-600 to-gray-700'}`}>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-white">Room {room.roomNumber}</h3>
                        <p className="text-sm text-blue-100">{room.name}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoomTypeColor(room.type)}`}>
                          {room.type}
                        </span>
                        {room.isAvailable ? (
                          <DoorOpen className="h-5 w-5 text-green-300" />
                        ) : (
                          <DoorClosed className="h-5 w-5 text-red-300" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Bed className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {room.beds} bed{room.beds !== 1 ? 's' : ''} • {room.maxGuests} guest{room.maxGuests !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${room.pricePerNight}
                          <span className="text-sm text-gray-500 dark:text-gray-400">/night</span>
                        </p>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-2">
                        {room.amenities.slice(0, 4).map((amenity, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                            title={amenity}
                          >
                            {getAmenityIcon(amenity)}
                            <span className="ml-1 hidden sm:inline">{amenity}</span>
                          </span>
                        ))}
                        {room.amenities.length > 4 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                            +{room.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Room Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{room._count.bookings} bookings</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>Floor {room.floor}</span>
                      </div>
                    </div>

                    {/* Current Booking Info */}
                    {room.currentBooking && (
                      <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start">
                          <User className="h-4 w-4 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-2" />
                          <div>
                            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                              Currently occupied by {room.currentBooking.guestName}
                            </p>
                            <p className="text-xs text-yellow-600 dark:text-yellow-400">
                              Check-out: {new Date(room.currentBooking.checkOut).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t dark:border-gray-700">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewRoom(room)}
                          className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/rooms/${room.id}/edit`)}
                          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit Room"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/bookings/new?room=${room.id}`)}
                          className="p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="Book This Room"
                        >
                          <Calendar className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleStatusChange(room.id, room.isAvailable)}
                          className={room.isAvailable 
                            ? "p-2 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                            : "p-2 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          }
                          title={room.isAvailable ? "Mark as Occupied" : "Mark as Available"}
                        >
                          {room.isAvailable ? (
                            <DoorClosed className="h-4 w-4" />
                          ) : (
                            <DoorOpen className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Delete Room"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
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
            )}
          </>
        )}

        {/* Room Details Modal */}
        {isModalOpen && selectedRoom && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="p-6 border-b dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                      selectedRoom.isAvailable 
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600' 
                        : 'bg-gradient-to-r from-gray-600 to-gray-700'
                    }`}>
                      <Bed className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        Room {selectedRoom.roomNumber} - {selectedRoom.name}
                      </h2>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getRoomTypeColor(selectedRoom.type)}`}>
                          {selectedRoom.type}
                        </span>
                        <span className={`flex items-center text-sm ${
                          selectedRoom.isAvailable 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {selectedRoom.isAvailable ? (
                            <>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Available
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 mr-1" />
                              Occupied
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6">
                {/* Room Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Room Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Room Number:</span>
                        <span className="text-sm text-gray-900 dark:text-white font-medium">
                          {selectedRoom.roomNumber}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Floor:</span>
                        <span className="text-sm text-gray-900 dark:text-white">Floor {selectedRoom.floor}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Size:</span>
                        <span className="text-sm text-gray-900 dark:text-white">{selectedRoom.size} m²</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Beds:</span>
                        <span className="text-sm text-gray-900 dark:text-white">{selectedRoom.beds} beds</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Max Guests:</span>
                        <span className="text-sm text-gray-900 dark:text-white">{selectedRoom.maxGuests} guests</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Price per Night:</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">
                          ${selectedRoom.pricePerNight}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bookings:</span>
                        <span className="text-sm text-gray-900 dark:text-white">
                          {selectedRoom._count.bookings} bookings
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      Amenities & Features
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedRoom.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">
                          <div className="h-8 w-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center mr-3">
                            {getAmenityIcon(amenity)}
                          </div>
                          <span className="text-sm text-gray-900 dark:text-white">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedRoom.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-400">{selectedRoom.description}</p>
                  </div>
                )}

                {/* Current Booking */}
                {selectedRoom.currentBooking && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Current Booking</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Guest Name</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {selectedRoom.currentBooking.guestName}
                            </p>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedRoom.currentBooking.status === 'CHECKED_IN' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                        }`}>
                          {selectedRoom.currentBooking.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Check-in</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(selectedRoom.currentBooking.checkIn).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Check-out</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(selectedRoom.currentBooking.checkOut).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-6 border-t dark:border-gray-700">
                  <button
                    onClick={() => handleStatusChange(selectedRoom.id, selectedRoom.isAvailable)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${
                      selectedRoom.isAvailable
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 dark:bg-yellow-900 dark:text-yellow-300 dark:hover:bg-yellow-800'
                        : 'bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800'
                    }`}
                  >
                    {selectedRoom.isAvailable ? 'Mark as Occupied' : 'Mark as Available'}
                  </button>
                  <button
                    onClick={() => router.push(`/rooms/${selectedRoom.id}/edit`)}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Edit Room
                  </button>
                  <button
                    onClick={() => router.push(`/bookings/new?room=${selectedRoom.id}`)}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                  >
                    Book This Room
                  </button>
                  <button
                    onClick={() => handleDeleteRoom(selectedRoom.id)}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Delete Room
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}