import { useEffect, useRef, useState } from 'react';

/** How long a copy control shows that it copied. */
export const COPIED_MS = 1500;

/**
 * The "copied" state of a copy control. Call `flash()` once the clipboard
 * write succeeded: `copied` is true for COPIED_MS, and another copy in the
 * meantime restarts the wait.
 */
export function useCopied(): [copied: boolean, flash: () => void] {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const flash = () => {
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  };
  return [copied, flash];
}
