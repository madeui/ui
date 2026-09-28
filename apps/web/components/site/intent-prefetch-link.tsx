'use client';

import { useState, type ComponentProps } from 'react';

import Link from 'next/link';

/**
 * A Link that prefetches its route on intent (pointer hover, keyboard focus or
 * touch) rather than as soon as it is on screen. For an always-visible link to
 * a heavy route most readers never take: the header logo's landing page.
 * Navigation stays client-side.
 */
export function IntentPrefetchLink({
  onMouseEnter,
  onFocus,
  onTouchStart,
  ...props
}: Omit<ComponentProps<typeof Link>, 'prefetch'>) {
  const [intent, setIntent] = useState(false);
  return (
    <Link
      {...props}
      // `false` holds prefetching off; the default takes over on intent and
      // prefetches the (visible) link at once.
      prefetch={intent ? null : false}
      onMouseEnter={(event) => {
        onMouseEnter?.(event);
        setIntent(true);
      }}
      onFocus={(event) => {
        onFocus?.(event);
        setIntent(true);
      }}
      onTouchStart={(event) => {
        onTouchStart?.(event);
        setIntent(true);
      }}
    />
  );
}
