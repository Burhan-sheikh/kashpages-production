# Pages Directory

Route-based pages for the application.

## Public Pages

### Landing & Discovery
- `index.tsx` - Homepage with featured content
- `explore.tsx` - Explore all pages with filters
- `search.tsx` - Search results page
- `categories/index.tsx` - Browse all categories
- `categories/[slug].tsx` - Category page with listings
- `locations/index.tsx` - Browse all locations
- `locations/[slug].tsx` - Location page with listings

### Business Page
- `[username]/[slug].tsx` - Public business page view
- `preview/[pageId].tsx` - Preview page before publish

### Info Pages
- `about.tsx` - About Kashpages
- `contact.tsx` - Contact form
- `privacy.tsx` - Privacy policy
- `terms.tsx` - Terms of service
- `how-it-works.tsx` - Platform guide

## Authentication Pages

- `login.tsx` - Login page
- `signup.tsx` - Registration page
- `forgot-password.tsx` - Password reset request
- `verify-email.tsx` - Email verification

## User Dashboard Pages

### Pages Management
- `dashboard/index.tsx` - User dashboard overview
- `dashboard/pages/index.tsx` - My pages list
- `dashboard/pages/new.tsx` - Create new page
- `dashboard/pages/[id]/edit.tsx` - Edit page
- `dashboard/pages/[id]/analytics.tsx` - Page analytics
- `dashboard/pages/[id]/settings.tsx` - Page settings

### User Settings
- `dashboard/profile.tsx` - Profile settings
- `dashboard/account.tsx` - Account settings
- `dashboard/security.tsx` - Security settings

## Admin Pages

### Dashboard
- `admin/index.tsx` - Admin dashboard
- `admin/analytics.tsx` - Platform analytics

### Content Management
- `admin/pages/index.tsx` - All pages management
- `admin/pages/pending.tsx` - Pending approvals
- `admin/pages/[id].tsx` - Page moderation

### User Management
- `admin/users/index.tsx` - All users
- `admin/users/[id].tsx` - User details

### Homepage Control
- `admin/homepage.tsx` - Homepage content management

### Categories & Locations
- `admin/categories/index.tsx` - Categories management
- `admin/categories/new.tsx` - Create category
- `admin/categories/[id]/edit.tsx` - Edit category
- `admin/locations/index.tsx` - Locations management
- `admin/locations/new.tsx` - Create location
- `admin/locations/[id]/edit.tsx` - Edit location

### Reports & Moderation
- `admin/reports/index.tsx` - All reports
- `admin/reports/[id].tsx` - Report details

### Platform Settings
- `admin/settings/index.tsx` - Platform settings
- `admin/settings/general.tsx` - General settings
- `admin/settings/seo.tsx` - SEO settings
- `admin/settings/plans.tsx` - Pricing plans

## Error Pages

- `404.tsx` - Page not found
- `500.tsx` - Server error
- `_error.tsx` - Generic error page
