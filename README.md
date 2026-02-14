# Kashpages Production

**Go-Live Business Presence Platform for Kashmir**

A production-grade SaaS platform enabling Kashmir businesses to create, customize, and publish professional single-page websites instantly with schema-driven templates, optional AI assistants, and custom domain support.

---

## 🌟 Vision

Kashpages empowers Kashmir businesses to establish an online presence without technical expertise. Users select a template, customize structured content, optionally train an AI assistant, and publish instantly—subject to admin governance for quality assurance.

**This is NOT an open HTML builder.**  
It is a schema-driven, security-first platform with strict component whitelisting.

---

## 🚀 Key Features

### For Creators
- **Template Gallery**: 50 professionally designed templates across 7 categories
- **Visual Page Builder**: Drag-and-drop sections and elements with live preview
- **Content Customization**: Edit text, images, colors, and layout within schema constraints
- **AI Assistant**: Optional floating chat widget trained on business-specific knowledge
- **SEO Optimization**: Full meta tag control, Open Graph, and Twitter cards
- **Revision History**: Track changes and restore previous versions
- **Custom Domains**: Connect your own domain (Business plan)
- **Analytics**: Track views, visitors, referrers, and devices

### For Visitors
- **Single-Page Sites**: Fast-loading, mobile-responsive business pages
- **No Authentication**: Public pages are fully accessible without login
- **AI Chat**: Get instant answers about the business (if enabled)
- **Contact Info**: Direct access to phone, email, WhatsApp, and social links

### For Admins
- **Content Moderation**: Approve or reject pages before going live
- **User Management**: Suspend accounts, manage plans, and roles
- **Template Management**: Add, edit, and organize templates
- **System Configuration**: Manage AI API keys and payment credentials securely
- **Platform Analytics**: Monitor usage, revenue, and user activity

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Animations

### Backend & Infrastructure
- **Firebase Auth** - Email/password, Google, phone authentication
- **Firestore** - NoSQL database for structured data
- **Realtime Database** - Real-time features
- **Firebase Storage** - Image and file uploads
- **Firebase Functions** - Server-side logic
- **Firebase Data Connect** - PostgreSQL integration

### Key Libraries
- **react-beautiful-dnd** or **dnd-kit** - Drag-and-drop
- **zod** - Schema validation
- **date-fns** - Date utilities

---

## 📁 Project Structure

```
kashpages-production/
├── src/
│   ├── app/                  # Next.js 14 App Router pages
│   │   ├── (auth)/          # Auth pages (login, signup)
│   │   ├── (dashboard)/     # User dashboard
│   │   ├── (public)/        # Marketing pages
│   │   ├── admin/           # Admin panel
│   │   ├── builder/         # Page builder interface
│   │   └── api/             # API routes
│   ├── components/          # Reusable React components
│   │   ├── ui/             # Base UI components
│   │   ├── builder/        # Builder-specific components
│   │   ├── sections/       # Section library
│   │   └── elements/       # Element library
│   ├── contexts/           # React contexts (Auth, Builder)
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Core utilities
│   │   ├── firebase/       # Firebase config and helpers
│   │   └── utils/          # Utility functions
│   ├── services/           # Business logic and Firebase operations
│   ├── types/              # TypeScript type definitions
│   └── styles/             # Global styles
├── functions/              # Firebase Cloud Functions
├── firestore.rules         # Firestore security rules
├── firestore.indexes.json  # Database indexes
├── database.rules.json     # Realtime DB rules
├── .env.example            # Environment variables template
├── ROADMAP.md              # Implementation roadmap
└── README.md               # This file
```

---

## 🔐 Security Architecture

### Client-Side
- **No secrets in browser**: All API keys stored server-side
- **Content sanitization**: XSS prevention on all user inputs
- **URL validation**: Prevent javascript:, data:, and dangerous protocols
- **Rate limiting**: Protect against abuse

### Server-Side
- **Firebase Admin SDK**: Privileged operations via Cloud Functions
- **Firestore Rules**: Owner-only access with admin override
- **Authentication**: Firebase Auth with token verification
- **Input validation**: Strict schema validation on all endpoints

### Data Protection
- **Environment separation**: Dev, staging, production
- **Encrypted credentials**: Payment and AI API keys encrypted at rest
- **User privacy**: Personal data protected per GDPR principles

---

## 🎨 Design Principles

### Schema-Driven Content
- **Strict component whitelist**: Only approved sections and elements
- **No arbitrary HTML**: Everything validated against schema
- **Predictable rendering**: Consistent output across all pages

### User Experience
- **World-class SaaS feel**: High polish and attention to detail
- **Animations**: Smooth transitions using Framer Motion
- **Loading states**: Skeletons and spinners for async operations
- **Error handling**: Toast notifications and error boundaries
- **Responsive**: Mobile-first design

### Performance
- **Optimized images**: Next.js Image component
- **Code splitting**: Lazy loading of heavy components
- **CDN delivery**: Firebase Hosting with global edge network
- **Efficient queries**: Firestore indexing and pagination

---

## 📊 Data Models

### Users
```typescript
{
  uid: string
  email: string
  displayName: string
  role: 'guest' | 'user' | 'admin'
  plan: 'free' | 'starter' | 'business'
  status: 'active' | 'suspended'
}
```

### Pages
```typescript
{
  id: string
  ownerId: string
  title: string
  slug: string
  status: 'draft' | 'pending' | 'published'
  contentSchema: ContentSchema
  seo: SEOMetadata
  aiConfig?: AIConfig
}
```

### Templates
```typescript
{
  id: string
  name: string
  category: 'agency' | 'ecommerce' | 'landing' | ...
  plan: 'free' | 'starter' | 'business'
  schema: ContentSchema
}
```

See `src/types/` for complete type definitions.

---

## 💰 Pricing Plans

### Free (₹0/month)
- 1 page
- Basic templates
- Basic widgets
- Community support

### Starter (₹499/month)
- 10 pages
- Starter templates
- Starter widgets
- SEO optimization
- Analytics
- Priority support
- Version history

### Business (₹2,499/month)
- Unlimited pages
- All templates
- All widgets
- Advanced analytics
- **Custom domain**
- **Remove branding**
- AI assistant
- Priority support

---

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Firebase account
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Burhan-sheikh/kashpages-production.git
cd kashpages-production
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your Firebase credentials.

4. **Start development server**
```bash
npm run dev
```

5. **Open browser**
```
http://localhost:3000
```

For detailed setup instructions, see [INSTALLATION.md](./INSTALLATION.md)

---

## 📖 Documentation

- **[Installation Guide](./INSTALLATION.md)** - Detailed setup instructions
- **[Firebase Setup](./FIREBASE_SETUP.md)** - Firebase configuration
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment
- **[Architecture Overview](./ARCHITECTURE.md)** - System design
- **[Features Documentation](./FEATURES.md)** - Feature specifications
- **[Roadmap](./ROADMAP.md)** - Implementation plan
- **[Development Workflow](./DEVELOPMENT_WORKFLOW.md)** - Development guide

---

## 🧪 Testing

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage
```

---

## 🚀 Deployment

### Firebase Hosting

```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

### Vercel (Alternative)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please ensure:
- Code follows ESLint and Prettier rules
- All tests pass
- Documentation is updated

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 🙏 Acknowledgments

- Built with ❤️ for Kashmir businesses
- Inspired by the need for accessible online presence
- Powered by Firebase and Next.js

---

## 📞 Support

- **Documentation**: See docs folder
- **Issues**: [GitHub Issues](https://github.com/Burhan-sheikh/kashpages-production/issues)
- **Email**: support@kashpages.com (when live)

---

## 🎯 Success Definition

**A user should be able to go from signup → template selection → edit → publish without assistance.**

The system must be:
- ✅ Deployable
- ✅ Secure
- ✅ Extensible
- ✅ User-friendly

---

**Built by developers, for businesses in Kashmir. 🇮🇳**
