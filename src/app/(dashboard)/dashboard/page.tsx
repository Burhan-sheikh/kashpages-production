'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit, Eye, Trash2, BarChart, Settings, Globe } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const [pages, setPages] = useState([
    {
      id: '1',
      title: 'My Restaurant',
      slug: 'my-restaurant',
      status: 'published',
      views: 1245,
      lastUpdated: '2026-02-08',
      thumbnail: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=200',
    },
    {
      id: '2',
      title: 'Retail Store',
      slug: 'retail-store',
      status: 'draft',
      views: 0,
      lastUpdated: '2026-02-07',
      thumbnail: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200',
    },
  ]);

  const stats = [
    { label: 'Total Pages', value: '2', icon: Globe },
    { label: 'Total Views', value: '1,245', icon: Eye },
    { label: 'Published', value: '1', icon: Globe },
    { label: 'Drafts', value: '1', icon: Edit },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
            <p className="text-gray-600">Manage your business pages</p>
          </div>
          <Link href="/dashboard/pages/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>Create New Page</Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            );
          })}
        </div>

        {/* Pages List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Your Pages</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {pages.map((page) => (
              <div key={page.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <img
                    src={page.thumbnail}
                    alt={page.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{page.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          page.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {page.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      kashpages.com/{page.slug}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>{page.views} views</span>
                      <span>•</span>
                      <span>Updated {page.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/dashboard/pages/${page.id}/analytics`}>
                      <Button
                        size="sm"
                        variant="ghost"
                        leftIcon={<BarChart className="h-4 w-4" />}
                      >
                        Analytics
                      </Button>
                    </Link>
                    <Link href={`/dashboard/pages/${page.id}/edit`}>
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Edit className="h-4 w-4" />}
                      >
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/${page.slug}`} target="_blank">
                      <Button
                        size="sm"
                        variant="outline"
                        leftIcon={<Eye className="h-4 w-4" />}
                      >
                        View
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<Trash2 className="h-4 w-4" />}
                      onClick={() => {
                        if (confirm('Delete this page?')) {
                          setPages(pages.filter((p) => p.id !== page.id));
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}