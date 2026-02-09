'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Star } from 'lucide-react';

interface LocationPageProps {
  params: {
    slug: string;
  };
}

export default function LocationPage({ params }: LocationPageProps) {
  const location = params.slug;
  const locationName = location.charAt(0).toUpperCase() + location.slice(1);

  const pages = [
    {
      id: '1',
      title: 'Local Business 1',
      category: 'Restaurant',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      rating: 4.8,
      description: 'Great local business',
    },
    {
      id: '2',
      title: 'Local Business 2',
      category: 'Retail',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
      rating: 4.6,
      description: 'Another great local business',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Link href="/explore" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Explore
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{locationName}</h1>
          <p className="text-gray-600">Discover businesses in {locationName}</p>
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
                  {locationName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}