import { useSyncExternalStore } from 'react';

// The platform does not change while the page is open: nothing to subscribe to.
const noSubscription = () => () => {};
const isApple = () => /mac|iphone|ipad|ipod/iu.test(navigator.platform);
// The server cannot know; the prerendered HTML takes the Apple form.
const onServer = () => true;

/**
 * Whether the reader's shortcuts use ⌘ (Apple devices) or Ctrl. SSR-safe:
 * the server and hydration say ⌘, and other platforms switch to Ctrl right
 * after hydration, without a mismatch.
 */
export function useApplePlatform(): boolean {
  return useSyncExternalStore(noSubscription, isApple, onServer);
}
