'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Grid, List, MapPin, Star } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export default function ExplorePage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const pages = [
    {
      id: '1',
      title: 'Ahdoos Restaurant',
      category: 'Restaurant',
      location: 'Srinagar',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      verified: true,
      rating: 4.8,
      description: 'Traditional Kashmiri cuisine in the heart of Srinagar',
    },
    {
      id: '2',
      title: 'Kashmir Handicrafts',
      category: 'Retail',
      location: 'Srinagar',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      verified: true,
      rating: 4.6,
      description: 'Authentic Kashmiri handicrafts and carpets',
    },
    {
      id: '3',
      title: 'Valley Motors',
      category: 'Services',
      location: 'Jammu',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
      verified: false,
      rating: 4.3,
      description: 'Premium car service and maintenance',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Explore Businesses</h1>
          <p className="text-gray-600">Discover local businesses across Kashmir</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search by name or keyword..."
                leftIcon={<Search className="h-4 w-4" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select
              options={[
                { value: 'all', label: 'All Categories' },
                { value: 'restaurant', label: 'Restaurants' },
                { value: 'retail', label: 'Retail' },
                { value: 'services', label: 'Services' },
              ]}
            />
            <Select
              options={[
                { value: 'all', label: 'All Locations' },
                { value: 'srinagar', label: 'Srinagar' },
                { value: 'jammu', label: 'Jammu' },
                { value: 'anantnag', label: 'Anantnag' },
              ]}
            />
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">1,200</span> results
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${
                  viewMode === 'grid'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Grid className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-primary-100 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <List className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-3 gap-6">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/${page.id}`}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={page.image}
                    alt={page.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-primary-600 font-medium">
                      {page.category}
                    </span>
                    <div className="flex items-center text-sm">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="font-semibold">{page.rating}</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600">
                    {page.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">{page.description}</p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {page.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/${page.id}`}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow group flex items-center space-x-6"
              >
                <div className="w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                  <img
                    src={page.image}
                    alt={page.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm text-primary-600 font-medium">
                      {page.category}
                    </span>
                    {page.verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                    {page.title}
                  </h3>
                  <p className="text-gray-600 mb-3">{page.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-gray-500">
                      <MapPin className="h-4 w-4 mr-1" />
                      {page.location}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                      <span className="font-semibold">{page.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}