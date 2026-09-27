'use client';

import { useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/button';

/** Class names from `stylex.props()`, computed where the styles live (feedback.tsx). */
type Props = { className?: string };

/**
 * The Yes/No answers: one click sends the Vercel Analytics event
 * `feedback {helpful, path, title}` (the maintainer's dashboard reads it) and
 * swaps the buttons for a thank-you. The analytics client loads on the click.
 * Each page renders its own copy, so the next page asks again.
 */
export function FeedbackAnswers({ yes, no, actions, thanks }: { yes: ReactNode; no: ReactNode; actions: Props; thanks: Props }) {
  const [answered, setAnswered] = useState(false);
  const answer = (helpful: 'yes' | 'no') => {
    setAnswered(true);
    const path = location.pathname.replace(/(.)\/+$/u, '$1');
    const title = document.title;
    void import('@vercel/analytics').then(({ track }) => track('feedback', { helpful, path, title }));
  };
  return (
    <>
      <div hidden={answered} {...actions}>
        <Button variant="outline" onClick={() => answer('yes')}>
          {yes}
          Yes
        </Button>
        <Button variant="outline" onClick={() => answer('no')}>
          {no}
          No
        </Button>
      </div>
      <p hidden={!answered} {...thanks}>
        Thanks for your feedback!
      </p>
    </>
  );
}
