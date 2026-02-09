'use client';

import React from 'react';
import Link from 'next/link';
import { Search, TrendingUp, MapPin, Briefcase, ShoppingBag, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HomePage() {
  const categories = [
    { id: 'restaurant', name: 'Restaurants', icon: '🍽️', count: 245 },
    { id: 'retail', name: 'Retail Shops', icon: '🛍️', count: 189 },
    { id: 'services', name: 'Services', icon: '⚙️', count: 312 },
    { id: 'healthcare', name: 'Healthcare', icon: '🏥', count: 156 },
    { id: 'education', name: 'Education', icon: '📚', count: 98 },
    { id: 'hospitality', name: 'Hospitality', icon: '🏨', count: 134 },
  ];

  const locations = [
    { id: 'srinagar', name: 'Srinagar', count: 487 },
    { id: 'jammu', name: 'Jammu', count: 356 },
    { id: 'anantnag', name: 'Anantnag', count: 142 },
    { id: 'baramulla', name: 'Baramulla', count: 98 },
    { id: 'pulwama', name: 'Pulwama', count: 76 },
    { id: 'shopian', name: 'Shopian', count: 54 },
  ];

  const featuredPages = [
    {
      id: '1',
      title: 'Ahdoos Restaurant',
      category: 'Restaurant',
      location: 'Srinagar',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      verified: true,
    },
    {
      id: '2',
      title: 'Kashmir Handicrafts',
      category: 'Retail',
      location: 'Srinagar',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      verified: true,
    },
    {
      id: '3',
      title: 'Valley Motors',
      category: 'Services',
      location: 'Jammu',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
      verified: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Discover Kashmir's
              <br />
              Local Businesses
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Create beautiful landing pages for your business in minutes
            </p>

            {/* Search Bar */}
            <div className="bg-white rounded-lg p-2 shadow-xl flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4">
                <Search className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search businesses..."
                  className="flex-1 py-3 text-gray-900 placeholder-gray-500 focus:outline-none"
                />
              </div>
              <Button size="lg">Search</Button>
            </div>

            <div className="mt-8 flex items-center justify-center space-x-6 text-sm">
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-2" />
                <span>1,200+ Businesses</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                <span>All Kashmir Districts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-gray-600">Find businesses in your industry</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/category/${category.id}`}
                className="bg-white p-6 rounded-lg border-2 border-gray-200 hover:border-primary-500 hover:shadow-md transition-all text-center group"
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-500">{category.count} pages</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pages */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Featured Businesses
              </h2>
              <p className="text-gray-600">Top-rated pages from across Kashmir</p>
            </div>
            <Link href="/explore">
              <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                View All
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredPages.map((page) => (
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
                    {page.verified && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        Verified
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600">
                    {page.title}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {page.location}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore by Location
            </h2>
            <p className="text-gray-600">Find businesses in your area</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {locations.map((location) => (
              <Link
                key={location.id}
                href={`/location/${location.id}`}
                className="bg-white p-4 rounded-lg border border-gray-200 hover:border-primary-500 hover:shadow-md transition-all text-center"
              >
                <MapPin className="h-6 w-6 text-primary-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">
                  {location.name}
                </h3>
                <p className="text-sm text-gray-500">{location.count} pages</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Create Your Business Page?
          </h2>
          <p className="text-xl mb-8 text-white/90">
            Join 1,200+ businesses showcasing their services on KashPages
          </p>
          <Link href="/dashboard">
            <Button size="lg" variant="secondary">
              Get Started for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}