import * as stylex from '@stylexjs/stylex';

import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { space } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

export default function SpinnerComposition() {
  return (
    <div {...stylex.props(styles.stack)}>
      <Badge variant="secondary">
        <Spinner width="12" height="12" />
        Syncing
      </Badge>
      <p {...stylex.props(styles.line)}>
        <Spinner />
        Fetching the latest results…
      </p>
    </div>
  );
}

const styles = stylex.create({
  stack: {
    alignItems: 'flex-start',
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
  },
  line: {
    alignItems: 'center',
    color: colors.mutedForeground,
    display: 'flex',
    gap: space.s2,
    margin: 0,
  },
});
