import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { space, fontSize, fontWeight, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

export default function CollapsibleDemo() {
  return (
    <Collapsible defaultOpen {...stylex.props(styles.root)}>
      <div {...stylex.props(styles.header)}>
        <span {...stylex.props(styles.title)}>
          @peduarte starred 3 repositories
        </span>
        <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
          Toggle
        </CollapsibleTrigger>
      </div>
      <div {...stylex.props(styles.repo)}>@radix-ui/primitives</div>
      <CollapsibleContent style={styles.panel}>
        <div {...stylex.props(styles.repo)}>@base-ui/react</div>
        <div {...stylex.props(styles.repo)}>@stylexjs/stylex</div>
      </CollapsibleContent>
    </Collapsible>
  );
}

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: space.s2,
    width: container.sm,
  },
  header: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
  },
  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s2,
  },
  repo: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    fontFamily: font.mono,
    fontSize: fontSize.sm,
    paddingBlock: space.s2,
    paddingInline: space.s3,
  },
});
