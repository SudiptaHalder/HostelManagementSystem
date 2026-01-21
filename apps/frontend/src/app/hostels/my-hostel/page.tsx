// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAuth } from '../../../context/AuthContext';
// import DashboardLayout from '../../../components/layout/DashboardLayout';
// import {
//   Building2,
//   Users,
//   Bed,
//   Calendar,
//   CreditCard,
//   MapPin,
//   Phone,
//   Mail,
//   Globe,
//   Clock,
//   DollarSign,
//   Globe2,
//   Edit,
//   TrendingUp,
//   TrendingDown,
//   CheckCircle,
//   XCircle,
//   Star,
//   Download
// } from 'lucide-react';

// interface HostelStats {
//   monthlyRevenue: number;
//   todayBookings: number;
//   availableRooms: number;
//   totalRooms: number;
//   totalGuests: number;
//   totalBookings: number;
//   totalStaff: number;
// }

// interface Hostel {
//   id: string;
//   name: string;
//   slug: string;
//   plan: string;
//   isActive: boolean;
//   settings: any;
//   createdAt: string;
//   _count: {
//     users: number;
//     rooms: number;
//     bookings: number;
//     guests: number;
//   };
// }

// export default function MyHostelPage() {
//   const router = useRouter();
//   const { user, hostel: contextHostel, isAuthenticated, isLoading } = useAuth();
//   const [hostel, setHostel] = useState<Hostel | null>(null);
//   const [stats, setStats] = useState<HostelStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('overview');

//   useEffect(() => {
//     if (!isAuthenticated || isLoading) return;

//     fetchHostelData();
//   }, [isAuthenticated, isLoading]);

//   const fetchHostelData = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('token');
      
//       const response = await fetch('http://localhost:5001/api/hostels/my-hostel', {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();
      
//       if (response.ok) {
//         setHostel(data.hostel);
//         setStats(data.stats);
//       }
//     } catch (error) {
//       console.error('Failed to fetch hostel data:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpgradePlan = () => {
//     router.push('/hostels/upgrade');
//   };

//   if (isLoading || loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (!isAuthenticated || !hostel) {
//     return null;
//   }

//   const planColor = hostel.plan === 'FREE' 
//     ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
//     : hostel.plan === 'BASIC'
//     ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
//     : hostel.plan === 'PREMIUM'
//     ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
//     : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';

//   const occupancyRate = stats ? ((stats.totalRooms - stats.availableRooms) / stats.totalRooms) * 100 : 0;

//   return (
//     <DashboardLayout>
//       <div>
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white mb-6">
//           <div className="flex flex-col md:flex-row md:items-center justify-between">
//             <div>
//               <div className="flex items-center mb-2">
//                 <Building2 className="h-8 w-8 mr-3" />
//                 <h1 className="text-2xl font-bold">{hostel.name}</h1>
//               </div>
//               <div className="flex items-center space-x-4 text-sm opacity-90">
//                 <span className="flex items-center">
//                   <Globe2 className="h-4 w-4 mr-1" />
//                   hostelsaas.com/{hostel.slug}
//                 </span>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${planColor}`}>
//                   {hostel.plan} PLAN
//                 </span>
//                 <span className="flex items-center">
//                   {hostel.isActive ? (
//                     <>
//                       <CheckCircle className="h-4 w-4 mr-1 text-green-300" />
//                       <span className="text-green-300">Active</span>
//                     </>
//                   ) : (
//                     <>
//                       <XCircle className="h-4 w-4 mr-1 text-red-300" />
//                       <span className="text-red-300">Inactive</span>
//                     </>
//                   )}
//                 </span>
//               </div>
//             </div>
//             <div className="mt-4 md:mt-0 flex space-x-3">
//               <button
//                 onClick={() => router.push(`/hostels/${hostel.id}/edit`)}
//                 className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors"
//               >
//                 <Edit className="h-4 w-4 mr-2" />
//                 Edit Hostel
//               </button>
//               {hostel.plan === 'FREE' && (
//                 <button
//                   onClick={handleUpgradePlan}
//                   className="inline-flex items-center px-4 py-2 bg-white text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
//                 >
//                   <Star className="h-4 w-4 mr-2" />
//                   Upgrade Plan
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Monthly Revenue</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
//                   ${stats?.monthlyRevenue.toLocaleString() || '0'}
//                 </p>
//               </div>
//               <CreditCard className="h-8 w-8 text-blue-500" />
//             </div>
//             <div className="mt-4">
//               <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
//                 <TrendingUp className="h-3 w-3 mr-1" />
//                 +8.2% from last month
//               </span>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Occupancy Rate</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
//                   {occupancyRate.toFixed(1)}%
//                 </p>
//               </div>
//               <Bed className="h-8 w-8 text-green-500" />
//             </div>
//             <div className="mt-4">
//               <span className={`text-xs flex items-center ${
//                 occupancyRate >= 70 
//                   ? 'text-green-600 dark:text-green-400' 
//                   : 'text-yellow-600 dark:text-yellow-400'
//               }`}>
//                 {occupancyRate >= 70 ? (
//                   <TrendingUp className="h-3 w-3 mr-1" />
//                 ) : (
//                   <TrendingDown className="h-3 w-3 mr-1" />
//                 )}
//                 {occupancyRate >= 70 ? 'Above average' : 'Below average'}
//               </span>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Today's Bookings</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
//                   {stats?.todayBookings || '0'}
//                 </p>
//               </div>
//               <Calendar className="h-8 w-8 text-purple-500" />
//             </div>
//             <div className="mt-4">
//               <span className="text-xs text-gray-500 dark:text-gray-400">
//                 {stats?.availableRooms || '0'} rooms available
//               </span>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">Total Guests</p>
//                 <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
//                   {stats?.totalGuests.toLocaleString() || '0'}
//                 </p>
//               </div>
//               <Users className="h-8 w-8 text-orange-500" />
//             </div>
//             <div className="mt-4">
//               <span className="text-xs text-green-600 dark:text-green-400 flex items-center">
//                 <TrendingUp className="h-3 w-3 mr-1" />
//                 +15 this week
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
//           <nav className="-mb-px flex space-x-8">
//             {['overview', 'details', 'settings', 'reports'].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`py-2 px-1 border-b-2 font-medium text-sm ${
//                   activeTab === tab
//                     ? 'border-blue-500 text-blue-600 dark:text-blue-400'
//                     : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </nav>
//         </div>

//         {/* Tab Content */}
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
//           {activeTab === 'overview' && (
//             <div className="p-6">
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Quick Stats */}
//                 <div className="lg:col-span-2">
//                   <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//                     Performance Overview
//                   </h3>
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
//                       <p className="text-sm text-gray-500 dark:text-gray-400">Total Rooms</p>
//                       <p className="text-2xl font-bold text-gray-900 dark:text-white">
//                         {stats?.totalRooms || '0'}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
//                       <p className="text-sm text-gray-500 dark:text-gray-400">Active Staff</p>
//                       <p className="text-2xl font-bold text-gray-900 dark:text-white">
//                         {stats?.totalStaff || '0'}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
//                       <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
//                       <p className="text-2xl font-bold text-gray-900 dark:text-white">
//                         {stats?.totalBookings.toLocaleString() || '0'}
//                       </p>
//                     </div>
//                     <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
//                       <p className="text-sm text-gray-500 dark:text-gray-400">Avg. Stay Duration</p>
//                       <p className="text-2xl font-bold text-gray-900 dark:text-white">2.3 days</p>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Plan Details */}
//                 <div>
//                   <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
//                     Plan Details
//                   </h3>
//                   <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-5">
//                     <div className="flex items-center justify-between mb-4">
//                       <span className={`px-3 py-1 rounded-full text-sm font-medium ${planColor}`}>
//                         {hostel.plan}
//                       </span>
//                       <Star className="h-5 w-5 text-yellow-500" />
//                     </div>
                    
//                     <div className="space-y-3">
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600 dark:text-gray-400">Rooms Limit</span>
//                         <span className="text-sm font-medium text-gray-900 dark:text-white">
//                           {hostel.plan === 'FREE' ? '10 rooms' : 'Unlimited'}
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600 dark:text-gray-400">Staff Accounts</span>
//                         <span className="text-sm font-medium text-gray-900 dark:text-white">
//                           {hostel.plan === 'FREE' ? '3 users' : 'Unlimited'}
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600 dark:text-gray-400">Support</span>
//                         <span className="text-sm font-medium text-gray-900 dark:text-white">
//                           {hostel.plan === 'FREE' ? 'Email only' : 'Priority support'}
//                         </span>
//                       </div>
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Cost</span>
//                         <span className="text-sm font-medium text-gray-900 dark:text-white">
//                           {hostel.plan === 'FREE' ? '$0' : 
//                            hostel.plan === 'BASIC' ? '$10' :
//                            hostel.plan === 'PREMIUM' ? '$30' : '$50'}
//                         </span>
//                       </div>
//                     </div>

//                     {hostel.plan === 'FREE' && (
//                       <button
//                         onClick={handleUpgradePlan}
//                         className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors"
//                       >
//                         Upgrade Plan
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'details' && (
//             <div className="p-6">
//               <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-6">
//                 Hostel Details
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {/* Contact Information */}
//                 <div className="space-y-4">
//                   <h4 className="font-medium text-gray-900 dark:text-white">Contact Information</h4>
//                   <div className="space-y-3">
//                     {hostel.settings?.address && (
//                       <div className="flex items-start">
//                         <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-3" />
//                         <div>
//                           <p className="text-sm font-medium text-gray-900 dark:text-white">Address</p>
//                           <p className="text-sm text-gray-600 dark:text-gray-400">
//                             {hostel.settings.address}
//                           </p>
//                         </div>
//                       </div>
//                     )}
                    
//                     {hostel.settings?.phone && (
//                       <div className="flex items-center">
//                         <Phone className="h-5 w-5 text-gray-400 mr-3" />
//                         <div>
//                           <p className="text-sm font-medium text-gray-900 dark:text-white">Phone</p>
//                           <p className="text-sm text-gray-600 dark:text-gray-400">
//                             {hostel.settings.phone}
//                           </p>
//                         </div>
//                       </div>
//                     )}
                    
//                     {hostel.settings?.email && (
//                       <div className="flex items-center">
//                         <Mail className="h-5 w-5 text-gray-400 mr-3" />
//                         <div>
//                           <p className="text-sm font-medium text-gray-900 dark:text-white">Email</p>
//                           <p className="text-sm text-gray-600 dark:text-gray-400">
//                             {hostel.settings.email}
//                           </p>
//                         </div>
//                       </div>
//                     )}
                    
//                     {hostel.settings?.website && (
//                       <div className="flex items-center">
//                         <Globe className="h-5 w-5 text-gray-400 mr-3" />
//                         <div>
//                           <p className="text-sm font-medium text-gray-900 dark:text-white">Website</p>
//                           <a 
//                             href={hostel.settings.website} 
//                             target="_blank" 
//                             rel="noopener noreferrer"
//                             className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
//                           >
//                             {hostel.settings.website}
//                           </a>
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Operational Settings */}
//                 <div className="space-y-4">
//                   <h4 className="font-medium text-gray-900 dark:text-white">Operational Settings</h4>
//                   <div className="space-y-3">
//                     <div className="flex items-center">
//                       <Clock className="h-5 w-5 text-gray-400 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-900 dark:text-white">Check-in Time</p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           {hostel.settings?.checkInTime || '2:00 PM'}
//                         </p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center">
//                       <Clock className="h-5 w-5 text-gray-400 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-900 dark:text-white">Check-out Time</p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           {hostel.settings?.checkOutTime || '11:00 AM'}
//                         </p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center">
//                       <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-900 dark:text-white">Currency</p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           {hostel.settings?.currency || 'USD'}
//                         </p>
//                       </div>
//                     </div>
                    
//                     <div className="flex items-center">
//                       <Globe2 className="h-5 w-5 text-gray-400 mr-3" />
//                       <div>
//                         <p className="text-sm font-medium text-gray-900 dark:text-white">Timezone</p>
//                         <p className="text-sm text-gray-600 dark:text-gray-400">
//                           {hostel.settings?.timezone || 'UTC'}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {activeTab === 'reports' && (
//             <div className="p-6">
//               <div className="flex justify-between items-center mb-6">
//                 <h3 className="text-lg font-medium text-gray-900 dark:text-white">
//                   Reports & Analytics
//                 </h3>
//                 <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900">
//                   <Download className="h-4 w-4 mr-2" />
//                   Export Report
//                 </button>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5">
//                   <h4 className="font-medium text-gray-900 dark:text-white mb-4">Monthly Performance</h4>
//                   <div className="space-y-4">
//                     <div>
//                       <div className="flex justify-between text-sm mb-1">
//                         <span className="text-gray-600 dark:text-gray-400">Occupancy Rate</span>
//                         <span className="font-medium text-gray-900 dark:text-white">{occupancyRate.toFixed(1)}%</span>
//                       </div>
//                       <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                         <div 
//                           className="h-full bg-green-500 rounded-full" 
//                           style={{ width: `${Math.min(occupancyRate, 100)}%` }}
//                         ></div>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <div className="flex justify-between text-sm mb-1">
//                         <span className="text-gray-600 dark:text-gray-400">Revenue Growth</span>
//                         <span className="font-medium text-green-600 dark:text-green-400">+8.2%</span>
//                       </div>
//                       <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                         <div className="h-full bg-blue-500 rounded-full" style={{ width: '82%' }}></div>
//                       </div>
//                     </div>
                    
//                     <div>
//                       <div className="flex justify-between text-sm mb-1">
//                         <span className="text-gray-600 dark:text-gray-400">Guest Satisfaction</span>
//                         <span className="font-medium text-gray-900 dark:text-white">4.8/5</span>
//                       </div>
//                       <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
//                         <div className="h-full bg-yellow-500 rounded-full" style={{ width: '96%' }}></div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-5">
//                   <h4 className="font-medium text-gray-900 dark:text-white mb-4">Quick Insights</h4>
//                   <ul className="space-y-3">
//                     <li className="flex items-start">
//                       <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5 mr-3"></div>
//                       <span className="text-sm text-gray-600 dark:text-gray-400">
//                         Peak booking hours: 2 PM - 4 PM
//                       </span>
//                     </li>
//                     <li className="flex items-start">
//                       <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5 mr-3"></div>
//                       <span className="text-sm text-gray-600 dark:text-gray-400">
//                         Most popular room type: Private
//                       </span>
//                     </li>
//                     <li className="flex items-start">
//                       <div className="h-2 w-2 rounded-full bg-purple-500 mt-1.5 mr-3"></div>
//                       <span className="text-sm text-gray-600 dark:text-gray-400">
//                         Average stay duration: 2.3 nights
//                       </span>
//                     </li>
//                     <li className="flex items-start">
//                       <div className="h-2 w-2 rounded-full bg-orange-500 mt-1.5 mr-3"></div>
//                       <span className="text-sm text-gray-600 dark:text-gray-400">
//                         Repeat guest rate: 28%
//                       </span>
//                     </li>
//                   </ul>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </DashboardLayout>
//   );
// }
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
  Download,
  Save,
  ChevronDown,
  LogOut,
  Key,
  Bell,
  Shield,
  Users as UsersIcon,
  Wifi,
  CreditCard as CreditCardIcon,
  FileText,
  Sun,
  Moon,
  Languages,
  Check,
  AlertCircle
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

interface AllHostelsResponse {
  hostels: Hostel[];
  pagination: {
    total: number;
    pages: number;
    page: number;
    limit: number;
  };
}

// Settings interface
interface HostelSettings {
  // General Settings
  displayName: string;
  contactEmail: string;
  contactPhone: string;
  address: string;
  website: string;
  timezone: string;
  currency: string;
  language: string;
  theme: 'light' | 'dark' | 'auto';
  
  // Booking Settings
  checkInTime: string;
  checkOutTime: string;
  lateCheckoutFee: number;
  minStayNights: number;
  maxStayNights: number;
  advanceBookingDays: number;
  cancellationPolicy: string;
  
  // Payment Settings
  paymentMethods: string[];
  taxPercentage: number;
  requireDeposit: boolean;
  depositPercentage: number;
  
  // Notification Settings
  emailNotifications: boolean;
  smsNotifications: boolean;
  bookingConfirmation: boolean;
  checkInReminder: boolean;
  checkOutReminder: boolean;
  
  // Security Settings
  twoFactorAuth: boolean;
  sessionTimeout: number;
  loginNotifications: boolean;
  
  // Additional Features
  enableReviews: boolean;
  enablePromoCodes: boolean;
  enableLoyaltyProgram: boolean;
  autoCheckin: boolean;
  autoCheckout: boolean;
}

// Default stats object
const defaultStats: HostelStats = {
  monthlyRevenue: 0,
  todayBookings: 0,
  availableRooms: 0,
  totalRooms: 0,
  totalGuests: 0,
  totalBookings: 0,
  totalStaff: 0,
};

export default function MyHostelPage() {
  const router = useRouter();
  const { user, hostel: contextHostel, isAuthenticated, isLoading, logout } = useAuth();
  const [hostel, setHostel] = useState<Hostel | null>(null);
  const [allHostels, setAllHostels] = useState<Hostel[]>([]);
  const [stats, setStats] = useState<HostelStats>(defaultStats);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showHostelDropdown, setShowHostelDropdown] = useState(false);
  
  // Settings state
  const [settings, setSettings] = useState<HostelSettings>({
    // General Settings
    displayName: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    website: '',
    timezone: 'UTC',
    currency: 'USD',
    language: 'en',
    theme: 'auto',
    
    // Booking Settings
    checkInTime: '14:00',
    checkOutTime: '11:00',
    lateCheckoutFee: 20,
    minStayNights: 1,
    maxStayNights: 30,
    advanceBookingDays: 365,
    cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    
    // Payment Settings
    paymentMethods: ['credit_card', 'cash', 'bank_transfer'],
    taxPercentage: 10,
    requireDeposit: true,
    depositPercentage: 20,
    
    // Notification Settings
    emailNotifications: true,
    smsNotifications: false,
    bookingConfirmation: true,
    checkInReminder: true,
    checkOutReminder: true,
    
    // Security Settings
    twoFactorAuth: false,
    sessionTimeout: 60,
    loginNotifications: true,
    
    // Additional Features
    enableReviews: true,
    enablePromoCodes: false,
    enableLoyaltyProgram: false,
    autoCheckin: false,
    autoCheckout: false,
  });
  
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    fetchHostelData();
    fetchAllHostels();
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
        // Use the stats from response or default stats
        setStats(data.stats ? {
          monthlyRevenue: data.stats.monthlyRevenue || 0,
          todayBookings: data.stats.todayBookings || 0,
          availableRooms: data.stats.availableRooms || 0,
          totalRooms: data.stats.totalRooms || 0,
          totalGuests: data.stats.totalGuests || 0,
          totalBookings: data.stats.totalBookings || 0,
          totalStaff: data.stats.totalStaff || 0,
        } : defaultStats);
        
        // Load settings from hostel data if available
        if (data.hostel?.settings) {
          setSettings(prev => ({
            ...prev,
            ...data.hostel.settings,
            displayName: data.hostel.name || '',
            contactEmail: data.hostel.settings?.email || '',
            contactPhone: data.hostel.settings?.phone || '',
            address: data.hostel.settings?.address || '',
            website: data.hostel.settings?.website || '',
            timezone: data.hostel.settings?.timezone || 'UTC',
            currency: data.hostel.settings?.currency || 'USD',
            checkInTime: data.hostel.settings?.checkInTime || '14:00',
            checkOutTime: data.hostel.settings?.checkOutTime || '11:00',
            lateCheckoutFee: data.hostel.settings?.lateCheckoutFee || 20,
            cancellationPolicy: data.hostel.settings?.cancellationPolicy || 'Free cancellation up to 24 hours before check-in',
          }));
        }
      } else {
        // If API fails, use default stats
        setStats(defaultStats);
      }
    } catch (error) {
      console.error('Failed to fetch hostel data:', error);
      setStats(defaultStats);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllHostels = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5001/api/hostels?limit=100', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data: AllHostelsResponse = await response.json();
      
      if (response.ok) {
        setAllHostels(data.hostels);
      }
    } catch (error) {
      console.error('Failed to fetch all hostels:', error);
    }
  };

  const switchHostel = async (hostelId: string) => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch the new hostel's data
      const response = await fetch(`http://localhost:5001/api/hostels/${hostelId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setHostel(data.hostel);
        // Reset stats to default first
        setStats(defaultStats);
        
        // Also fetch stats for the new hostel
        const statsResponse = await fetch(`http://localhost:5001/api/hostels/${hostelId}/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (statsResponse.ok) {
          const statsData = await statsResponse.json();
          setStats({
            monthlyRevenue: statsData.stats?.monthlyRevenue || 0,
            todayBookings: statsData.stats?.todayBookings || 0,
            availableRooms: statsData.stats?.availableRooms || 0,
            totalRooms: statsData.stats?.totalRooms || 0,
            totalGuests: statsData.stats?.totalGuests || 0,
            totalBookings: statsData.stats?.totalBookings || 0,
            totalStaff: statsData.stats?.totalStaff || 0,
          });
        }
        
        // Load settings for the new hostel
        if (data.hostel?.settings) {
          setSettings(prev => ({
            ...prev,
            ...data.hostel.settings,
            displayName: data.hostel.name || '',
            contactEmail: data.hostel.settings?.email || '',
            contactPhone: data.hostel.settings?.phone || '',
            address: data.hostel.settings?.address || '',
            website: data.hostel.settings?.website || '',
            timezone: data.hostel.settings?.timezone || 'UTC',
            currency: data.hostel.settings?.currency || 'USD',
            checkInTime: data.hostel.settings?.checkInTime || '14:00',
            checkOutTime: data.hostel.settings?.checkOutTime || '11:00',
            lateCheckoutFee: data.hostel.settings?.lateCheckoutFee || 20,
            cancellationPolicy: data.hostel.settings?.cancellationPolicy || 'Free cancellation up to 24 hours before check-in',
          }));
        }
      }
      setShowHostelDropdown(false);
    } catch (error) {
      console.error('Failed to switch hostel:', error);
    }
  };

  const handleUpgradePlan = () => {
    router.push('/hostels/upgrade');
  };

  const handleSaveSettings = async () => {
    try {
      setIsSavingSettings(true);
      setSettingsMessage(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/hostels/${hostel?.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: settings.displayName,
          settings: {
            email: settings.contactEmail,
            phone: settings.contactPhone,
            address: settings.address,
            website: settings.website,
            timezone: settings.timezone,
            currency: settings.currency,
            checkInTime: settings.checkInTime,
            checkOutTime: settings.checkOutTime,
            lateCheckoutFee: settings.lateCheckoutFee,
            cancellationPolicy: settings.cancellationPolicy,
            // Save all settings
            ...settings
          }
        }),
      });

      if (response.ok) {
        setSettingsMessage({ type: 'success', text: 'Settings saved successfully!' });
        // Refresh hostel data
        fetchHostelData();
      } else {
        setSettingsMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSettingsMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSavingSettings(false);
      // Clear message after 3 seconds
      setTimeout(() => setSettingsMessage(null), 3000);
    }
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

  if (!isAuthenticated) {
    return null;
  }

  const planColor = hostel?.plan === 'FREE' 
    ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
    : hostel?.plan === 'BASIC'
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    : hostel?.plan === 'PREMIUM'
    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
    : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';

  const occupancyRate = stats.totalRooms > 0 
    ? ((stats.totalRooms - stats.availableRooms) / stats.totalRooms) * 100 
    : 0;

  return (
    <DashboardLayout>
      <div>
        {/* Header with Hostel Dropdown */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-6 text-white mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="relative">
              <div className="flex items-center mb-2">
                <Building2 className="h-8 w-8 mr-3" />
                <div>
                  <div className="flex items-center">
                    <h1 className="text-2xl font-bold">{hostel?.name || 'My Hostel'}</h1>
                    {allHostels.length > 1 && (
                      <button
                        onClick={() => setShowHostelDropdown(!showHostelDropdown)}
                        className="ml-2 p-1 hover:bg-white/20 rounded-lg transition-colors"
                      >
                        <ChevronDown className={`h-5 w-5 transition-transform ${showHostelDropdown ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>
                  
                  {/* Hostel Dropdown */}
                  {showHostelDropdown && allHostels.length > 1 && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 border border-gray-200 dark:border-gray-700">
                      <div className="py-2">
                        <div className="px-4 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                          Switch Hostel
                        </div>
                        {allHostels.map((h) => (
                          <button
                            key={h.id}
                            onClick={() => switchHostel(h.id)}
                            className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center justify-between ${
                              h.id === hostel?.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                            }`}
                          >
                            <div className="flex items-center">
                              <Building2 className="h-4 w-4 mr-2 text-gray-400" />
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{h.name}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">{h.slug}</div>
                              </div>
                            </div>
                            {h.id === hostel?.id && (
                              <Check className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm opacity-90">
                <span className="flex items-center">
                  <Globe2 className="h-4 w-4 mr-1" />
                  hostelsaas.com/{hostel?.slug || 'your-hostel'}
                </span>
                {hostel?.plan && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${planColor}`}>
                    {hostel.plan} PLAN
                  </span>
                )}
                <span className="flex items-center">
                  {hostel?.isActive ? (
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
              {hostel && (
                <button
                  onClick={() => router.push(`/hostels/${hostel.id}/edit`)}
                  className="inline-flex items-center px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-medium transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Hostel
                </button>
              )}
              {hostel?.plan === 'FREE' && (
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
                  ${stats.monthlyRevenue.toLocaleString()}
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
                  {stats.todayBookings}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
            <div className="mt-4">
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {stats.availableRooms} rooms available
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Guests</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stats.totalGuests.toLocaleString()}
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
                        {stats.totalRooms}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Active Staff</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalStaff}
                      </p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Total Bookings</p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white">
                        {stats.totalBookings.toLocaleString()}
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
                      {hostel?.plan && (
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${planColor}`}>
                          {hostel.plan}
                        </span>
                      )}
                      <Star className="h-5 w-5 text-yellow-500" />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Rooms Limit</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {hostel?.plan === 'FREE' ? '10 rooms' : 'Unlimited'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Staff Accounts</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {hostel?.plan === 'FREE' ? '3 users' : 'Unlimited'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Support</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {hostel?.plan === 'FREE' ? 'Email only' : 'Priority support'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Cost</span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {hostel?.plan === 'FREE' ? '$0' : 
                           hostel?.plan === 'BASIC' ? '$10' :
                           hostel?.plan === 'PREMIUM' ? '$30' : '$50'}
                        </span>
                      </div>
                    </div>

                    {hostel?.plan === 'FREE' && (
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
                    {hostel?.settings?.address && (
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
                    
                    {hostel?.settings?.phone && (
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
                    
                    {hostel?.settings?.email && (
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
                    
                    {hostel?.settings?.website && (
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
                          {hostel?.settings?.checkInTime || '2:00 PM'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Check-out Time</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {hostel?.settings?.checkOutTime || '11:00 AM'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Currency</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {hostel?.settings?.currency || 'USD'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <Globe2 className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Timezone</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {hostel?.settings?.timezone || 'UTC'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Hostel Settings
                </h3>
                <div className="flex items-center space-x-3">
                  {settingsMessage && (
                    <div className={`px-4 py-2 rounded-lg text-sm ${
                      settingsMessage.type === 'success' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}>
                      {settingsMessage.text}
                    </div>
                  )}
                  <button
                    onClick={handleSaveSettings}
                    disabled={isSavingSettings || !hostel}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSavingSettings ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Settings Sections */}
              <div className="space-y-8">
                {/* General Settings */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Building2 className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">General Settings</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Display Name
                      </label>
                      <input
                        type="text"
                        value={settings.displayName}
                        onChange={(e) => setSettings({...settings, displayName: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={settings.contactPhone}
                        onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Timezone
                      </label>
                      <select
                        value={settings.timezone}
                        onChange={(e) => setSettings({...settings, timezone: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time (ET)</option>
                        <option value="America/Chicago">Central Time (CT)</option>
                        <option value="America/Denver">Mountain Time (MT)</option>
                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                        <option value="Europe/London">London (GMT)</option>
                        <option value="Europe/Paris">Paris (CET)</option>
                        <option value="Asia/Tokyo">Tokyo (JST)</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Address
                      </label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => setSettings({...settings, address: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Settings */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Calendar className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Booking Settings</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Check-in Time
                      </label>
                      <input
                        type="time"
                        value={settings.checkInTime}
                        onChange={(e) => setSettings({...settings, checkInTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Check-out Time
                      </label>
                      <input
                        type="time"
                        value={settings.checkOutTime}
                        onChange={(e) => setSettings({...settings, checkOutTime: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Late Checkout Fee ($)
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={settings.lateCheckoutFee}
                        onChange={(e) => setSettings({...settings, lateCheckoutFee: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Tax Percentage (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={settings.taxPercentage}
                        onChange={(e) => setSettings({...settings, taxPercentage: parseFloat(e.target.value) || 0})}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Cancellation Policy
                      </label>
                      <textarea
                        value={settings.cancellationPolicy}
                        onChange={(e) => setSettings({...settings, cancellationPolicy: e.target.value})}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Notification Settings */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Notification Settings</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive notifications via email</p>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Booking Confirmation</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Send confirmation emails for new bookings</p>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, bookingConfirmation: !settings.bookingConfirmation})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          settings.bookingConfirmation ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.bookingConfirmation ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Check-in Reminder</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Send reminder before check-in</p>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, checkInReminder: !settings.checkInReminder})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          settings.checkInReminder ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.checkInReminder ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Security Settings</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, twoFactorAuth: !settings.twoFactorAuth})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          settings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Login Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Get notified when someone logs into your account</p>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, loginNotifications: !settings.loginNotifications})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          settings.loginNotifications ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.loginNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Advanced Features */}
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Star className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <h4 className="font-medium text-gray-900 dark:text-white">Advanced Features</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Guest Reviews</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Allow guests to leave reviews</p>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, enableReviews: !settings.enableReviews})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          settings.enableReviews ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.enableReviews ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Promo Codes</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Enable promotional discounts</p>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, enablePromoCodes: !settings.enablePromoCodes})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          settings.enablePromoCodes ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.enablePromoCodes ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Loyalty Program</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Reward repeat guests</p>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, enableLoyaltyProgram: !settings.enableLoyaltyProgram})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          settings.enableLoyaltyProgram ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.enableLoyaltyProgram ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border dark:border-gray-700">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Auto Check-in</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Automatically check in guests</p>
                      </div>
                      <button
                        onClick={() => setSettings({...settings, autoCheckin: !settings.autoCheckin})}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                          settings.autoCheckin ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-700'
                        }`}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                          settings.autoCheckin ? 'translate-x-6' : 'translate-x-1'
                        }`} />
                      </button>
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