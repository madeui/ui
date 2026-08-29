import * as stylex from '@stylexjs/stylex';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
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
        {/* A radio item outside its RadioGroup has no context — plain item. */}
        <ContextMenuItem disabled>Add new user…</ContextMenuItem>
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
