import { useAuth } from '@/lib/auth/AuthContext';
import { UserRole } from '@/lib/firebase/collections';

export function usePermissions() {
  const { userDoc, isAdmin, isUser, isGuest } = useAuth();

  return {
    // Basic role checks
    isAdmin,
    isUser,
    isGuest,
    
    // Page permissions
    canCreatePage: isUser || isAdmin,
    canPublishPage: isAdmin,
    canEditOwnPage: isUser || isAdmin,
    canEditAnyPage: isAdmin,
    canDeleteOwnPage: isUser || isAdmin,
    canDeleteAnyPage: isAdmin,
    canViewDraftPages: isUser || isAdmin,
    
    // User management permissions
    canViewUsers: isAdmin,
    canEditUsers: isAdmin,
    canDeleteUsers: isAdmin,
    canChangeUserRoles: isAdmin,
    
    // Approval permissions
    canSubmitForApproval: isUser,
    canApprovePages: isAdmin,
    canRejectPages: isAdmin,
    
    // Analytics permissions
    canViewOwnAnalytics: isUser || isAdmin,
    canViewAllAnalytics: isAdmin,
    
    // Template permissions
    canViewTemplates: true, // Everyone
    canCreateTemplates: isAdmin,
    canEditTemplates: isAdmin,
    canDeleteTemplates: isAdmin,
    
    // System permissions
    canAccessAdminPanel: isAdmin,
    canViewAuditLogs: isAdmin,
    canManageSettings: isAdmin,
  };
}
