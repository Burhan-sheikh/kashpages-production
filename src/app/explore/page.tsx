'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS, PageDocument, PageStatus } from '@/lib/firebase/collections';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Search, Eye, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ExplorePage() {
  const [pages, setPages] = useState<PageDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'restaurant', label: 'Restaurants' },
    { value: 'shop', label: 'Shops' },
    { value: 'service', label: 'Services' },
    { value: 'portfolio', label: 'Portfolio' },
    { value: 'event', label: 'Events' },
  ];

  useEffect(() => {
    fetchPages();
  }, [category]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      let q = query(
        collection(db, COLLECTIONS.PAGES),
        where('status', '==', PageStatus.PUBLISHED),
        where('isPublished', '==', true),
        orderBy('publishedAt', 'desc'),
        limit(50)
      );

      if (category !== 'all') {
        q = query(q, where('category', '==', category));
      }

      const querySnapshot = await getDocs(q);
      const pagesData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as PageDocument)
      );
      setPages(pagesData);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPages = pages.filter((page) =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Landing Pages
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover beautiful landing pages created by businesses in Kashmir
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-5 w-5" />}
            />
          </div>
          <div className="w-full md:w-64">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categories}
            />
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : filteredPages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((page) => (
              <Link key={page.id} href={`/p/${page.slug}`}>
                <Card hover className="h-full">
                  {/* Thumbnail */}
                  {page.thumbnail ? (
                    <img
                      src={page.thumbnail}
                      alt={page.title}
                      className="w-full h-48 object-cover rounded-t-xl"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-purple-100 rounded-t-xl flex items-center justify-center">
                      <p className="text-primary-600 font-semibold">No Image</p>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="primary">{page.category}</Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        {page.views || 0}
                      </div>
                    </div>

                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {page.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                      {page.description}
                    </p>

                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1" />
                      {page.publishedAt
                        ? new Date(page.publishedAt).toLocaleDateString()
                        : 'N/A'}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-gray-600">No pages found</p>
          </div>
        )}
      </div>
    </div>
  );
}
