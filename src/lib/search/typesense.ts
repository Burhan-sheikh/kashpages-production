import Typesense from 'typesense';

// Initialize Typesense client
export const typesenseClient = new Typesense.Client({
  nodes: [
    {
      host: process.env.NEXT_PUBLIC_TYPESENSE_HOST || 'localhost',
      port: parseInt(process.env.NEXT_PUBLIC_TYPESENSE_PORT || '8108'),
      protocol: process.env.NEXT_PUBLIC_TYPESENSE_PROTOCOL || 'http',
    },
  ],
  apiKey: process.env.NEXT_PUBLIC_TYPESENSE_API_KEY || '',
  connectionTimeoutSeconds: 2,
});

// Collection schema for pages
export const pagesCollectionSchema = {
  name: 'pages',
  fields: [
    { name: 'id', type: 'string' },
    { name: 'title', type: 'string' },
    { name: 'slug', type: 'string' },
    { name: 'category', type: 'string', facet: true },
    { name: 'location', type: 'string', facet: true },
    { name: 'description', type: 'string' },
    { name: 'tags', type: 'string[]', facet: true },
    { name: 'owner_id', type: 'string' },
    { name: 'verified', type: 'bool', facet: true },
    { name: 'status', type: 'string', facet: true },
    { name: 'views', type: 'int32' },
    { name: 'rating', type: 'float' },
    { name: 'created_at', type: 'int64' },
    { name: 'updated_at', type: 'int64' },
  ],
  default_sorting_field: 'views',
};

// Initialize collection
export async function initializeSearchCollection() {
  try {
    // Check if collection exists
    await typesenseClient.collections('pages').retrieve();
    console.log('Collection already exists');
  } catch (error) {
    // Create collection if it doesn't exist
    try {
      await typesenseClient.collections().create(pagesCollectionSchema);
      console.log('Collection created successfully');
    } catch (createError) {
      console.error('Error creating collection:', createError);
    }
  }
}

// Index a page
export async function indexPage(page: any) {
  try {
    const document = {
      id: page.id,
      title: page.title,
      slug: page.slug,
      category: page.category,
      location: page.location,
      description: page.description || '',
      tags: page.tags || [],
      owner_id: page.ownerId,
      verified: page.verified || false,
      status: page.status,
      views: page.views || 0,
      rating: page.rating || 0,
      created_at: new Date(page.createdAt).getTime(),
      updated_at: new Date(page.updatedAt).getTime(),
    };

    await typesenseClient.collections('pages').documents().upsert(document);
    console.log('Page indexed:', page.id);
  } catch (error) {
    console.error('Error indexing page:', error);
  }
}

// Remove a page from index
export async function removePageFromIndex(pageId: string) {
  try {
    await typesenseClient.collections('pages').documents(pageId).delete();
    console.log('Page removed from index:', pageId);
  } catch (error) {
    console.error('Error removing page from index:', error);
  }
}

// Search pages
export async function searchPages(query: string, filters?: any) {
  try {
    const searchParameters = {
      q: query,
      query_by: 'title,description,tags',
      filter_by: filters ? buildFilterString(filters) : '',
      sort_by: 'views:desc',
      per_page: 20,
    };

    const results = await typesenseClient
      .collections('pages')
      .documents()
      .search(searchParameters);

    return results;
  } catch (error) {
    console.error('Search error:', error);
    return null;
  }
}

// Build filter string from object
function buildFilterString(filters: any): string {
  const filterParts: string[] = [];

  if (filters.category) {
    filterParts.push(`category:=${filters.category}`);
  }

  if (filters.location) {
    filterParts.push(`location:=${filters.location}`);
  }

  if (filters.verified !== undefined) {
    filterParts.push(`verified:=${filters.verified}`);
  }

  if (filters.status) {
    filterParts.push(`status:=${filters.status}`);
  }

  return filterParts.join(' && ');
}

// Get facets for filtering
export async function getSearchFacets() {
  try {
    const searchParameters = {
      q: '*',
      query_by: 'title',
      facet_by: 'category,location,verified,status',
      max_facet_values: 100,
      per_page: 0,
    };

    const results = await typesenseClient
      .collections('pages')
      .documents()
      .search(searchParameters);

    return results.facet_counts;
  } catch (error) {
    console.error('Error fetching facets:', error);
    return null;
  }
}