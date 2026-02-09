# API Services

This directory contains all Firebase API interactions and service functions.

## Structure

### Firebase Config (`firebase.ts`)
- Firebase initialization
- Auth, Firestore, Storage instances
- Configuration management

### Auth Services (`auth.service.ts`)
- `signUp(data)` - Create new user account
- `signIn(credentials)` - Email/password login
- `signInWithGoogle()` - Google OAuth login
- `signOut()` - Logout user
- `resetPassword(email)` - Send password reset email
- `updateUserProfile(data)` - Update user profile
- `sendEmailVerification()` - Send verification email
- `deleteAccount()` - Delete user account

### User Services (`user.service.ts`)
- `getUserById(userId)` - Get user details
- `updateUser(userId, data)` - Update user data
- `uploadAvatar(file)` - Upload profile picture
- `checkUsernameAvailability(username)` - Check if username is taken
- `getUserPages(userId)` - Get all pages owned by user

### Page Services (`page.service.ts`)
- `createPage(data)` - Create new page
- `updatePage(pageId, data)` - Update page
- `deletePage(pageId)` - Delete page
- `publishPage(pageId)` - Submit page for review
- `getPageById(pageId)` - Get page details
- `getPageBySlug(slug)` - Get page by URL slug
- `incrementPageViews(pageId)` - Track page view
- `getUserPages(userId)` - Get user's pages

### Section Services (`section.service.ts`)
- `addSection(pageId, section)` - Add section to page
- `updateSection(pageId, sectionId, data)` - Update section
- `deleteSection(pageId, sectionId)` - Remove section
- `reorderSections(pageId, sections)` - Change section order
- `duplicateSection(pageId, sectionId)` - Clone section
- `getSectionTemplates()` - Get available templates

### Discovery Services (`discovery.service.ts`)
- `searchPages(params)` - Search pages with filters
- `getHomepageBlocks()` - Get homepage content
- `getTrendingPages()` - Get trending pages
- `getFeaturedPages()` - Get featured pages
- `getPagesByCategory(category)` - Get category pages
- `getPagesByLocation(location)` - Get location pages

### Category Services (`category.service.ts`)
- `getCategories()` - Get all categories
- `getCategoryBySlug(slug)` - Get category details
- `createCategory(data)` - Create category (admin)
- `updateCategory(id, data)` - Update category (admin)
- `deleteCategory(id)` - Delete category (admin)
- `mergeCategories(sourceId, targetId)` - Merge categories (admin)

### Location Services (`location.service.ts`)
- `getLocations()` - Get all locations
- `getLocationBySlug(slug)` - Get location details
- `createLocation(data)` - Create location (admin)
- `updateLocation(id, data)` - Update location (admin)
- `deleteLocation(id)` - Delete location (admin)

### Admin Services (`admin.service.ts`)
- `getDashboardMetrics()` - Get admin dashboard data
- `getAllPages(filters)` - Get all pages with filters
- `approvePage(pageId)` - Approve pending page
- `rejectPage(pageId, reason)` - Reject page
- `featurePage(pageId)` - Feature page on homepage
- `verifyPage(pageId)` - Add verification badge
- `getAllUsers(filters)` - Get all users
- `blockUser(userId)` - Block user
- `unblockUser(userId)` - Unblock user
- `changeUserRole(userId, role)` - Change user role
- `getReports()` - Get all reports
- `resolveReport(reportId)` - Mark report as resolved

### Analytics Services (`analytics.service.ts`)
- `getPageAnalytics(pageId)` - Get page analytics
- `getPlatformAnalytics()` - Get platform analytics (admin)
- `trackEvent(event)` - Track analytics event
- `trackPageView(pageId)` - Track page view
- `trackClick(pageId, type)` - Track button click

### Storage Services (`storage.service.ts`)
- `uploadImage(file, path)` - Upload image to Firebase Storage
- `deleteImage(url)` - Delete image
- `uploadMultipleImages(files, path)` - Batch upload
- `getImageURL(path)` - Get download URL

### Report Services (`report.service.ts`)
- `createReport(data)` - Submit report
- `getPageReports(pageId)` - Get reports for page
- `updateReportStatus(reportId, status)` - Update report status
