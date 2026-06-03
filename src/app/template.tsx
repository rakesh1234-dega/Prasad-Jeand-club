'use client';

import AppWrapper from '@/components/AppWrapper';

export default function Template({ children }: { children: React.ReactNode }) {
  return <AppWrapper>{children}</AppWrapper>;
}
