'use client';

import { useRef, useState, useSyncExternalStore, type ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import { useCopied } from '@/components/site/use-copied';
import { site } from '@/site/artifacts/site';

// The interactive parts of the page actions. page-actions.tsx renders the
// rest (labels, icons, logos) and computes the styles; they arrive here as
// the class names `stylex.props()` returned.

type Props = { className?: string };

/** The page's Markdown mirror: `/docs/components/button.md`, `/index.md` for the home. */
function useMarkdownPath() {
  const route = usePathname();
  return `${route === '/' ? '/index' : route}.md`;
}

export function ScrollToTop({ sx, children }: { sx: Props; children: ReactNode }) {
  return (
    <button type="button" onClick={() => window.scrollTo({ behavior: 'smooth', top: 0 })} {...sx}>
      {children}
    </button>
  );
}

/** Copies the page's Markdown mirror; the label says "Copied!" for a moment, only when the copy worked. */
export function CopyMarkdown({ sx, children }: { sx: Props; children: ReactNode }) {
  const md = useMarkdownPath();
  const [copied, flash] = useCopied();
  const copy = async () => {
    try {
      const response = await fetch(md);
      if (!response.ok) throw new Error(`${md}: ${response.status}`);
      await navigator.clipboard.writeText(await response.text());
    } catch (error) {
      console.error('Copy as Markdown failed', error);
      return;
    }
    flash();
  };
  return (
    <button type="button" onClick={copy} {...sx}>
      {children}
      <span>{copied ? 'Copied!' : 'Copy as Markdown'}</span>
    </button>
  );
}

/** Room (px) the menu keeps from the viewport edge before it opens upward instead. */
const EDGE = 8;

/** "Open in chat": a native disclosure whose menu opens upward when there is no room below. */
export function ChatMenu({ sx, down, up, summary, children }: {
  sx: Props;
  down: Props;
  up: Props;
  summary: ReactNode;
  children: ReactNode;
}) {
  const [upward, setUpward] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  return (
    <details
      onToggle={(event) => {
        const list = menu.current;
        if (!event.currentTarget.open || !list) return;
        const trigger = event.currentTarget.firstElementChild!.getBoundingClientRect();
        const height = list.offsetHeight + EDGE;
        setUpward(trigger.bottom + height > innerHeight && trigger.top - height > 0);
      }}
      {...sx}
    >
      {summary}
      <div ref={menu} {...(upward ? up : down)}>
        {children}
      </div>
    </details>
  );
}

const PROMPT_URLS = {
  v0: 'https://v0.app?q=',
  chatgpt: 'https://chatgpt.com/?hints=search&prompt=',
  claude: 'https://claude.ai/new?q=',
  t3: 'https://t3.chat/new?q=',
  scira: 'https://scira.ai/?q=',
  cursor: 'https://cursor.com/link/prompt?text=',
};

export type ChatProvider = keyof typeof PROMPT_URLS;

const noSubscription = () => () => {};
const currentOrigin = () => location.origin;
const siteOrigin = () => site.url;

/** A provider link whose prompt points the assistant at this page's Markdown, on the origin the reader is on. */
export function ChatLink({ provider, sx, children }: { provider: ChatProvider; sx: Props; children: ReactNode }) {
  const md = useMarkdownPath();
  const origin = useSyncExternalStore(noSubscription, currentOrigin, siteOrigin);
  const prompt = encodeURIComponent(`Read ${origin}${md} so I can ask you questions about this page.`);
  return (
    <a href={PROMPT_URLS[provider] + prompt} target="_blank" rel="noreferrer" {...sx}>
      {children}
    </a>
  );
}
