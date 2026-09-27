'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';
import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { icon } from '@/lib/stylex-utils';

/** How long the check icon stays after a copy. */
const COPIED_MS = 2000;

/**
 * Copies the code of the `<pre>` in its code block. It reads the rendered
 * text rather than taking it as a prop, so the source is not serialized a
 * second time into the page payload; the text is the source, byte for byte.
 */
export function CopyButton({ style }: { style?: stylex.StyleXStyles }) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  async function copy(event: React.MouseEvent<HTMLButtonElement>) {
    const code = event.currentTarget.parentElement?.querySelector('pre')?.textContent;
    if (code == null) return;
    await navigator.clipboard.writeText(code);
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  }

  return (
    <Button
      variant="ghost"
      size="iconSm"
      aria-label={copied ? 'Copied!' : 'Copy code'}
      onClick={copy}
      style={style}
    >
      {copied ? <Check {...stylex.props(icon.sm)} /> : <Copy {...stylex.props(icon.sm)} />}
    </Button>
  );
}
