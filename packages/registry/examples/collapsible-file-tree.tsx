import * as React from 'react';

import * as stylex from '@stylexjs/stylex';
import { ChevronRight, File as FileIcon, Folder as FolderIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { space, fontSize, duration, stroke } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';
import { colors, font, radius } from '@/lib/tokens.stylex';

function Folder({
  name,
  defaultOpen,
  depth = 0,
  children,
}: {
  name: string;
  defaultOpen?: boolean;
  depth?: number;
  children: React.ReactNode;
}) {
  return (
    <Collapsible defaultOpen={defaultOpen}>
      <CollapsibleTrigger
        {...stylex.props(styles.row, indents.depth(depth))}
      >
        <ChevronRight {...stylex.props(icon.sm, styles.chevron)} />
        <FolderIcon {...stylex.props(icon.sm)} />
        <span>{name}</span>
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  );
}

function File({ name, depth = 1 }: { name: string; depth?: number }) {
  return (
    <div {...stylex.props(styles.row, styles.file, indents.depth(depth))}>
      <span {...stylex.props(styles.fileSpacer)} />
      <FileIcon {...stylex.props(icon.sm)} />
      <span>{name}</span>
    </div>
  );
}

export default function CollapsibleFileTree() {
  return (
    <div {...stylex.props(styles.tree)}>
      <Folder name="src" defaultOpen depth={0}>
        <Folder name="components" defaultOpen depth={1}>
          <File name="button.tsx" depth={2} />
          <File name="dialog.tsx" depth={2} />
        </Folder>
        <File name="index.ts" depth={1} />
      </Folder>
      <Folder name="public" depth={0}>
        <File name="favicon.ico" depth={1} />
      </Folder>
      <File name="package.json" depth={0} />
    </div>
  );
}

const styles = stylex.create({
  tree: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.mono,
    fontSize: fontSize.sm,
  },
  row: {
    alignItems: 'center',
    backgroundColor: {
      default: 'transparent',
      ':hover': colors.accent,
    },
    borderRadius: radius.sm,
    borderStyle: 'none',
    color: colors.foreground,
    cursor: 'pointer',
    display: 'flex',
    fontFamily: font.mono,
    fontSize: fontSize.sm,
    gap: space.s1,
    outline: {
      default: 'none',
      ':focus-visible': `${stroke.focus} solid ${colors.ring}`,
    },
    // Read by the chevron below — StyleX has no child selectors, so the
    // trigger's [data-panel-open] state travels via a custom property.
    '--file-tree-chevron-rotation': {
      default: null,
      '[data-panel-open]': '90deg',
    },
    paddingBlock: space.s1,
    paddingInline: space.s1,
    textAlign: 'left',
    width: '100%',
  },
  file: {
    color: colors.mutedForeground,
    cursor: 'default',
  },
  fileSpacer: {
    display: 'inline-block',
    width: space.s25,
  },
  chevron: {
    transform: 'rotate(var(--file-tree-chevron-rotation, 0deg))',
    transitionDuration: duration.fast,
    transitionProperty: 'transform',
  },
});

const indents = stylex.create({
  depth: (depth: number) => ({
    paddingLeft: `calc(${space.s4} * ${depth})`,
  }),
});
