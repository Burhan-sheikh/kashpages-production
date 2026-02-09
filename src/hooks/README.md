# Custom Hooks

Reusable React hooks for common functionality.

## Authentication Hooks

### `useAuth.ts`
Provides authentication state and methods.
```typescript
const { currentUser, login, logout, signup } = useAuth();
```

### `useRequireAuth.ts`
Redirects to login if not authenticated.
```typescript
useRequireAuth('/login');
```

### `useRequireAdmin.ts`
Redirects if not admin.
```typescript
useRequireAdmin();
```

## Data Hooks

### `useUser.ts`
Fetch and manage user data.
```typescript
const { user, loading, updateUser } = useUser(userId);
```

### `usePage.ts`
Fetch and manage page data.
```typescript
const { page, loading, updatePage, deletePage } = usePage(pageId);
```

### `usePages.ts`
Fetch multiple pages with filters.
```typescript
const { pages, loading, hasMore, loadMore } = usePages(filters);
```

### `useCategories.ts`
Fetch categories.
```typescript
const { categories, loading } = useCategories();
```

### `useLocations.ts`
Fetch locations.
```typescript
const { locations, loading } = useLocations();
```

## Search & Discovery Hooks

### `useSearch.ts`
Search functionality with filters.
```typescript
const { results, loading, search, filters, setFilters } = useSearch();
```

### `useInfiniteScroll.ts`
Infinite scrolling pagination.
```typescript
const { data, loading, hasMore, loadMore } = useInfiniteScroll(fetchFn);
```

## Form Hooks

### `useForm.ts`
Form state management.
```typescript
const { values, errors, handleChange, handleSubmit } = useForm(initialValues, onSubmit);
```

### `useFormValidation.ts`
Form validation.
```typescript
const { validate, errors } = useFormValidation(schema);
```

## UI Hooks

### `useModal.ts`
Modal state management.
```typescript
const { isOpen, open, close } = useModal();
```

### `useToast.ts`
Toast notifications.
```typescript
const { showToast, hideToast } = useToast();
```

### `useMediaQuery.ts`
Responsive breakpoints.
```typescript
const isMobile = useMediaQuery('(max-width: 768px)');
```

### `useDebounce.ts`
Debounce value changes.
```typescript
const debouncedValue = useDebounce(value, 500);
```

### `useClickOutside.ts`
Detect clicks outside element.
```typescript
const ref = useClickOutside(handleClose);
```

## Storage Hooks

### `useLocalStorage.ts`
Persist state in localStorage.
```typescript
const [value, setValue] = useLocalStorage('key', defaultValue);
```

### `useImageUpload.ts`
Handle image uploads.
```typescript
const { upload, progress, url, error } = useImageUpload();
```

## Analytics Hooks

### `usePageAnalytics.ts`
Fetch page analytics.
```typescript
const { analytics, loading } = usePageAnalytics(pageId);
```

### `useTrackEvent.ts`
Track analytics events.
```typescript
const trackEvent = useTrackEvent();
trackEvent('button_click', { button: 'contact' });
```

### `usePageView.ts`
Track page views.
```typescript
usePageView(pageId);
```

## Admin Hooks

### `useDashboardMetrics.ts`
Fetch admin dashboard metrics.
```typescript
const { metrics, loading } = useDashboardMetrics();
```

### `usePendingPages.ts`
Fetch pages pending approval.
```typescript
const { pages, loading, approve, reject } = usePendingPages();
```

### `useReports.ts`
Manage reports.
```typescript
const { reports, loading, resolve, dismiss } = useReports();
```
