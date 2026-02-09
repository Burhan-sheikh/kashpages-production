'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;

  const categoryInfo = {
    restaurant: { name: 'Restaurants', icon: '🍽️', description: 'Discover the best dining experiences' },
    retail: { name: 'Retail Shops', icon: '🛍️', description: 'Shop from local businesses' },
    services: { name: 'Services', icon: '⚙️', description: 'Professional services you can trust' },
  };

  const info = categoryInfo[category as keyof typeof categoryInfo] || categoryInfo.restaurant;

  const pages = [
    {
      id: '1',
      title: 'Ahdoos Restaurant',
      location: 'Srinagar',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      rating: 4.8,
      verified: true,
    },
    {
      id: '2',
      title: 'Stream Restaurant',
      location: 'Pahalgam',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400',
      rating: 4.6,
      verified: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/">
          <Button variant="ghost" leftIcon={<ArrowLeft className="h-4 w-4" />}>
            Back to Home
          </Button>
        </Link>

        <div className="mt-6 mb-12">
          <div className="flex items-center space-x-4 mb-4">
            <div className="text-5xl">{info.icon}</div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{info.name}</h1>
              <p className="text-gray-600 text-lg">{info.description}</p>
            </div>
          </div>
        </div>

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
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-semibold text-sm">{page.rating}</span>
                  </div>
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
    </div>
  );
}