'use client';

import { useState } from 'use';
import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { PagesService } from '@/services/pages.service';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { PageDocument } from '@/types/platform';

export default function NewPagePage() {
  const { user, userDoc } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'restaurant',
    city: '',
    district: '',
    phone: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !userDoc) return;
    
    try {
      setLoading(true);
      
      const slug = `${userDoc.username || user.uid}/${formData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')}`;
      
      const pageId = await PagesService.createPage(user.uid, {
        title: formData.title,
        slug,
        description: formData.description,
        ownerName: userDoc.displayName,
        category: formData.category,
        address: {
          addressLine1: '',
          addressLine2: null,
          city: formData.city,
          district: formData.district,
          state: 'Jammu and Kashmir',
          postalCode: null,
          country: 'India',
        },
        contact: {
          phone: formData.phone || null,
          whatsapp: null,
          email: formData.email || null,
          website: null,
          socialLinks: {
            facebook: null,
            instagram: null,
            youtube: null,
            twitter: null,
            linkedin: null,
          },
        },
        sections: [],
      });
      
      router.push(`/dashboard/pages/${pageId}/edit`);
    } catch (error) {
      console.error('Error creating page:', error);
      alert('Failed to create page. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: 'restaurant', label: '🍽️ Restaurant' },
    { value: 'hotel', label: '🏨 Hotel' },
    { value: 'shop', label: '🛍️ Shop' },
    { value: 'service', label: '🔧 Service' },
    { value: 'healthcare', label: '⚕️ Healthcare' },
    { value: 'education', label: '📚 Education' },
    { value: 'artisan', label: '🎨 Artisan' },
    { value: 'professional', label: '💼 Professional' },
    { value: 'tourism', label: '🗺️ Tourism' },
    { value: 'other', label: '📋 Other' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Create New Page</h1>
          <p className="text-gray-600 mt-1">Set up your business page in minutes</p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-8 space-y-6">
            {/* Basic Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Kashmiri Wazwan Restaurant"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Tell customers about your business..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="pt-6 border-t">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Srinagar"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Srinagar"
                  />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="pt-6 border-t">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="+91 ..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="business@example.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 bg-gray-50 border-t rounded-b-xl flex items-center justify-between">
            <p className="text-sm text-gray-600">
              You can add more details and customize your page after creation
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Create Page
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
