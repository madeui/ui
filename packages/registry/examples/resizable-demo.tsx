import * as stylex from '@stylexjs/stylex';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { container, fontSize, fontWeight, space, stroke } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

export default function ResizableDemo() {
  return (
    <div {...stylex.props(styles.frame)}>
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="50%" minSize="20%">
          <div {...stylex.props(styles.content)}>One</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="50%" minSize="20%">
          <div {...stylex.props(styles.content)}>Two</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

const styles = stylex.create({
  // The group fills its parent, so the frame sets the size and the edge.
  frame: {
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    height: container.xs,
    maxWidth: container.xl,
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
