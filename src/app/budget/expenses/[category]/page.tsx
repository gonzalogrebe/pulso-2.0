// src/app/budget/expenses/[category]/page.tsx
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
        section="expenses"
        category={params.category}
      />
    </Suspense>
  );
}