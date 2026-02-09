'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/AuthContext';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  User,
  LogOut,
  LayoutDashboard,
  Settings,
  Plus,
  Search,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import clsx from 'clsx';

export function Header() {
  const { user, userDoc, signOut, isAdmin } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Explore', href: '/explore' },
    { name: 'Templates', href: '/templates' },
    { name: 'Pricing', href: '/pricing' },
  ];

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  if (isAdmin) {
    userNavigation.unshift({ name: 'Admin Panel', href: '/admin/dashboard', icon: User });
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-br from-primary-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <span className="text-xl font-bold text-gray-900">KashPages</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  'text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'text-primary-600'
                    : 'text-gray-700 hover:text-primary-600'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button className="hidden md:flex p-2 text-gray-400 hover:text-gray-600 transition-colors">
              <Search className="h-5 w-5" />
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Create New Button */}
                <Link href="/dashboard/pages/new">
                  <Button size="sm" leftIcon={<Plus className="h-4 w-4" />}>
                    <span className="hidden sm:inline">New Page</span>
                  </Button>
                </Link>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {userDoc?.photoURL ? (
                      <img
                        src={userDoc.photoURL}
                        alt={userDoc.displayName || 'User'}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {userDoc?.displayName?.[0] || 'U'}
                        </span>
                      </div>
                    )}
                  </button>

                  {/* Dropdown Menu */}
                  {profileMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p className="text-sm font-medium text-gray-900">
                          {userDoc?.displayName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{userDoc?.email}</p>
                      </div>

                      {userNavigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <item.icon className="h-4 w-4 mr-3" />
                          {item.name}
                        </Link>
                      ))}

                      <div className="border-t border-gray-200 my-2"></div>

                      <button
                        onClick={() => {
                          signOut();
                          setProfileMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/auth/signin" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm">Get started</Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={clsx(
                    'block px-3 py-2 rounded-md text-base font-medium',
                    pathname === item.href
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
