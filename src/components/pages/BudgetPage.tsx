// src/components/pages/BudgetPage.tsx
'use client';
import dynamic from 'next/dynamic';

const BudgetPageClient = dynamic(
  () => import('./BudgetPageClient'),
  { ssr: false }
);

export default function BudgetPage() {
  return <BudgetPageClient />;
}