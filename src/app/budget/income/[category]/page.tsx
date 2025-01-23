// src/app/budget/income/[category]/page.tsx
import { Suspense } from 'react';
import DynamicPageClient from '@/components/pages/DynamicPageClient';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <DynamicPageClient
        type="budget"
        section="income"
        category={params.category}
      />
    </Suspense>
  );
}