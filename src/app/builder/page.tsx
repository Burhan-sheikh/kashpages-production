import { PageBuilderPlatform } from '@/components/page-builder/PageBuilderPlatform';

export const metadata = {
  title: 'Page Builder - KashPages',
  description: 'Create stunning landing pages with drag-and-drop builder',
};

export default function BuilderPage() {
  return (
    <main className="h-screen w-screen overflow-hidden">
      <PageBuilderPlatform />
    </main>
  );
}
