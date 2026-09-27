'use client';

import * as stylex from '@stylexjs/stylex';

import { HeaderTabs } from '@/components/site/header-tabs';
import { SidebarNav } from '@/components/site/sidebar-nav';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { space } from '@/lib/constants.stylex';
import type { SidebarGroup } from '@/site/nav';

/** The drawer behind the header's navigation button: the section tabs, then the tab's sidebar. */
export function MobileDrawer({
  open,
  onOpenChange,
  label,
  groups,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  label: string;
  groups?: SidebarGroup[];
}) {
  const close = () => onOpenChange(false);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left">
        <SheetTitle style={styles.srOnly}>Navigation</SheetTitle>
        <ScrollArea style={styles.scroll}>
          <div {...stylex.props(styles.inner)}>
            <HeaderTabs stacked onNavigate={close} />
            {groups ? <SidebarNav label={label} groups={groups} onNavigate={close} /> : null}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

const styles = stylex.create({
  scroll: {
    flexGrow: 1,
    minHeight: 0,
  },
  inner: {
    paddingBlock: space.s12,
    paddingInline: space.s4,
  },
  srOnly: {
    clip: 'rect(0 0 0 0)',
    height: space.px,
    overflow: 'hidden',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: space.px,
  },
});
