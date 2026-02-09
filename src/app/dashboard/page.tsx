'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS, PageDocument } from '@/lib/firebase/collections';
import { FileText, Eye, TrendingUp, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/utils';
import Link from 'next/link';

export default function DashboardPage() {
  const { userDoc } = useAuth();
  const [pages, setPages] = useState<PageDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userDoc) {
      fetchUserPages();
    }
  }, [userDoc]);

  const fetchUserPages = async () => {
    if (!userDoc) return;

    try {
      const pagesQuery = query(
        collection(db, COLLECTIONS.PAGES),
        where('userId', '==', userDoc.uid),
        orderBy('updatedAt', 'desc')
      );

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

  const stats = [
    {
      name: 'Total Pages',
      value: userDoc?.stats.totalPages || 0,
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      name: 'Published',
      value: userDoc?.stats.publishedPages || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
    },
    {
      name: 'Total Views',
      value: formatNumber(userDoc?.stats.totalViews || 0),
      icon: Eye,
      color: 'bg-purple-500',
    },
    {
      name: 'Draft Pages',
      value: (userDoc?.stats.totalPages || 0) - (userDoc?.stats.publishedPages || 0),
      icon: Clock,
      color: 'bg-yellow-500',
    },
  ];

  return (
    <ProtectedRoute>
      <DashboardLayout userRole="user">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {userDoc?.displayName}! 👋
          </h1>
          <p className="mt-2 text-gray-600">
            Here's an overview of your landing pages
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Pages */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Pages</h2>
            <Link href="/dashboard/pages/new">
              <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                Create Page
              </Button>
            </Link>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading pages...</p>
              </div>
            ) : pages.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No pages yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Create your first landing page to get started
                </p>
                <Link href="/dashboard/pages/new">
                  <Button leftIcon={<Plus className="h-4 w-4" />}>
                    Create Your First Page
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {pages.slice(0, 5).map((page) => (
                  <Link
                    key={page.id}
                    href={`/dashboard/pages/${page.id}`}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-all"
                  >
                    <div className="flex items-center space-x-4">
                      {page.thumbnail ? (
                        <img
                          src={page.thumbnail}
                          alt={page.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                          <FileText className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-medium text-gray-900">{page.title}</h3>
                        <p className="text-sm text-gray-500">
                          {page.status.replace('_', ' ').toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {formatNumber(page.views)}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        page.isPublished
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {page.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </Link>
                ))}

                {pages.length > 5 && (
                  <div className="text-center pt-4">
                    <Link
                      href="/dashboard/pages"
                      className="text-sm font-medium text-primary-600 hover:text-primary-700"
                    >
                      View all pages →
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
