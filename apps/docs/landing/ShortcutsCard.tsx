import * as stylex from '@stylexjs/stylex';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { Switch } from '@/components/ui/switch';
import { space, fontSize } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

const rows = [
  { action: 'Command palette', keys: ['⌘', 'K'] },
  { action: 'Toggle theme', keys: ['⌘', '⇧', 'L'] },
  { action: 'Quick search', keys: ['/'] },
];

export default function ShortcutsCard() {
  return (
    <Card style={styles.card}>
      <CardHeader>
        <CardTitle>Keyboard shortcuts</CardTitle>
        <CardDescription>Hands off the mouse.</CardDescription>
        <CardAction>
          <Switch defaultChecked size="sm" aria-label="Enable shortcuts" />
        </CardAction>
      </CardHeader>
      <CardContent>
        <div {...stylex.props(styles.list)}>
          {rows.map((r) => (
            <div key={r.action} {...stylex.props(styles.row)}>
              <span {...stylex.props(styles.action)}>{r.action}</span>
              <KbdGroup>
                {r.keys.map((k) => (
                  <Kbd key={k}>{k}</Kbd>
                ))}
              </KbdGroup>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const styles = stylex.create({
  card: {
    width: '100%',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  action: {
    color: colors.mutedForeground,
    fontSize: fontSize.sm,
  },
});
