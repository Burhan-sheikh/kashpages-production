'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { UserRole } from '@/lib/firebase/collections';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Users, FileText, CheckCircle, TrendingUp, Eye, Clock } from 'lucide-react';
import { formatNumber } from '@/lib/utils';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPages: 0,
    publishedPages: 0,
    pendingApprovals: 0,
    totalViews: 0,
    draftPages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Fetch users count
      const usersSnap = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnap.size;

      // Fetch pages stats
      const pagesSnap = await getDocs(collection(db, 'pages'));
      const allPages = pagesSnap.docs.map((doc) => doc.data());
      
      const publishedPages = allPages.filter((p: any) => p.isPublished).length;
      const draftPages = allPages.filter((p: any) => p.status === 'draft').length;
      const totalViews = allPages.reduce((sum: number, p: any) => sum + (p.views || 0), 0);

      // Fetch pending approvals
      const approvalsSnap = await getDocs(
        query(collection(db, 'pendingApprovals'), where('status', '==', 'pending'))
      );

      setStats({
        totalUsers,
        totalPages: allPages.length,
        publishedPages,
        pendingApprovals: approvalsSnap.size,
        totalViews,
        draftPages,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'Total Users',
      value: stats.totalUsers,
      icon: Users,
      color: 'bg-blue-500',
      link: '/admin/users',
    },
    {
      name: 'Total Pages',
      value: stats.totalPages,
      icon: FileText,
      color: 'bg-purple-500',
      link: '/admin/pages',
    },
    {
      name: 'Published Pages',
      value: stats.publishedPages,
      icon: TrendingUp,
      color: 'bg-green-500',
      link: '/admin/pages',
    },
    {
      name: 'Pending Approvals',
      value: stats.pendingApprovals,
      icon: Clock,
      color: 'bg-yellow-500',
      link: '/admin/approvals',
    },
    {
      name: 'Total Views',
      value: formatNumber(stats.totalViews),
      icon: Eye,
      color: 'bg-indigo-500',
      link: '/admin/analytics',
    },
    {
      name: 'Draft Pages',
      value: stats.draftPages,
      icon: FileText,
      color: 'bg-gray-500',
      link: '/admin/pages',
    },
  ];

  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <DashboardLayout userRole="admin">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Overview of platform activity and statistics
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <Link
                  key={stat.name}
                  href={stat.link}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
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
                </Link>
              );
            })}
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/admin/approvals"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all text-center"
            >
              <CheckCircle className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Review Approvals</h3>
              <p className="text-sm text-gray-500 mt-1">{stats.pendingApprovals} pending</p>
            </Link>
            <Link
              href="/admin/users"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all text-center"
            >
              <Users className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">Manage Users</h3>
              <p className="text-sm text-gray-500 mt-1">{stats.totalUsers} total users</p>
            </Link>
            <Link
              href="/admin/audit-logs"
              className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition-all text-center"
            >
              <FileText className="h-8 w-8 text-primary-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900">View Audit Logs</h3>
              <p className="text-sm text-gray-500 mt-1">Security & activity</p>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
