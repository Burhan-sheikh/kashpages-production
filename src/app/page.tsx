import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Zap, Layout, Smartphone, TrendingUp, Users, Shield } from 'lucide-react';

export default function HomePage() {
  const features = [
    {
      icon: Layout,
      title: 'Drag & Drop Builder',
      description: 'Create beautiful pages with our intuitive visual editor',
    },
    {
      icon: Smartphone,
      title: 'Mobile Responsive',
      description: 'Your pages look perfect on all devices automatically',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized for speed and performance out of the box',
    },
    {
      icon: TrendingUp,
      title: 'Analytics Built-in',
      description: 'Track your page views and visitor engagement',
    },
    {
      icon: Users,
      title: 'Kashmir Community',
      description: 'Built specifically for businesses in Kashmir',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security and 99.9% uptime',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="flex-1 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Create Stunning Landing Pages
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                For Your Business
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Build beautiful, professional landing pages in minutes without any coding.
              Perfect for Kashmir businesses looking to grow online.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Explore Examples
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required • Free forever plan available
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600">
              Powerful features to help you create amazing landing pages
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="bg-primary-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join hundreds of Kashmir businesses already using KashPages
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="outline" className="bg-white text-primary-600 hover:bg-primary-50">
              Create Your First Page
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
