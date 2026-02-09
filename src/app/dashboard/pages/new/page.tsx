'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, Eye, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import {
  checkSlugAvailability,
  generateSlugFromTitle,
  suggestAlternativeSlugs,
} from '@/lib/utils/slugValidator';

export default function NewPagePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [slugStatus, setSlugStatus] = useState<{
    available: boolean | null;
    message: string;
  }>({ available: null, message: '' });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    category: '',
    description: '',
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !formData.slug) {
      const generatedSlug = generateSlugFromTitle(formData.title);
      setFormData((prev) => ({ ...prev, slug: generatedSlug }));
    }
  }, [formData.title]);

  // Check slug availability with debounce
  useEffect(() => {
    if (!formData.slug || formData.slug.length < 3) {
      setSlugStatus({ available: null, message: '' });
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setCheckingSlug(true);
      const result = await checkSlugAvailability(formData.slug);
      setSlugStatus(result);
      setCheckingSlug(false);

      // If slug is taken, suggest alternatives
      if (!result.available) {
        const alternatives = await suggestAlternativeSlugs(formData.slug);
        setSuggestions(alternatives);
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate slug is available
    if (!slugStatus.available) {
      alert('Please choose an available slug before saving.');
      return;
    }

    setSaving(true);
    // TODO: Save to Firebase
    setTimeout(() => {
      setSaving(false);
      router.push('/dashboard/pages');
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setFormData({ ...formData, slug: suggestion });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Page</h1>
        <p className="text-gray-600 mt-2">
          Build your landing page from scratch or use a template
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h2>

          <div className="space-y-4">
            <div>
              <Input
                label="Page Title"
                placeholder="My Business Name"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <div className="relative">
                <Input
                  label="URL Slug"
                  placeholder="my-business"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  helperText="This will be your page URL: kashpages.com/my-business"
                  required
                  rightIcon={
                    checkingSlug ? (
                      <Loader className="h-4 w-4 animate-spin text-gray-400" />
                    ) : slugStatus.available === true ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : slugStatus.available === false ? (
                      <XCircle className="h-4 w-4 text-red-500" />
                    ) : null
                  }
                />
              </div>

              {/* Slug Status Message */}
              {slugStatus.message && (
                <div
                  className={`mt-2 text-sm flex items-center ${
                    slugStatus.available ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {slugStatus.available ? (
                    <CheckCircle className="h-4 w-4 mr-1" />
                  ) : (
                    <XCircle className="h-4 w-4 mr-1" />
                  )}
                  {slugStatus.message}
                </div>
              )}

              {/* Alternative Suggestions */}
              {suggestions.length > 0 && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm font-medium text-yellow-800 mb-2">
                    Try these available alternatives:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="px-3 py-1 bg-white border border-yellow-300 text-sm text-yellow-800 rounded hover:bg-yellow-100 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
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
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
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
            disabled={!slugStatus.available || checkingSlug}
          >
            Save as Draft
          </Button>
        </div>
      </form>
    </div>
  );
}
