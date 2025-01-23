// src/app/real/expenses/[category]/page.tsx
import DynamicPageClient from '@/components/pages/DynamicPageClient';

export default function Page({ params }: { params: { category: string } }) {
  return (
    <DynamicPageClient
      type="real"
      section="expenses"
      category={params.category}
    />
  );
}