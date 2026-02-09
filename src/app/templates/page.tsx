'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS } from '@/lib/firebase/collections';
import { Sparkles, ArrowRight, Search } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/auth/AuthContext';

interface Template {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  category: string;
  isPremium: boolean;
}

export default function TemplatesPage() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const snapshot = await getDocs(collection(db, COLLECTIONS.TEMPLATES));
      const templatesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Template[];
      setTemplates(templatesData);
    } catch (error) {
      console.error('Error fetching templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'restaurant', 'retail', 'services', 'portfolio', 'event'];
  const filteredTemplates = categoryFilter === 'all'
    ? templates
    : templates.filter((t) => t.category === categoryFilter);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <Sparkles className="h-12 w-12 mx-auto mb-4" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Beautiful Templates
              </h1>
              <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
                Choose from professionally designed templates and customize them to match your brand
              </p>
              {!user && (
                <Link href="/auth/signup">
                  <Button size="lg" variant="outline" className="bg-white text-purple-600 hover:bg-purple-50">
                    Sign up to use templates
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Category Filter */}
          <div className="flex items-center space-x-2 overflow-x-auto mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  categoryFilter === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Templates Grid */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading templates...</p>
            </div>
          ) : filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No templates available yet
              </h3>
              <p className="text-gray-500">Check back soon for new templates!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {template.isPremium && (
                      <span className="absolute top-2 right-2 px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">
                        PREMIUM
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {template.description}
                    </p>
                    <Link href={user ? `/dashboard/pages/new?template=${template.id}` : '/auth/signin'}>
                      <Button size="sm" className="w-full" rightIcon={<ArrowRight className="h-4 w-4" />}>
                        {user ? 'Use Template' : 'Sign in to use'}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
