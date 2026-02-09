'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, Eye, Flag, Users, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

export default function AdminPage() {
  const [selectedPage, setSelectedPage] = useState<any>(null);
  const [showPreview, setShowPreview] = useState(false);

  const pendingPages = [
    {
      id: '1',
      title: 'New Restaurant',
      owner: 'john@example.com',
      category: 'Restaurant',
      location: 'Srinagar',
      submittedAt: '2026-02-09',
      status: 'pending',
    },
    {
      id: '2',
      title: 'Tech Store',
      owner: 'sarah@example.com',
      category: 'Retail',
      location: 'Jammu',
      submittedAt: '2026-02-08',
      status: 'pending',
    },
  ];

  const reportedPages = [
    {
      id: '3',
      title: 'Reported Business',
      reason: 'Inappropriate content',
      reportedBy: 'user@example.com',
      reportedAt: '2026-02-08',
    },
  ];

  const stats = [
    { label: 'Total Pages', value: '1,245', icon: FileText },
    { label: 'Total Users', value: '892', icon: Users },
    { label: 'Pending Review', value: '12', icon: Eye },
    { label: 'Reports', value: '3', icon: Flag },
  ];

  const handleApprove = (id: string) => {
    console.log('Approved:', id);
    alert('Page approved!');
  };

  const handleReject = (id: string) => {
    console.log('Rejected:', id);
    alert('Page rejected!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <p className="text-gray-600">Moderate and manage platform content</p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">{stat.label}</span>
                  <Icon className="h-5 w-5 text-primary-600" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            );
          })}
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Pending Approvals</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {pendingPages.map((page) => (
              <div key={page.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{page.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>Owner: {page.owner}</p>
                      <p>
                        {page.category} • {page.location}
                      </p>
                      <p>Submitted: {page.submittedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<Eye className="h-4 w-4" />}
                      onClick={() => {
                        setSelectedPage(page);
                        setShowPreview(true);
                      }}
                    >
                      Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      leftIcon={<CheckCircle className="h-4 w-4" />}
                      onClick={() => handleApprove(page.id)}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      leftIcon={<XCircle className="h-4 w-4" />}
                      onClick={() => handleReject(page.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reported Content */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Reported Content</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {reportedPages.map((page) => (
              <div key={page.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{page.title}</h3>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="text-red-600 font-medium">Reason: {page.reason}</p>
                      <p>Reported by: {page.reportedBy}</p>
                      <p>Reported: {page.reportedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="sm" variant="outline">
                      Review
                    </Button>
                    <Button size="sm" variant="danger">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title="Page Preview"
        size="xl"
      >
        {selectedPage && (
          <div>
            <h3 className="text-xl font-bold mb-4">{selectedPage.title}</h3>
            <p className="text-gray-600 mb-4">
              {selectedPage.category} in {selectedPage.location}
            </p>
            <p className="text-gray-500">Preview content would appear here...</p>
          </div>
        )}
      </Modal>
    </div>
  );
}