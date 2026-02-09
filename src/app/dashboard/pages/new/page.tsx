'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function NewPagePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // TODO: Save to Firebase
    setTimeout(() => {
      setSaving(false);
      router.push('/dashboard/pages');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Page</h1>
        <p className="text-gray-600 mt-2">Build your landing page from scratch or use a template</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <div>
              <Input
                label="Page Title"
                placeholder="My Business Name"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div>
              <Input
                label="URL Slug"
                placeholder="my-business"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                helperText="This will be your page URL: kashpages.com/my-business"
                required
              />
            </div>

            <div>
              <Select
                label="Category"
                options={[
                  { value: '', label: 'Select a category' },
                  { value: 'restaurant', label: 'Restaurant' },
                  { value: 'retail', label: 'Retail' },
                  { value: 'services', label: 'Services' },
                  { value: 'hospitality', label: 'Hospitality' },
                ]}
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
                placeholder="Brief description of your business..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            leftIcon={<Eye className="h-4 w-4" />}
          >
            Preview
          </Button>
          <Button
            type="submit"
            variant="primary"
            leftIcon={<Save className="h-4 w-4" />}
            loading={saving}
          >
            Save as Draft
          </Button>
        </div>
      </form>
    </div>
  );
}