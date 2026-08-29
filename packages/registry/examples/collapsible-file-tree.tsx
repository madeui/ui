import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { space, fontSize, duration, stroke } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

function ChevronIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox={`0 0 16 16`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...stylex.props(styles.chevron)}
    >
      <path d={`m6 3 5 5-5 5`} />
    </svg>
  );
}

function FolderIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox={`0 0 16 16`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={`M2 4.5A1.5 1.5 0 0 1 3.5 3h2.6l1.2 1.5H12.5A1.5 1.5 0 0 1 14 6v6a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12z`} />
    </svg>
  );
}

function FileIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox={`0 0 16 16`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={`M4 2h5l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z`} />
      <path d={`M9 2v3h3`} />
    </svg>
  );
}

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
        <ChevronIcon />
        <FolderIcon />
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
      <FileIcon />
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
    flexShrink: 0,
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
