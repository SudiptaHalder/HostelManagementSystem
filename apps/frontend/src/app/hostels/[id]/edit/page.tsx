'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import DashboardLayout from '../../../../components/layout/DashboardLayout';
import {
  Building2,
  Save,
  X,
  Globe,
  Phone,
  Mail,
  MapPin,
  Clock,
  DollarSign,
  Globe2,
  Shield,
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

interface HostelFormData {
  name: string;
  slug: string;
  plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  isActive: boolean;
  settings: {
    address: string;
    phone: string;
    email: string;
    website: string;
    checkInTime: string;
    checkOutTime: string;
    currency: string;
    timezone: string;
    lateCheckoutFee: number;
    cancellationPolicy: string;
  };
}

export default function EditHostelPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<HostelFormData>({
    name: '',
    slug: '',
    plan: 'FREE',
    isActive: true,
    settings: {
      address: '',
      phone: '',
      email: '',
      website: '',
      checkInTime: '14:00',
      checkOutTime: '11:00',
      currency: 'USD',
      timezone: 'UTC',
      lateCheckoutFee: 25,
      cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

  const hostelId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated || isLoading) return;

    if (user?.role !== 'SUPER_ADMIN' && user?.hostelId !== hostelId) {
      router.push('/hostels/my-hostel');
      return;
    }

    fetchHostelData();
  }, [isAuthenticated, isLoading, hostelId, user]);

  const fetchHostelData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5001/api/hostels/${hostelId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFormData({
          name: data.hostel.name,
          slug: data.hostel.slug,
          plan: data.hostel.plan,
          isActive: data.hostel.isActive,
          settings: {
            address: data.hostel.settings?.address || '',
            phone: data.hostel.settings?.phone || '',
            email: data.hostel.settings?.email || '',
            website: data.hostel.settings?.website || '',
            checkInTime: data.hostel.settings?.checkInTime || '14:00',
            checkOutTime: data.hostel.settings?.checkOutTime || '11:00',
            currency: data.hostel.settings?.currency || 'USD',
            timezone: data.hostel.settings?.timezone || 'UTC',
            lateCheckoutFee: data.hostel.settings?.lateCheckoutFee || 25,
            cancellationPolicy: data.hostel.settings?.cancellationPolicy || 'Free cancellation up to 24 hours before check-in',
          },
        });
      }
    } catch (error) {
      console.error('Failed to fetch hostel data:', error);
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Hostel name is required';
    }

    if (!formData.slug.trim()) {
      newErrors.slug = 'Slug is required';
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = 'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (formData.settings.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.settings.email)) {
      newErrors.email = 'Invalid email address';
    }

    if (formData.settings.website && !/^https?:\/\/.+\..+/.test(formData.settings.website)) {
      newErrors.website = 'Invalid website URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      setSuccess('');
      
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5001/api/hostels/${hostelId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Hostel updated successfully!');
        setTimeout(() => {
          if (user?.role === 'SUPER_ADMIN') {
            router.push('/hostels');
          } else {
            router.push('/hostels/my-hostel');
          }
        }, 1500);
      } else {
        setErrors({ submit: data.error || 'Failed to update hostel' });
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to update hostel' });
    } finally {
      setSaving(false);
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    setFormData(prev => ({ ...prev, slug }));
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

  return (
    <DashboardLayout>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Hostel</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Update your hostel information and settings
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              <X className="h-4 w-4 mr-2 inline" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? (
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

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mr-3" />
              <span className="text-green-800 dark:text-green-300">{success}</span>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-3" />
              <span className="text-red-800 dark:text-red-300">{errors.submit}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Building2 className="h-5 w-5 text-blue-500 mr-2" />
                Basic Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Hostel Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name 
                        ? 'border-red-300 dark:border-red-700' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-900`}
                    placeholder="Sunset Hostel"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    URL Slug *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-sm">
                      hostelsaas.com/
                    </span>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={handleSlugChange}
                      className={`flex-1 block px-3 py-2 border rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.slug 
                          ? 'border-red-300 dark:border-red-700' 
                          : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-900`}
                      placeholder="sunset-hostel"
                      disabled={user?.role !== 'SUPER_ADMIN'}
                    />
                  </div>
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.slug}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    This will be your unique URL. Only lowercase letters, numbers, and hyphens.
                    {user?.role !== 'SUPER_ADMIN' && ' (Only super admins can change this)'}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Plan
                  </label>
                  <select
                    value={formData.plan}
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      plan: e.target.value as any 
                    }))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    disabled={user?.role !== 'SUPER_ADMIN'}
                  >
                    <option value="FREE">Free</option>
                    <option value="BASIC">Basic ($10/month)</option>
                    <option value="PREMIUM">Premium ($30/month)</option>
                    <option value="ENTERPRISE">Enterprise ($50/month)</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    {user?.role !== 'SUPER_ADMIN' && 'Contact support to change your plan'}
                  </p>
                </div>

                {user?.role === 'SUPER_ADMIN' && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.isActive}
                      onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-700 rounded"
                    />
                    <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                      Hostel is active
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Phone className="h-5 w-5 text-green-500 mr-2" />
                Contact Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <MapPin className="h-4 w-4 inline mr-1" />
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.settings.address}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, address: e.target.value }
                    }))}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="123 Main Street, City, Country"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Phone className="h-4 w-4 inline mr-1" />
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.settings.phone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, phone: e.target.value }
                      }))}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Mail className="h-4 w-4 inline mr-1" />
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.settings.email}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, email: e.target.value }
                      }))}
                      className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.email 
                          ? 'border-red-300 dark:border-red-700' 
                          : 'border-gray-300 dark:border-gray-700'
                      } bg-white dark:bg-gray-900`}
                      placeholder="info@hostel.com"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    <Globe className="h-4 w-4 inline mr-1" />
                    Website
                  </label>
                  <input
                    type="url"
                    value={formData.settings.website}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, website: e.target.value }
                    }))}
                    className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.website 
                        ? 'border-red-300 dark:border-red-700' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-900`}
                    placeholder="https://www.hostel.com"
                  />
                  {errors.website && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.website}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Operational Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 text-purple-500 mr-2" />
                Operational Settings
              </h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Check-in Time
                    </label>
                    <input
                      type="time"
                      value={formData.settings.checkInTime}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, checkInTime: e.target.value }
                      }))}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Check-out Time
                    </label>
                    <input
                      type="time"
                      value={formData.settings.checkOutTime}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, checkOutTime: e.target.value }
                      }))}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <DollarSign className="h-4 w-4 inline mr-1" />
                      Currency
                    </label>
                    <select
                      value={formData.settings.currency}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, currency: e.target.value }
                      }))}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="INR">INR (₹)</option>
                      <option value="JPY">JPY (¥)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      <Globe2 className="h-4 w-4 inline mr-1" />
                      Timezone
                    </label>
                    <select
                      value={formData.settings.timezone}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, timezone: e.target.value }
                      }))}
                      className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                      <option value="Europe/London">London (GMT)</option>
                      <option value="Europe/Paris">Paris (CET)</option>
                      <option value="Asia/Kolkata">India (IST)</option>
                      <option value="Asia/Tokyo">Tokyo (JST)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Late Check-out Fee
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                      {formData.settings.currency === 'USD' ? '$' :
                       formData.settings.currency === 'EUR' ? '€' :
                       formData.settings.currency === 'GBP' ? '£' :
                       formData.settings.currency === 'INR' ? '₹' : '¥'}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="5"
                      value={formData.settings.lateCheckoutFee}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        settings: { ...prev.settings, lateCheckoutFee: parseFloat(e.target.value) || 0 }
                      }))}
                      className="flex-1 block px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-r-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cancellation Policy
                  </label>
                  <textarea
                    value={formData.settings.cancellationPolicy}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      settings: { ...prev.settings, cancellationPolicy: e.target.value }
                    }))}
                    rows={3}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your cancellation policy..."
                  />
                </div>
              </div>
            </div>

            {/* Security & Advanced Settings */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 text-red-500 mr-2" />
                Security & Advanced
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Important Notice
                      </h4>
                      <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                        Changing these settings may affect your hostel's operations. 
                        Please review changes carefully before saving.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    API Access Key
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value="••••••••••••••••••••••••••••••"
                      readOnly
                      className="flex-1 block px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-l-lg bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400"
                    />
                    <button
                      type="button"
                      className="px-4 py-2 border border-l-0 border-gray-300 dark:border-gray-700 rounded-r-lg bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                    >
                      Regenerate
                    </button>
                  </div>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Used for integrating with third-party services
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Webhook URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-service.com/webhook"
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Receive real-time notifications about bookings and payments
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    type="button"
                    className="w-full px-4 py-2 border border-red-300 dark:border-red-700 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Reset All Settings to Default
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Review Changes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Make sure all information is correct before saving
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  Discard Changes
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Save All Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
