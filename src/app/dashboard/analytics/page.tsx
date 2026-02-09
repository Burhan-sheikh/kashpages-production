'use client';

import React from 'react';
import { Eye, Users, MousePointer, TrendingUp } from 'lucide-react';

export default function AnalyticsPage() {
  const stats = [
    { label: 'Total Views', value: '12,458', change: '+12.5%', icon: Eye },
    { label: 'Unique Visitors', value: '8,234', change: '+8.2%', icon: Users },
    { label: 'Click Rate', value: '4.8%', change: '+2.1%', icon: MousePointer },
    { label: 'Conversion', value: '2.3%', change: '+0.5%', icon: TrendingUp },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-2">Track your page performance</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-primary-100 rounded-lg">
                <stat.icon className="h-6 w-6 text-primary-600" />
              </div>
              <span className="text-sm font-semibold text-green-600">{stat.change}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Page Views Over Time</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          Chart will be displayed here
        </div>
      </div>
    </div>
  );
}