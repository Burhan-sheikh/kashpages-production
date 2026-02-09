# KashPages - Business Landing Page Builder for Kashmir

A modern, full-featured platform for creating beautiful business landing pages with drag-and-drop page builder, analytics, and search capabilities.

## Features

### 🎨 Page Builder
- Drag-and-drop section reordering
- 18+ pre-built section types (Hero, About, Services, Gallery, etc.)
- Real-time preview (desktop & mobile)
- Design customization (colors, fonts, themes)
- Section-level visibility controls

### 🔍 Search & Discovery
- Full-text search with Typesense
- Category and location filtering
- Faceted search with autocomplete
- Featured and trending pages

### 📊 Analytics Dashboard
- Views and visitor tracking
- Device and location breakdown
- Time-series charts
- Engagement metrics

### 👥 User Features
- User dashboard for managing pages
- Publish/draft workflow
- Custom domain support (coming soon)
- SEO optimization

### 🛡️ Admin Panel
- Content moderation interface
- Pending approvals workflow
- Report handling
- User management

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Firebase Firestore
- **Authentication:** Firebase Auth
- **Search:** Typesense
- **Storage:** Cloudinary
- **Charts:** Recharts
- **Drag & Drop:** react-beautiful-dnd

## Getting Started

### Prerequisites

- Node.js 18+ installed
- Firebase project created
- Typesense instance (Cloud or self-hosted)
- Cloudinary account

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

3. **Set up environment variables**

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your credentials:

```env
# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
# ... (see .env.example for complete list)

# Typesense
NEXT_PUBLIC_TYPESENSE_HOST=localhost
NEXT_PUBLIC_TYPESENSE_PORT=8108
NEXT_PUBLIC_TYPESENSE_PROTOCOL=http
NEXT_PUBLIC_TYPESENSE_API_KEY=xyz

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_secret
```

4. **Run Typesense locally (optional)**

```bash
# Using Docker
docker run -d -p 8108:8108 \
  -v/tmp/typesense-data:/data \
  typesense/typesense:0.25.2 \
  --data-dir /data \
  --api-key=xyz \
  --enable-cors
```

Or use Typesense Cloud: https://cloud.typesense.org/

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
kashpages-production/
├── src/
│   ├── app/
│   │   ├── (public)/          # Public-facing pages
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── explore/         # Browse pages
│   │   │   ├── category/        # Category pages
│   │   │   └── location/        # Location pages
│   │   ├── (dashboard)/       # User dashboard
│   │   │   └── dashboard/
│   │   │       ├── page.tsx     # Main dashboard
│   │   │       └── pages/[id]/
│   │   │           ├── edit/    # Page editor
│   │   │           └── analytics/ # Analytics
│   │   └── (admin)/          # Admin panel
│   │       └── admin/
│   ├── components/
│   │   └── ui/              # Reusable UI components
│   ├── features/
│   │   └── page-builder/    # Page builder components
│   ├── lib/
│   │   ├── firebase/        # Firebase configuration
│   │   └── search/          # Typesense integration
│   └── types/              # TypeScript types
├── public/                # Static assets
├── .env.example           # Example environment variables
├── .env.local.example     # Minimal local setup
├── package.json
└── README.md
```

## Configuration

### Firebase Setup

1. Create a Firebase project at https://console.firebase.google.com/
2. Enable Authentication (Email/Password, Google, etc.)
3. Create a Firestore database
4. Set up security rules (see `firestore.rules`)
5. Copy configuration to `.env.local`

### Typesense Setup

**Option 1: Typesense Cloud (Recommended)**

1. Sign up at https://cloud.typesense.org/
2. Create a new cluster
3. Copy credentials to `.env.local`

**Option 2: Self-hosted**

```bash
# Run with Docker
docker run -d -p 8108:8108 \
  -v/tmp/typesense-data:/data \
  typesense/typesense:0.25.2 \
  --data-dir /data \
  --api-key=xyz \
  --enable-cors
```

### Cloudinary Setup

1. Sign up at https://cloudinary.com/
2. Go to Dashboard > Settings
3. Create an unsigned upload preset:
   - Settings > Upload > Upload presets
   - Add upload preset
   - Set mode to "Unsigned"
   - Save preset name
4. Copy credentials to `.env.local`

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify

1. Connect repository
2. Build command: `npm run build`
3. Publish directory: `.next`
4. Add environment variables
5. Deploy

### Docker

```bash
# Build image
docker build -t kashpages .

# Run container
docker run -p 3000:3000 --env-file .env.local kashpages
```

## Environment Variables

See `.env.example` for a complete list of available environment variables.

**Required:**
- Firebase credentials
- Typesense configuration
- Cloudinary credentials
- App URL

**Optional:**
- Email service (SendGrid, Resend, SMTP)
- Payment gateway (Stripe, Razorpay)
- Analytics (Google Analytics, Vercel Analytics)
- Social OAuth providers
- SMS service (Twilio)
- Maps API (Google Maps, Mapbox)

## Scripts

```bash
# Development
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Type check
npm run type-check
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- GitHub Issues: https://github.com/Burhan-sheikh/kashpages-production/issues
- Email: support@kashpages.com

## Roadmap

- [ ] Custom domain support
- [ ] Email templates
- [ ] WhatsApp integration
- [ ] Multi-language support
- [ ] Advanced SEO tools
- [ ] Team collaboration
- [ ] API access
- [ ] Mobile app

---

Built with ❤️ in Kashmir
