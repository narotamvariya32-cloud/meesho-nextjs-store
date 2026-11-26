'use client';

import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import StoreShell from './StoreShell';

export default function ConditionalShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  if (path?.startsWith('/administrator')) {
    return <>{children}</>;
  }
  return <StoreShell>{children}</StoreShell>;
}
