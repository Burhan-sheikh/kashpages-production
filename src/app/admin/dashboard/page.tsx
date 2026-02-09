'use client';

import { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/auth/AuthContext';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { UserRole, COLLECTIONS } from '@/lib/firebase/collections';
import { Card } from '@/components/ui/Card';
import {
  Users,
  FileText,
  Clock,
  Eye,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

function AdminDashboardContent() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPages: 0,
    publishedPages: 0,
    pendingApprovals: 0,
    totalViews: 0,
    recentUsers: [] as any[],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);

      // Fetch users
      const usersSnapshot = await getDocs(collection(db, COLLECTIONS.USERS));
      const totalUsers = usersSnapshot.size;

      // Fetch pages
      const pagesSnapshot = await getDocs(collection(db, COLLECTIONS.PAGES));
      const pages = pagesSnapshot.docs.map((doc) => doc.data());
      const publishedPages = pages.filter((p) => p.status === 'published').length;
      const totalViews = pages.reduce((sum, p) => sum + (p.views || 0), 0);

      // Fetch pending approvals
      const approvalsQuery = query(
        collection(db, COLLECTIONS.PENDING_APPROVALS),
        where('status', '==', 'pending')
      );
      const approvalsSnapshot = await getDocs(approvalsQuery);
      const pendingApprovals = approvalsSnapshot.size;

      // Get recent users
      const recentUsers = usersSnapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a: any, b: any) => b.createdAt - a.createdAt)
        .slice(0, 5);

      setStats({
        totalUsers,
        totalPages: pagesSnapshot.size,
        publishedPages,
        pendingApprovals,
        totalViews,
        recentUsers,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Overview of platform activity</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-12 w-12 text-primary-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Pages</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalPages}</p>
              </div>
              <FileText className="h-12 w-12 text-blue-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published Pages</p>
                <p className="text-3xl font-bold text-green-600">{stats.publishedPages}</p>
              </div>
              <Eye className="h-12 w-12 text-green-600" />
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {stats.pendingApprovals}
                </p>
              </div>
              <Clock className="h-12 w-12 text-yellow-600" />
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="space-y-3">
              <Link href="/admin/approvals">
                <Button variant="outline" fullWidth className="justify-start">
                  <Clock className="h-5 w-5 mr-3" />
                  Review Pending Approvals ({stats.pendingApprovals})
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="outline" fullWidth className="justify-start">
                  <Users className="h-5 w-5 mr-3" />
                  Manage Users
                </Button>
              </Link>
              <Link href="/admin/pages">
                <Button variant="outline" fullWidth className="justify-start">
                  <FileText className="h-5 w-5 mr-3" />
                  View All Pages
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="outline" fullWidth className="justify-start">
                  <TrendingUp className="h-5 w-5 mr-3" />
                  Analytics Dashboard
                </Button>
              </Link>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Users</h2>
            </div>
            <div className="space-y-3">
              {stats.recentUsers.map((user: any) => (
                <div key={user.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.displayName?.[0] || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.displayName || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {user.createdAt?.toDate?.()?.toLocaleDateString() || 'N/A'}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Alerts */}
        {stats.pendingApprovals > 0 && (
          <Card className="bg-yellow-50 border-yellow-200">
            <div className="flex items-start">
              <AlertCircle className="h-6 w-6 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-yellow-900">
                  {stats.pendingApprovals} page{stats.pendingApprovals !== 1 && 's'} awaiting approval
                </h3>
                <p className="text-yellow-700 mt-1">
                  There are pending page submissions that need your review.
                </p>
                <Link href="/admin/approvals">
                  <Button variant="outline" size="sm" className="mt-3">
                    Review now
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <AdminDashboardContent />
    </ProtectedRoute>
  );
}
