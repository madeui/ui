'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { space, duration, easing } from '@/lib/constants.stylex';

import Cards from './Cards';
import Dashboard from './Dashboard';
import Inbox from './Inbox';
import Settings from './Settings';
import Team from './Team';

const scenes = [
  { id: 'cards', label: 'Cards', Scene: Cards },
  { id: 'dashboard', label: 'Dashboard', Scene: Dashboard },
  { id: 'inbox', label: 'Inbox', Scene: Inbox },
  { id: 'team', label: 'Team', Scene: Team },
  { id: 'settings', label: 'Settings', Scene: Settings },
] as const;

// One stage, five screens, each with its own chrome: a card wall, a
// dashboard with a sidebar, a three-pane mail client, a full-width members
// page, a settings page. Every control inside is the real registry
// component.
export default function Scenes() {
  const [active, setActive] = React.useState<(typeof scenes)[number]['id']>('cards');
  const current = scenes.find((s) => s.id === active) ?? scenes[0];

  return (
    <Tabs
      value={active}
      onValueChange={(value) => setActive(value as typeof active)}
      style={styles.stage}
    >
      <TabsList aria-label="Example screens" style={styles.tabList}>
        {scenes.map(({ id, label }) => (
          <TabsTrigger key={id} value={id}>
            {label}
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Only the active screen is rendered. Base UI would otherwise keep
          the outgoing panel mounted while it settles, and two panels
          sharing the stage for a frame is the flicker. */}
      <TabsContent key={current.id} value={current.id} style={styles.panel}>
        <div {...stylex.props(styles.fade)}>
          <current.Scene />
        </div>
      </TabsContent>
    </Tabs>
  );
}

const enter = stylex.keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
});

const TABLET = '@media (max-width: 61.25rem)' as const;
const REDUCED = '@media (prefers-reduced-motion: reduce)' as const;

const styles = stylex.create({
  // A fixed stage on desktop: every screen is composed to fit it, so
  // switching never moves the page. Below tablet width the screens stack
  // and the stage takes their height.
  stage: {
    gap: space.s5,
    height: { default: '46rem', [TABLET]: 'auto' },
  },
  // Five tabs outgrow a phone; the list scrolls sideways instead of clipping.
  tabList: {
    maxWidth: '100%',
    overflowX: 'auto',
    scrollbarWidth: 'none',
  },
  panel: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    minHeight: 0,
    minWidth: 0,
    overflow: { default: 'hidden', [TABLET]: 'visible' },
  },
  // Opacity only: a translate would fight the fixed stage.
  fade: {
    animationDuration: { default: duration.normal, [REDUCED]: '0s' },
    animationName: enter,
    animationTimingFunction: easing.out,
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    minHeight: 0,
    minWidth: 0,
  },
});
