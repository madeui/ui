import * as stylex from '@stylexjs/stylex';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { container, fontSize, fontWeight, space, stroke } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

export default function ResizableVertical() {
  return (
    <div {...stylex.props(styles.frame)}>
      <ResizablePanelGroup orientation="vertical">
        <ResizablePanel defaultSize="30%" minSize="20%">
          <div {...stylex.props(styles.content)}>Header</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="70%" minSize="20%">
          <div {...stylex.props(styles.content)}>Content</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

const styles = stylex.create({
  frame: {
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    height: container.card,
    maxWidth: container.lg,
    overflow: 'hidden',
    width: '100%',
  },
  content: {
    alignItems: 'center',
    backgroundColor: colors.muted,
    color: colors.foreground,
    display: 'flex',
    fontFamily: font.sans,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    height: '100%',
    justifyContent: 'center',
    padding: space.s6,
  },
});
