'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import DashboardLayout from '../../../components/layout/DashboardLayout';
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
  ArrowLeft,
  Users,
  Bed
} from 'lucide-react';

interface HostelFormData {
  name: string;
  slug: string;
  plan: 'FREE' | 'BASIC' | 'PREMIUM' | 'ENTERPRISE';
  settings: {
    address: string;
    phone: string;
    email: string;
    website: string;
    checkInTime: string;
    checkOutTime: string;
    currency: string;
    timezone: string;
  };
}

export default function NewHostelPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<HostelFormData>({
    name: '',
    slug: '',
    plan: 'FREE',
    settings: {
      address: '',
      phone: '',
      email: '',
      website: '',
      checkInTime: '14:00',
      checkOutTime: '11:00',
      currency: 'USD',
      timezone: 'UTC',
    },
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState('');

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

    if (formData.settings.website && formData.settings.website.trim() !== '' && !/^https?:\/\/.+\..+/.test(formData.settings.website)) {
      newErrors.website = 'Invalid website URL (must start with http:// or https://)';
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
      
      // Clean up empty strings to send undefined instead
      const cleanData = {
        name: formData.name,
        slug: formData.slug,
        plan: formData.plan,
        settings: {
          address: formData.settings.address || undefined,
          phone: formData.settings.phone || undefined,
          email: formData.settings.email || undefined,
          website: formData.settings.website || undefined,
          checkInTime: formData.settings.checkInTime,
          checkOutTime: formData.settings.checkOutTime,
          currency: formData.settings.currency,
          timezone: formData.settings.timezone,
        },
      };

      const response = await fetch('http://localhost:5001/api/hostels', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cleanData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Hostel created successfully!');
        setTimeout(() => {
          router.push('/hostels');
        }, 1500);
      } else {
        setErrors({ submit: data.error || 'Failed to create hostel' });
      }
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create hostel' });
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

  const handleWebsiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();
    
    // Auto-add https:// if user enters something without protocol
    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
      value = `https://${value}`;
    }
    
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, website: value }
    }));
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Hostel</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Register a new hostel in the system
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
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Hostel
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
                    />
                  </div>
                  {errors.slug && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.slug}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    This will be your unique URL. Only lowercase letters, numbers, and hyphens.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Plan *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {(['FREE', 'BASIC', 'PREMIUM', 'ENTERPRISE'] as const).map((plan) => (
                      <div
                        key={plan}
                        className={`border rounded-lg p-3 cursor-pointer transition-all ${
                          formData.plan === plan
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                            : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                        }`}
                        onClick={() => setFormData(prev => ({ ...prev, plan }))}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{plan}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              {plan === 'FREE' && 'Free forever'}
                              {plan === 'BASIC' && '$10/month'}
                              {plan === 'PREMIUM' && '$30/month'}
                              {plan === 'ENTERPRISE' && '$50/month'}
                            </div>
                          </div>
                          {formData.plan === plan && (
                            <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
                    onChange={handleWebsiteChange}
                    className={`block w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.website 
                        ? 'border-red-300 dark:border-red-700' 
                        : 'border-gray-300 dark:border-gray-700'
                    } bg-white dark:bg-gray-900`}
                    placeholder="https://www.hostel.com"
                    onBlur={(e) => {
                      if (e.target.value && !e.target.value.startsWith('http')) {
                        handleWebsiteChange(e);
                      }
                    }}
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
              </div>
            </div>

            {/* Plan Features */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <Shield className="h-5 w-5 text-red-500 mr-2" />
                Plan Features
              </h3>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-800/10 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    {formData.plan} Plan Features
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {formData.plan === 'FREE' ? '10 rooms limit' : 'Unlimited rooms'}
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {formData.plan === 'FREE' ? '3 staff accounts' : 'Unlimited staff'}
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {formData.plan === 'FREE' ? 'Basic analytics' : 'Advanced analytics'}
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {formData.plan === 'FREE' ? 'Email support' : '24/7 priority support'}
                    </li>
                    <li className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      {formData.plan === 'FREE' ? 'No setup fee' : 'Free setup & migration'}
                    </li>
                  </ul>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mr-3 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-300">
                        Important Note
                      </h4>
                      <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                        You can upgrade or downgrade the plan at any time from the hostel settings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Ready to Create</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Review all information before creating the hostel
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Creating Hostel...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-3" />
                      Create Hostel Now
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