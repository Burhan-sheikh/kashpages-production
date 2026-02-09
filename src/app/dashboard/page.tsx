'use client';

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/auth/AuthContext';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { COLLECTIONS, PageDocument } from '@/lib/firebase/collections';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  Plus,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  FileText,
  Clock,
  CheckCircle,
} from 'lucide-react';
import Link from 'next/link';

function DashboardContent() {
  const { user, userDoc } = useAuth();
  const [pages, setPages] = useState<PageDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    pending: 0,
    totalViews: 0,
  });

  useEffect(() => {
    if (user) {
      fetchPages();
    }
  }, [user]);

  const fetchPages = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, COLLECTIONS.PAGES),
        where('userId', '==', user?.uid),
        orderBy('updatedAt', 'desc')
      );

      const querySnapshot = await getDocs(q);
      const pagesData = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as PageDocument)
      );

      setPages(pagesData);

      // Calculate stats
      const stats = pagesData.reduce(
        (acc, page) => {
          acc.total++;
          if (page.status === 'published') acc.published++;
          if (page.status === 'draft') acc.draft++;
          if (page.status === 'pending_approval') acc.pending++;
          acc.totalViews += page.views || 0;
          return acc;
        },
        { total: 0, published: 0, draft: 0, pending: 0, totalViews: 0 }
      );

      setStats(stats);
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Published</Badge>;
      case 'draft':
        return <Badge variant="gray">Draft</Badge>;
      case 'pending_approval':
        return <Badge variant="warning">Pending Review</Badge>;
      case 'archived':
        return <Badge variant="danger">Archived</Badge>;
      default:
        return <Badge variant="gray">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Pages</h1>
            <p className="text-gray-600 mt-1">Manage your landing pages</p>
          </div>
          <Link href="/dashboard/pages/new">
            <Button leftIcon={<Plus className="h-5 w-5" />}>
              Create new page
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-primary-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold text-green-600">{stats.published}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold text-gray-600">{stats.draft}</p>
              </div>
              <Edit className="h-8 w-8 text-gray-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-primary-600">{stats.totalViews}</p>
              </div>
              <Eye className="h-8 w-8 text-primary-600" />
            </div>
          </Card>
        </div>

        {/* Pages List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : pages.length > 0 ? (
          <div className="space-y-4">
            {pages.map((page) => (
              <Card key={page.id} hover>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    {/* Thumbnail */}
                    {page.thumbnail ? (
                      <img
                        src={page.thumbnail}
                        alt={page.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary-600" />
                      </div>
                    )}

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {page.title}
                        </h3>
                        {getStatusBadge(page.status)}
                      </div>
                      <p className="text-sm text-gray-600 truncate">{page.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {page.views || 0} views
                        </span>
                        <span>
                          Updated {new Date(page.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Link href={`/dashboard/pages/${page.id}/edit`}>
                      <Button size="sm" variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    {page.isPublished && (
                      <Link href={`/p/${page.slug}`} target="_blank">
                        <Button size="sm" variant="ghost">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-20">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No pages yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first landing page to get started
            </p>
            <Link href="/dashboard/pages/new">
              <Button leftIcon={<Plus className="h-5 w-5" />}>
                Create your first page
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
