'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS, PageDocument } from '@/lib/firebase/collections';
import { Search, Filter, Eye, TrendingUp, Clock, Grid, List } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

export default function ExplorePage() {
  const [pages, setPages] = useState<PageDocument[]>([]);
  const [filteredPages, setFilteredPages] = useState<PageDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular'>('recent');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetchPages();
  }, [sortBy]);

  useEffect(() => {
    filterPages();
  }, [pages, searchQuery, categoryFilter]);

  const fetchPages = async () => {
    try {
      let pagesQuery = query(
        collection(db, COLLECTIONS.PAGES),
        where('isPublished', '==', true),
        limit(50)
      );

      if (sortBy === 'recent') {
        pagesQuery = query(pagesQuery, orderBy('publishedAt', 'desc'));
      } else {
        pagesQuery = query(pagesQuery, orderBy('views', 'desc'));
      }

      const snapshot = await getDocs(pagesQuery);
      const pagesData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PageDocument[];

      setPages(pagesData);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPages = () => {
    let filtered = pages;

    if (searchQuery) {
      filtered = filtered.filter(
        (page) =>
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((page) => page.category === categoryFilter);
    }

    setFilteredPages(filtered);
  };

  const categories = ['all', 'restaurant', 'retail', 'services', 'portfolio', 'event'];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Explore Amazing Pages
            </h1>
            <p className="text-xl text-primary-100 mb-8">
              Discover landing pages created by the Kashmir community
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pages by title, description, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Filters and Sort */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 space-y-4 md:space-y-0">
            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    categoryFilter === category
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Sort and View Options */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="recent">Most Recent</option>
                <option value="popular">Most Popular</option>
              </select>

              <div className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${
                    viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${
                    viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Pages Grid/List */}
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading pages...</p>
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No pages found
              </h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${page.slug}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
                >
                  {page.thumbnail ? (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={page.thumbnail}
                        alt={page.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary-100 to-purple-100" />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {page.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {page.description}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {formatNumber(page.views)} views
                      </div>
                      {page.category && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {page.category}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${page.slug}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow flex items-center space-x-4"
                >
                  {page.thumbnail ? (
                    <img
                      src={page.thumbnail}
                      alt={page.title}
                      className="w-32 h-20 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-32 h-20 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-1">{page.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-1">{page.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {formatNumber(page.views)}
                      </div>
                      {page.category && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                          {page.category}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
