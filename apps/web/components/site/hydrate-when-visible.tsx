'use client';

import { Suspense, use, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

// Deferred hydration for heavy Example blocks. The server renders the block
// in full; in the browser its server HTML stays on screen, untouched, while
// the hydration of its Suspense boundary waits on a gate. The gate opens when
// the block comes within about one screen of the viewport, and React then
// hydrates that server HTML in place: no placeholder, no remount.
//
// Only hydration waits. When the block mounts on the client (a client-side
// navigation to its page), there is no server HTML to keep, and it renders
// at once.
//
// React client-renders a boundary that is still waiting when an update or a
// context change reaches it from above, so wrap content whose ancestors stay
// still at load (the whole Example block, not a node inside its Tabs).

/** How close to the viewport an Example starts hydrating: one screen. */
const ROOT_MARGIN = '100% 0px';

interface Gate {
  opened: Promise<void>;
  open: () => void;
}

function createGate(): Gate {
  let open = () => {};
  const opened = new Promise<void>((resolve) => {
    open = resolve;
  });
  return { opened, open };
}

export function HydrateWhenVisible({ children }: { children: ReactNode }) {
  const marker = useRef<HTMLSpanElement>(null);
  // Only the browser waits; the server renders the Example straight away.
  const [gate] = useState(() => (typeof window === 'undefined' ? null : createGate()));

  useEffect(() => {
    // The marker follows the content: the element before it is the content's box.
    const box = marker.current?.previousElementSibling;
    if (!gate || !box) {
      gate?.open();
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        gate.open();
        observer.disconnect();
      },
      { rootMargin: ROOT_MARGIN },
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, [gate]);

  return (
    <>
      <Suspense>
        <WaitWhileHydrating gate={gate}>{children}</WaitWhileHydrating>
      </Suspense>
      <span hidden ref={marker} />
    </>
  );
}

const subscribeToNothing = () => () => {};

/** Suspends while hydrating until the gate opens; renders at once otherwise. */
function WaitWhileHydrating({ gate, children }: { gate: Gate | null; children: ReactNode }) {
  // The server snapshot is what React reads while hydrating.
  const hydrating = useSyncExternalStore(
    subscribeToNothing,
    () => false,
    () => true,
  );
  if (hydrating && gate) use(gate.opened);
  return children;
}
