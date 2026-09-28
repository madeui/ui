import * as stylex from '@stylexjs/stylex';
import { ThumbsDown, ThumbsUp } from 'lucide-react';

import { FeedbackAnswers } from '@/components/site/feedback-answers';
import { fontSize, lineHeight, space, stroke } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';
import { colors } from '@/lib/tokens.stylex';

const QUESTION = 'Was this page helpful?';

/**
 * "Was this page helpful?" under the article. The markup renders here; only
 * the answer buttons hydrate (feedback-answers.tsx).
 */
export function Feedback() {
  return (
    <section aria-label={QUESTION} {...stylex.props(styles.root)}>
      <p {...stylex.props(styles.text)}>{QUESTION}</p>
      <FeedbackAnswers
        yes={<ThumbsUp {...stylex.props(icon.md)} />}
        no={<ThumbsDown {...stylex.props(icon.md)} />}
        actions={stylex.props(styles.actions)}
        thanks={stylex.props(styles.text)}
      />
    </section>
  );
}

const styles = stylex.create({
  root: {
    alignItems: 'center',
    borderBlockStartColor: colors.border,
    borderBlockStartStyle: 'solid',
    borderBlockStartWidth: stroke.border,
    display: 'flex',
    gap: space.s4,
    justifyContent: 'space-between',
    marginBlockStart: space.s12,
    paddingBlockStart: space.s6,
  },
  text: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
    lineHeight: lineHeight.control,
    margin: 0,
  },
  actions: {
    alignItems: 'center',
    display: { default: 'flex', '[hidden]': 'none' },
    gap: space.s2,
  },
});
