'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { COLLECTIONS, PageDocument, PageStatus } from '@/lib/firebase/collections';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate, formatNumber } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MyPagesPage() {
  const { userDoc } = useAuth();
  const router = useRouter();
  const [pages, setPages] = useState<PageDocument[]>([]);
  const [filteredPages, setFilteredPages] = useState<PageDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | PageStatus>('all');
  const [showMenu, setShowMenu] = useState<string | null>(null);

  useEffect(() => {
    if (userDoc) {
      fetchUserPages();
    }
  }, [userDoc]);

  useEffect(() => {
    filterPages();
  }, [pages, searchQuery, statusFilter]);

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

  const filterPages = () => {
    let filtered = pages;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (page) =>
          page.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          page.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((page) => page.status === statusFilter);
    }

    setFilteredPages(filtered);
  };

  const handleDelete = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      await deleteDoc(doc(db, COLLECTIONS.PAGES, pageId));
      setPages(pages.filter((p) => p.id !== pageId));
    } catch (error) {
      console.error('Error deleting page:', error);
      alert('Failed to delete page');
    }
  };

  const getStatusBadge = (page: PageDocument) => {
    if (page.isPublished) {
      return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Published</span>;
    }
    if (page.status === PageStatus.PENDING_APPROVAL) {
      return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">Pending Review</span>;
    }
    return <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded-full">Draft</span>;
  };

  return (
    <ProtectedRoute>
      <DashboardLayout userRole="user">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Pages</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and track all your landing pages
            </p>
          </div>
          <Link href="/dashboard/pages/new">
            <Button leftIcon={<Plus className="h-4 w-4" />}>
              Create New Page
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search pages..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value={PageStatus.DRAFT}>Draft</option>
                <option value={PageStatus.PENDING_APPROVAL}>Pending Review</option>
                <option value={PageStatus.PUBLISHED}>Published</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pages Grid */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading pages...</p>
            </div>
          ) : filteredPages.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery || statusFilter !== 'all' ? 'No pages found' : 'No pages yet'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters'
                  : 'Create your first landing page to get started'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <Link href="/dashboard/pages/new">
                  <Button leftIcon={<Plus className="h-4 w-4" />}>
                    Create Your First Page
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Views
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPages.map((page) => (
                    <tr key={page.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {page.thumbnail ? (
                            <img
                              src={page.thumbnail}
                              alt={page.title}
                              className="w-12 h-12 object-cover rounded-lg mr-3"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center mr-3">
                              <FileText className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-gray-900">{page.title}</div>
                            <div className="text-sm text-gray-500">/{page.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(page)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="flex items-center">
                          <Eye className="h-4 w-4 mr-1 text-gray-400" />
                          {formatNumber(page.views)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(page.updatedAt)}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          {page.isPublished && (
                            <a
                              href={`/${page.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <Link
                            href={`/dashboard/pages/${page.id}/edit`}
                            className="text-primary-600 hover:text-primary-900"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(page.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
