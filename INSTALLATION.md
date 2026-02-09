# 🚀 Installation Guide - KashPages Page Builder

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install all required dependencies:
- `@dnd-kit/core` - Drag and drop functionality
- `@dnd-kit/sortable` - Sortable list support
- `@radix-ui/react-select` - Select dropdown component
- `@radix-ui/react-tabs` - Tabs component
- `react-contenteditable` - Inline text editing
- `lucide-react` - Icon library

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Access Page Builder

Navigate to the page builder route (you'll need to create a route for it):

```tsx
// app/builder/page.tsx
import { PageBuilderPlatform } from '@/components/page-builder/PageBuilderPlatform';

export default function BuilderPage() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <PageBuilderPlatform />
    </main>
  );
}
```

---

## 🛠️ System Requirements

- **Node.js**: 18.17 or higher
- **npm**: 9.0 or higher
- **Browser**: Modern browser with ES6+ support
  - Chrome 90+
  - Firefox 88+
  - Safari 14+
  - Edge 90+

---

## 💻 Environment Setup

### Recommended VS Code Extensions

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "yoavbls.pretty-ts-errors"
  ]
}
```

### TypeScript Configuration

Ensure your `tsconfig.json` includes:

```json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "jsx": "preserve",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

---

## 🎨 Tailwind CSS Setup

Your `tailwind.config.ts` should include:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};

export default config;
```

---

## 📝 File Structure Check

Verify all files are in place:

```
✓ src/components/page-builder/PageBuilderPlatform.tsx
✓ src/components/page-builder/TopToolbar.tsx
✓ src/components/page-builder/LeftSidebar.tsx
✓ src/components/page-builder/RightSidebar.tsx
✓ src/components/page-builder/LivePreview.tsx
✓ src/components/page-builder/SectionsLibrary.tsx
✓ src/components/page-builder/InlineEditor.tsx
✓ src/components/page-builder/sections/*.tsx (10 files)
✓ src/components/ui/input.tsx
✓ src/components/ui/select.tsx
✓ src/components/ui/tabs.tsx
✓ src/hooks/usePageBuilderHistory.ts
✓ src/types/pageBuilder.ts
✓ src/app/globals.css
```

---

## ⚠️ Common Issues

### Issue: Module not found errors

**Solution**: Clear cache and reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors

**Solution**: Ensure all type definitions are installed
```bash
npm install --save-dev @types/react @types/node
```

### Issue: Tailwind classes not applying

**Solution**: Restart dev server after tailwind config changes
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Issue: Drag and drop not working

**Solution**: Check @dnd-kit packages are installed
```bash
npm list @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## 🛡️ Browser Support

### Fully Supported
- ✅ Chrome 90+ (Desktop & Mobile)
- ✅ Firefox 88+ (Desktop & Mobile)
- ✅ Safari 14+ (Desktop & Mobile)
- ✅ Edge 90+

### Partially Supported
- ⚠️ Internet Explorer: Not supported
- ⚠️ Opera Mini: Limited support

---

## 🚀 Production Build

### Build for Production

```bash
npm run build
```

### Test Production Build

```bash
npm run start
```

### Deploy

**Vercel** (Recommended):
```bash
vercel
```

**Netlify**:
```bash
netlify deploy --prod
```

**Custom Server**:
```bash
npm run build
npm run start
```

---

## 🔒 Environment Variables

Create `.env.local` for environment-specific settings:

```env
# Optional: Firebase/Backend API
NEXT_PUBLIC_API_URL=https://your-api.com

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

## 📊 Performance Tips

1. **Enable React Strict Mode** (already enabled in Next.js)
2. **Use Production Build** for testing performance
3. **Lighthouse Audit** - Check Core Web Vitals
4. **Bundle Analysis**:
   ```bash
   npm install @next/bundle-analyzer
   ```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [DnD Kit Documentation](https://docs.dndkit.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)

---

## ✅ Verification Steps

1. **Install dependencies**: `npm install` → No errors
2. **Start dev server**: `npm run dev` → Server running
3. **Open browser**: `http://localhost:3000` → Page loads
4. **Access builder**: Navigate to builder route → UI appears
5. **Test features**:
   - ☐ Add section from library
   - ☐ Drag and drop sections
   - ☐ Inline edit text
   - ☐ Change colors in properties
   - ☐ Toggle mobile/desktop view
   - ☐ Undo/redo actions
   - ☐ Export page data

---

## 👥 Getting Help

1. **Check README**: Full feature documentation
2. **GitHub Issues**: Report bugs or request features
3. **Discord/Community**: Join community discussions

---

**Happy Building! 🎉**
