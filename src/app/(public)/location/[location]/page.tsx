'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { MapPin, Star, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function LocationPage() {
  const params = useParams();
  const location = params.location as string;

  const locationName = location.charAt(0).toUpperCase() + location.slice(1);

  const pages = [
    {
      id: '1',
      title: 'Ahdoos Restaurant',
      category: 'Restaurant',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400',
      rating: 4.8,
      verified: true,
    },
    {
      id: '2',
      title: 'Kashmir Handicrafts',
      category: 'Retail',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
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
            <MapPin className="h-12 w-12 text-primary-600" />
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{locationName}</h1>
              <p className="text-gray-600 text-lg">Businesses in {locationName}</p>
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
                {page.verified && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded inline-block">
                    Verified
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}