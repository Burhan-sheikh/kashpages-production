'use client';

import { useAuth } from './AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { UserRole } from '@/lib/firebase/collections';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackPath?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallbackPath = '/auth/signin',
}: ProtectedRouteProps) {
  const { user, userDoc, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // Not authenticated
      if (!user) {
        router.push(fallbackPath);
        return;
      }

      // Check role requirement
      if (requiredRole && userDoc?.role !== requiredRole) {
        // Redirect based on current role
        if (userDoc?.role === UserRole.ADMIN) {
          router.push('/admin/dashboard');
        } else if (userDoc?.role === UserRole.USER) {
          router.push('/dashboard');
        } else {
          router.push('/');
        }
      }

      // Check if user is active
      if (userDoc && !userDoc.isActive) {
        router.push('/account-suspended');
      }
    }
  }, [user, userDoc, loading, requiredRole, router, fallbackPath]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Not authenticated or wrong role
  if (!user || (requiredRole && userDoc?.role !== requiredRole)) {
    return null;
  }

  // Render children
  return <>{children}</>;
}
