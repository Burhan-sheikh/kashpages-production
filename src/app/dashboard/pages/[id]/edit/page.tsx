'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

interface EditPageProps {
  params: {
    id: string;
  };
}

export default function EditPage({ params }: EditPageProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: 'Sample Page',
    slug: 'sample-page',
    category: 'restaurant',
    description: 'Sample description',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // TODO: Update in Firebase
    setTimeout(() => {
      setSaving(false);
      router.push('/dashboard/pages');
    }, 1000);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this page?')) {
      // TODO: Delete from Firebase
      router.push('/dashboard/pages');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Page</h1>
          <p className="text-gray-600 mt-2">Update your landing page content</p>
        </div>
        <Button
          variant="outline"
          leftIcon={<Trash2 className="h-4 w-4" />}
          onClick={handleDelete}
          className="text-red-600 hover:bg-red-50"
        >
          Delete
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
          
          <div className="space-y-4">
            <Input
              label="Page Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />

            <Input
              label="URL Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              helperText="kashpages.com/sample-page"
              required
            />

            <Select
              label="Category"
              options={[
                { value: 'restaurant', label: 'Restaurant' },
                { value: 'retail', label: 'Retail' },
                { value: 'services', label: 'Services' },
                { value: 'hospitality', label: 'Hospitality' },
              ]}
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={4}
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
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
}