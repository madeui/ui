'use client';

import { useState } from 'react';

import * as stylex from '@stylexjs/stylex';
import { Menu } from 'lucide-react';
import dynamic from 'next/dynamic';

import { Button } from '@/components/ui/button';
import { icon } from '@/lib/stylex-utils';
import { radius } from '@/lib/tokens.stylex';
import type { SidebarGroup } from '@/site/nav';

// The drawer (a Sheet: dialog, focus trap, scroll lock) is code the page only
// needs once the reader reaches for it, and never at lg and up: it loads on
// the first sign of intent (hover, focus, press) and mounts closed until the
// click opens it.
const MobileDrawer = dynamic(() => import('@/components/site/mobile-drawer').then((m) => m.MobileDrawer), {
  ssr: false,
});

/** Below the lg breakpoint the sidebar lives in a drawer; following a link closes it. */
export function MobileNav({ label, groups }: { label: string; groups?: SidebarGroup[] }) {
  const [wanted, setWanted] = useState(false);
  const [open, setOpen] = useState(false);
  const want = () => setWanted(true);
  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Toggle navigation"
        aria-haspopup="dialog"
        aria-expanded={open}
        onPointerEnter={want}
        onPointerDown={want}
        onFocus={want}
        onClick={() => {
          setWanted(true);
          setOpen(true);
        }}
        style={styles.trigger}
      >
        <Menu {...stylex.props(icon.md)} />
      </Button>
      {wanted ? <MobileDrawer open={open} onOpenChange={setOpen} label={label} groups={groups} /> : null}
    </>
  );
}

const styles = stylex.create({
  trigger: {
    borderRadius: radius.full,
  },
});
