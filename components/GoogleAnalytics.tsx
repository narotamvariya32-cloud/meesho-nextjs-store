'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GoogleAnalytics({ value }: { value: string }) {
  const path = usePathname();
  const id = value.match(/G-[A-Z0-9]+/)?.[0] || '';

  useEffect(() => {
    if (!id) return;
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.gtag = w.gtag || function (...args: any[]) { w.dataLayer.push(args); };
    if (!document.querySelector(`script[data-ga="${id}"]`)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${id}`;
      script.dataset.ga = id;
      document.head.appendChild(script);
      w.gtag('js', new Date());
    }
    w.gtag('config', id, { page_path: path });
  }, [id, path]);

  return null;
}
