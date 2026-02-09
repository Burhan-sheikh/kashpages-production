'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import Link from 'next/link';
import { Mail, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-primary-600">KashPages</h1>
          </Link>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        {/* Form */}
        <div className="mt-8 bg-white py-8 px-6 shadow-xl rounded-xl">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
              <div className="text-sm text-green-800">
                <p className="font-medium">Check your email!</p>
                <p className="mt-1">We've sent password reset instructions to {email}</p>
              </div>
            </div>
          )}

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                leftIcon={<Mail className="h-5 w-5" />}
                required
                autoComplete="email"
              />

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={loading}
              >
                Send reset link
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <Button
                onClick={() => setSuccess(false)}
                variant="outline"
                className="w-full"
              >
                Try another email
              </Button>
            </div>
          )}
        </div>

        {/* Back to sign in */}
        <div className="text-center">
          <Link
            href="/auth/signin"
            className="inline-flex items-center text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
