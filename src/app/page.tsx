import Link from 'next/link';
import { ArrowRight, Zap, Palette, Globe, Shield, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function HomePage() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Create professional landing pages in minutes, not hours',
    },
    {
      icon: Palette,
      title: 'Beautiful Templates',
      description: 'Choose from dozens of pre-designed templates',
    },
    {
      icon: Globe,
      title: 'Custom Domains',
      description: 'Use your own domain or get a free subdomain',
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security and 99.9% uptime',
    },
    {
      icon: TrendingUp,
      title: 'Analytics',
      description: 'Track your page performance with built-in analytics',
    },
    {
      icon: Users,
      title: 'Kashmir Focused',
      description: 'Designed specifically for businesses in Kashmir',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-20 pb-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
              Build Beautiful Landing Pages
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-purple-600">
                for Your Business
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create stunning, professional landing pages in minutes with KashPages.
              No coding required. Perfect for businesses in Kashmir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Start for free
                </Button>
              </Link>
              <Link href="/explore">
                <Button size="lg" variant="outline">
                  Explore templates
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">
              No credit card required • Free plan available
            </p>
          </div>

          {/* Hero Image */}
          <div className="mt-16 relative">
            <div className="relative mx-auto max-w-5xl rounded-xl shadow-2xl overflow-hidden border-8 border-white">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center">
                <p className="text-2xl font-semibold text-gray-600">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features to help you create, manage, and grow your online presence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} hover padding="lg">
                <feature.icon className="h-12 w-12 text-primary-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-purple-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses in Kashmir using KashPages to grow their online presence
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Create your first page
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
