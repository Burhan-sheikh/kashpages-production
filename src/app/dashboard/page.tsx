'use client';

import { useAuth } from '@/lib/auth/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { PagesService } from '@/services/pages.service';
import { PageDocument } from '@/types/platform';
import { Plus, FileText, Eye, Clock, CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, userDoc, loading, isGuest } = useAuth();
  const router = useRouter();
  const [pages, setPages] = useState<PageDocument[]>([]);
  const [loadingPages, setLoadingPages] = useState(true);

  useEffect(() => {
    if (!loading && isGuest) {
      router.push('/auth/signin');
    }
  }, [loading, isGuest, router]);

  useEffect(() => {
    if (user) {
      loadUserPages();
    }
  }, [user]);

  const loadUserPages = async () => {
    if (!user) return;
    
    try {
      setLoadingPages(true);
      const userPages = await PagesService.getUserPages(user.uid);
      setPages(userPages);
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoadingPages(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const draftPages = pages.filter(p => p.status === 'draft');
  const submittedPages = pages.filter(p => p.status === 'submitted' || p.status === 'under_review');
  const publishedPages = pages.filter(p => p.status === 'published');
  const rejectedPages = pages.filter(p => p.status === 'rejected');

  const stats = [
    {
      label: 'Total Pages',
      value: pages.length,
      icon: FileText,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Published',
      value: publishedPages.length,
      icon: CheckCircle2,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Under Review',
      value: submittedPages.length,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50',
    },
    {
      label: 'Total Views',
      value: userDoc?.stats.totalViews || 0,
      icon: Eye,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userDoc?.displayName}!
              </h1>
              <p className="text-gray-600 mt-1">Manage your business pages</p>
            </div>
            <Link
              href="/dashboard/pages/new"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg shadow-blue-600/25"
            >
              <Plus className="w-5 h-5" />
              Create New Page
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Pages List */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Your Pages</h2>
          </div>

          {loadingPages ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading your pages...</p>
            </div>
          ) : pages.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No pages yet</h3>
              <p className="text-gray-600 mb-6">Create your first business page to get started</p>
              <Link
                href="/dashboard/pages/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5" />
                Create Your First Page
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pages.map((page) => {
                const statusConfig = {
                  draft: { label: 'Draft', class: 'bg-gray-100 text-gray-700', icon: Clock },
                  submitted: { label: 'Submitted', class: 'bg-yellow-100 text-yellow-700', icon: Clock },
                  under_review: { label: 'Under Review', class: 'bg-yellow-100 text-yellow-700', icon: Clock },
                  published: { label: 'Published', class: 'bg-green-100 text-green-700', icon: CheckCircle2 },
                  rejected: { label: 'Rejected', class: 'bg-red-100 text-red-700', icon: XCircle },
                  unpublished: { label: 'Unpublished', class: 'bg-gray-100 text-gray-700', icon: XCircle },
                };

                const status = statusConfig[page.status];
                const StatusIcon = status.icon;

                return (
                  <Link
                    key={page.id}
                    href={`/dashboard/pages/${page.id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{page.title}</h3>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${status.class}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            {status.label}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{page.description || 'No description'}</p>
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span className="flex items-center gap-1.5">
                            <Eye className="w-4 h-4" />
                            {page.views} views
                          </span>
                          <span>{page.category}</span>
                          <span>Updated {new Date(page.updatedAt.toDate()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
