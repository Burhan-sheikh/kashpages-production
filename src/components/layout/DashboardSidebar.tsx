'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  Image,
  BarChart3,
  Settings,
  Users,
  CheckCircle,
  FileSearch,
  Shield,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  userRole: 'user' | 'admin';
}

export function DashboardSidebar({ userRole }: DashboardSidebarProps) {
  const pathname = usePathname();

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'My Pages', href: '/dashboard/pages', icon: FileText },
    { name: 'Templates', href: '/dashboard/templates', icon: Image },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const adminNavigation = [
    { name: 'Admin Dashboard', href: '/admin/dashboard', icon: Shield },
    { name: 'Pending Approvals', href: '/admin/approvals', icon: CheckCircle },
    { name: 'User Management', href: '/admin/users', icon: Users },
    { name: 'All Pages', href: '/admin/pages', icon: FileText },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileSearch },
    { name: 'Notifications', href: '/admin/notifications', icon: Bell },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const navigation = userRole === 'admin' ? adminNavigation : userNavigation;

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200">
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon
                className={cn(
                  'mr-3 h-5 w-5',
                  isActive ? 'text-primary-600' : 'text-gray-400'
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
