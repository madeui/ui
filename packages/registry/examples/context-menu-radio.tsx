import * as stylex from '@stylexjs/stylex';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { space, fontSize, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

export default function ContextMenuRadio() {
  return (
    <ContextMenu>
      <ContextMenuTrigger style={styles.trigger}>
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuRadioGroup defaultValue="pedro">
          <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuRadioItem value="new" disabled>
          Add new user…
        </ContextMenuRadioItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}

const styles = stylex.create({
  trigger: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'dashed',
    borderWidth: stroke.border,
    color: colors.foreground,
    display: 'flex',
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    height: container.xs,
    justifyContent: 'center',
    width: container.sm,
    paddingInline: space.s4,
    textAlign: 'center',
  },
});
