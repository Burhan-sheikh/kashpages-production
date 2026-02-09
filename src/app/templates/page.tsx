'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Crown } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function TemplatesPage() {
  const [filter, setFilter] = useState<string>('all');

  const templates = [
    {
      id: '1',
      name: 'Restaurant Pro',
      category: 'Restaurant',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      isPremium: true,
      features: ['Menu Builder', 'Online Booking', 'Gallery', 'Reviews'],
    },
    {
      id: '2',
      name: 'Retail Showcase',
      category: 'Retail',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      isPremium: false,
      features: ['Product Catalog', 'Contact Form', 'Location Map'],
    },
    {
      id: '3',
      name: 'Service Provider',
      category: 'Services',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400',
      isPremium: true,
      features: ['Service List', 'Pricing Table', 'Testimonials', 'FAQ'],
    },
    {
      id: '4',
      name: 'Hotel Luxury',
      category: 'Hospitality',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
      isPremium: true,
      features: ['Room Gallery', 'Booking System', 'Amenities', 'Contact'],
    },
    {
      id: '5',
      name: 'Cafe Modern',
      category: 'Restaurant',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400',
      isPremium: false,
      features: ['Menu Display', 'Location', 'Social Links'],
    },
    {
      id: '6',
      name: 'Artisan Crafts',
      category: 'Retail',
      image: 'https://images.unsplash.com/photo-1582992348-8e2f18c7058f?w=400',
      isPremium: false,
      features: ['Product Grid', 'About Us', 'Contact Form'],
    },
  ];

  const categories = ['all', 'Restaurant', 'Retail', 'Services', 'Hospitality'];

  const filteredTemplates =
    filter === 'all'
      ? templates
      : templates.filter((t) => t.category === filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Professional Templates
          </h1>
          <p className="text-gray-600">
            Choose from our collection of beautiful, ready-to-use templates
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setFilter(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {category === 'all' ? 'All Templates' : category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={template.image}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                {template.isPremium && (
                  <div className="absolute top-3 right-3 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-primary-600 font-medium">
                    {template.category}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-primary-600">
                  {template.name}
                </h3>
                <ul className="space-y-1 mb-4">
                  {template.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center">
                      <Sparkles className="h-3 w-3 mr-2 text-primary-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href={`/dashboard/pages/new?template=${template.id}`}>
                  <Button variant="primary" size="sm" fullWidth>
                    Use Template
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}