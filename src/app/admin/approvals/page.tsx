'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ProtectedRoute } from '@/lib/auth/ProtectedRoute';
import { UserRole, PendingApprovalDocument, COLLECTIONS } from '@/lib/firebase/collections';
import { collection, getDocs, query, where, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { useAuth } from '@/lib/auth/AuthContext';
import { CheckCircle, XCircle, Eye, Clock, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

export default function ApprovalsPage() {
  const { userDoc } = useAuth();
  const [approvals, setApprovals] = useState<PendingApprovalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = async () => {
    try {
      const approvalsQuery = query(
        collection(db, COLLECTIONS.PENDING_APPROVALS),
        where('status', '==', 'pending')
      );
      const snapshot = await getDocs(approvalsQuery);
      const approvalsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PendingApprovalDocument[];

      setApprovals(approvalsData);
    } catch (error) {
      console.error('Error fetching approvals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (approval: PendingApprovalDocument) => {
    if (!userDoc) return;
    setProcessing(approval.id);

    try {
      // Update approval status
      await updateDoc(doc(db, COLLECTIONS.PENDING_APPROVALS, approval.id), {
        status: 'approved',
        reviewedAt: serverTimestamp(),
        reviewedBy: userDoc.uid,
      });

      // Update page status
      if (approval.type === 'create' || approval.type === 'update') {
        await updateDoc(doc(db, COLLECTIONS.PAGES, approval.pageId), {
          status: 'published',
          isPublished: true,
          publishedAt: serverTimestamp(),
          ...approval.changes,
        });
      }

      // Refresh list
      fetchApprovals();
      alert('Page approved successfully!');
    } catch (error) {
      console.error('Error approving:', error);
      alert('Failed to approve page');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (approval: PendingApprovalDocument) => {
    if (!userDoc) return;
    const reason = prompt('Enter rejection reason:');
    if (!reason) return;

    setProcessing(approval.id);

    try {
      await updateDoc(doc(db, COLLECTIONS.PENDING_APPROVALS, approval.id), {
        status: 'rejected',
        reviewedAt: serverTimestamp(),
        reviewedBy: userDoc.uid,
        reviewNotes: reason,
      });

      fetchApprovals();
      alert('Page rejected');
    } catch (error) {
      console.error('Error rejecting:', error);
      alert('Failed to reject page');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <ProtectedRoute requiredRole={UserRole.ADMIN}>
      <DashboardLayout userRole="admin">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>
          <p className="mt-1 text-sm text-gray-500">
            Review and approve page submissions from users
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
            </div>
          ) : approvals.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                All caught up!
              </h3>
              <p className="text-gray-500">No pending approvals at the moment</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {approvals.map((approval) => (
                <div key={approval.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                          {approval.type.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          User ID: {approval.userId.slice(0, 8)}...
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(approval.submittedAt)}
                        </span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Page ID: {approval.pageId}
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Changes:</h4>
                        <pre className="text-xs text-gray-600 overflow-auto">
                          {JSON.stringify(approval.changes, null, 2)}
                        </pre>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 mt-4">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(approval)}
                      isLoading={processing === approval.id}
                      leftIcon={<CheckCircle className="h-4 w-4" />}
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(approval)}
                      disabled={processing === approval.id}
                      leftIcon={<XCircle className="h-4 w-4" />}
                    >
                      Reject
                    </Button>
                    <a
                      href={`/dashboard/pages/${approval.pageId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview Page
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
