import { SectionType } from '../types';

export interface SectionDefinition {
  type: SectionType;
  name: string;
  description: string;
  category: 'business' | 'trust' | 'marketing' | 'advanced';
  icon: string;
  defaultData: Record<string, any>;
}

export const SECTION_DEFINITIONS: SectionDefinition[] = [
  // Business Essentials
  {
    type: 'hero',
    name: 'Hero Section',
    description: 'Eye-catching header with title, subtitle, and CTA buttons',
    category: 'business',
    icon: '🎯',
    defaultData: {
      title: 'Welcome to Our Business',
      subtitle: 'Your trusted partner in Kashmir',
      backgroundImage: '',
      primaryButton: { text: 'Get Started', link: '#contact' },
      secondaryButton: { text: 'Learn More', link: '#about' },
    },
  },
  {
    type: 'about',
    name: 'About Us',
    description: 'Tell your business story and mission',
    category: 'business',
    icon: '📖',
    defaultData: {
      heading: 'About Us',
      content:
        'Share your business story, mission, and what makes you unique in Kashmir.',
      image: '',
    },
  },
  {
    type: 'contact',
    name: 'Contact Information',
    description: 'Display contact details and inquiry form',
    category: 'business',
    icon: '📞',
    defaultData: {
      heading: 'Get in Touch',
      showForm: true,
      formFields: ['name', 'email', 'phone', 'message'],
    },
  },
  {
    type: 'gallery',
    name: 'Image Gallery',
    description: 'Showcase your products, services, or locations',
    category: 'business',
    icon: '🖼️',
    defaultData: {
      heading: 'Gallery',
      images: [],
      layout: 'grid', // grid, masonry, slider
      columns: 3,
    },
  },
  {
    type: 'services',
    name: 'Services',
    description: 'List your services with descriptions and pricing',
    category: 'business',
    icon: '⚙️',
    defaultData: {
      heading: 'Our Services',
      services: [
        {
          name: 'Service 1',
          description: 'Description of service',
          price: 'Contact for pricing',
          icon: '✓',
        },
      ],
    },
  },
  {
    type: 'working_hours',
    name: 'Working Hours',
    description: 'Display your business hours',
    category: 'business',
    icon: '🕐',
    defaultData: {
      heading: 'Working Hours',
      hours: [
        { day: 'Monday - Friday', time: '9:00 AM - 6:00 PM' },
        { day: 'Saturday', time: '10:00 AM - 4:00 PM' },
        { day: 'Sunday', time: 'Closed' },
      ],
    },
  },

  // Trust Builders
  {
    type: 'testimonials',
    name: 'Testimonials',
    description: 'Customer reviews and feedback',
    category: 'trust',
    icon: '💬',
    defaultData: {
      heading: 'What Our Customers Say',
      testimonials: [
        {
          name: 'Customer Name',
          role: 'Customer',
          content: 'Great service and quality!',
          rating: 5,
          avatar: '',
        },
      ],
    },
  },
  {
    type: 'reviews',
    name: 'Reviews',
    description: 'Detailed customer reviews with ratings',
    category: 'trust',
    icon: '⭐',
    defaultData: {
      heading: 'Customer Reviews',
      averageRating: 4.5,
      totalReviews: 0,
      showReviewForm: true,
    },
  },
  {
    type: 'certifications',
    name: 'Certifications',
    description: 'Display badges, awards, and certifications',
    category: 'trust',
    icon: '🏆',
    defaultData: {
      heading: 'Certifications & Awards',
      certifications: [
        {
          name: 'Certification Name',
          issuer: 'Issuing Organization',
          year: new Date().getFullYear(),
          image: '',
        },
      ],
    },
  },
  {
    type: 'clients',
    name: 'Client Logos',
    description: 'Showcase clients and partners',
    category: 'trust',
    icon: '🤝',
    defaultData: {
      heading: 'Trusted By',
      logos: [],
      layout: 'grid', // grid, slider
    },
  },

  // Marketing
  {
    type: 'cta_banner',
    name: 'Call to Action',
    description: 'Promotional banner with action button',
    category: 'marketing',
    icon: '📣',
    defaultData: {
      heading: 'Ready to Get Started?',
      description: 'Contact us today for a free consultation',
      buttonText: 'Contact Now',
      buttonLink: '#contact',
      backgroundColor: '#22c55e',
    },
  },
  {
    type: 'offers',
    name: 'Special Offers',
    description: 'Display current deals and promotions',
    category: 'marketing',
    icon: '🎁',
    defaultData: {
      heading: 'Special Offers',
      offers: [
        {
          title: 'Summer Sale',
          description: '20% off on all services',
          validUntil: '',
          terms: '',
        },
      ],
    },
  },
  {
    type: 'pricing',
    name: 'Pricing Plans',
    description: 'Display pricing tables and packages',
    category: 'marketing',
    icon: '💰',
    defaultData: {
      heading: 'Pricing Plans',
      plans: [
        {
          name: 'Basic',
          price: '₹999',
          period: 'month',
          features: ['Feature 1', 'Feature 2', 'Feature 3'],
          highlighted: false,
        },
      ],
    },
  },
  {
    type: 'faq',
    name: 'FAQ',
    description: 'Frequently asked questions',
    category: 'marketing',
    icon: '❓',
    defaultData: {
      heading: 'Frequently Asked Questions',
      faqs: [
        {
          question: 'What are your payment methods?',
          answer: 'We accept cash, cards, and online payments.',
        },
      ],
    },
  },

  // Advanced
  {
    type: 'team',
    name: 'Team Members',
    description: 'Introduce your team',
    category: 'advanced',
    icon: '👥',
    defaultData: {
      heading: 'Meet Our Team',
      members: [
        {
          name: 'Team Member',
          role: 'Position',
          bio: 'Brief bio',
          photo: '',
          social: { linkedin: '', twitter: '' },
        },
      ],
    },
  },
  {
    type: 'video',
    name: 'Video',
    description: 'Embed videos from YouTube or Vimeo',
    category: 'advanced',
    icon: '🎥',
    defaultData: {
      heading: 'Watch Our Story',
      videoUrl: '',
      platform: 'youtube', // youtube, vimeo
      thumbnail: '',
    },
  },
  {
    type: 'menu',
    name: 'Menu',
    description: 'Restaurant or cafe menu',
    category: 'advanced',
    icon: '🍽️',
    defaultData: {
      heading: 'Our Menu',
      categories: [
        {
          name: 'Main Course',
          items: [
            {
              name: 'Item Name',
              description: 'Item description',
              price: '₹299',
              image: '',
            },
          ],
        },
      ],
    },
  },
  {
    type: 'products',
    name: 'Products',
    description: 'Product catalog (future e-commerce)',
    category: 'advanced',
    icon: '🛍️',
    defaultData: {
      heading: 'Our Products',
      products: [
        {
          name: 'Product Name',
          description: 'Product description',
          price: '₹499',
          image: '',
          inStock: true,
        },
      ],
    },
  },
];

export const getSectionByType = (type: SectionType): SectionDefinition | undefined => {
  return SECTION_DEFINITIONS.find((def) => def.type === type);
};

export const getSectionsByCategory = (category: string): SectionDefinition[] => {
  return SECTION_DEFINITIONS.filter((def) => def.category === category);
};
