import * as stylex from '@stylexjs/stylex';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import { space, fontSize, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

export default function ContextMenuCheckboxes() {
  return (
    <ContextMenu>
      <ContextMenuTrigger style={styles.trigger}>
        Right-click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        {/* Menu labels are Base UI GroupLabels — they must live inside a
            Group or RadioGroup. */}
        <ContextMenuGroup>
          <ContextMenuLabel>Appearance</ContextMenuLabel>
          <ContextMenuCheckboxItem defaultChecked>
            Show bookmarks bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Show full URLs</ContextMenuCheckboxItem>
        </ContextMenuGroup>
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
