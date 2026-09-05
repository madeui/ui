import * as stylex from '@stylexjs/stylex';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { container, fontSize, fontWeight, space, stroke } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

export default function ResizableNested() {
  return (
    <div {...stylex.props(styles.frame)}>
      <ResizablePanelGroup>
        <ResizablePanel defaultSize="50%" minSize="20%">
          <div {...stylex.props(styles.content)}>One</div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="50%" minSize="20%">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="25%" minSize="20%">
              <div {...stylex.props(styles.content)}>Two</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="75%" minSize="20%">
              <div {...stylex.props(styles.content)}>Three</div>
            </ResizablePanel>
          </ResizablePanelGroup>
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
