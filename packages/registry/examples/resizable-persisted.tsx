'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  useDefaultLayout,
} from '@/components/ui/resizable';
import { container, fontSize, fontWeight, space, stroke } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

// The saved layout lives in localStorage, which only exists in the browser.
// Mount the group after hydration so the server markup and the first client
// render match; the frame keeps its size meanwhile.
const subscribe = () => () => {};
const useMounted = () =>
  React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

export default function ResizablePersisted() {
  const mounted = useMounted();
  return (
    <div {...stylex.props(styles.frame)}>{mounted ? <PersistedGroup /> : null}</div>
  );
}

function PersistedGroup() {
  const { defaultLayout, onLayoutChanged } = useDefaultLayout({
    id: 'resizable-persisted-example',
  });

  return (
    <ResizablePanelGroup
      defaultLayout={defaultLayout}
      onLayoutChanged={onLayoutChanged}
    >
      <ResizablePanel id="left" defaultSize="50%" minSize="20%">
        <div {...stylex.props(styles.content)}>Resize me</div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel id="right" defaultSize="50%" minSize="20%">
        <div {...stylex.props(styles.content)}>Then reload the page</div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

const styles = stylex.create({
  frame: {
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    height: container.xs,
    maxWidth: container.xl,
    overflow: 'hidden',
    width: '100%',
  },
  content: {
    alignItems: 'center',
    backgroundColor: colors.muted,
    color: colors.foreground,
    display: 'flex',
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    height: '100%',
    justifyContent: 'center',
    padding: space.s6,
    textAlign: 'center',
  },
});
