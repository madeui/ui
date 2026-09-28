import * as stylex from '@stylexjs/stylex';
import { highlight } from 'fumadocs-core/highlight';

import { CodeBlock } from '@/components/site/code-block';
import { HydrateWhenVisible } from '@/components/site/hydrate-when-visible';
import { docs } from '@/components/site/site.stylex';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { fontSize, space, stroke } from '@/lib/constants.stylex';
import { colors, radius } from '@/lib/tokens.stylex';
import { hydratesWhenVisible, resolveExample } from '@/site/examples';
import { Example } from '@/site/examples.generated';
import { codeThemes } from '@/site/shiki';

/**
 * `<Component path="…" />` in the docs content: the Example live (Preview)
 * and its source (Code). The source comes from the Example source resolver
 * and is highlighted at build; the live Example loads through the generated
 * Example map, so the page pulls in only the Examples it renders. It renders
 * inline, not in an iframe, so portaled popups overlay the whole page.
 */
export async function ComponentPreview({ path }: { path: string }) {
  const example = resolveExample(path);
  if (!example) {
    return (
      <p {...stylex.props(styles.missing)}>
        No example found at <code>{path}</code>. Add it under <code>examples/</code> in your project.
      </p>
    );
  }

  const code = await highlight(example.source, {
    lang: example.lang,
    ...codeThemes,
    components: { pre: (props) => <CodeBlock {...props} flush /> },
  });

  const block = (
    <Tabs defaultValue="preview" data-example={path} style={styles.root}>
      <TabsList variant="line" style={styles.list}>
        <TabsTrigger value="preview" style={styles.trigger}>
          Preview
        </TabsTrigger>
        <TabsTrigger value="code" style={styles.trigger}>
          Code
        </TabsTrigger>
      </TabsList>
      {/* Both panels stay mounted while hidden: the Example keeps its state
          across tab switches, and the source is part of the page's HTML. */}
      <TabsContent value="preview" keepMounted style={[styles.panel, styles.preview]}>
        <Example path={path} />
      </TabsContent>
      <TabsContent value="code" keepMounted style={styles.panel}>
        {code}
      </TabsContent>
    </Tabs>
  );
  // A heavy Example's whole block hydrates when it nears the viewport; its
  // server HTML shows until then. The boundary sits above the Tabs so their
  // own updates at load can't reach it.
  return hydratesWhenVisible(example.source) ? <HydrateWhenVisible>{block}</HydrateWhenVisible> : block;
}

const styles = stylex.create({
  // Preview/Code line tabs in one bordered box: the tab row on top, the
  // panel below it.
  root: {
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    gap: 0,
    marginBlock: space.s6,
    overflow: 'hidden',
  },
  list: {
    gap: space.s4,
    paddingInline: space.s3,
    width: '100%',
  },
  trigger: {
    fontSize: fontSize.xs,
    paddingInline: space.s1,
  },
  panel: {
    minWidth: 0,
  },
  preview: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    minHeight: docs.previewMinHeight,
    paddingBlock: space.s10,
    paddingInline: space.s6,
  },
  missing: {
    borderColor: colors.border,
    borderRadius: radius.lg,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    color: colors.mutedForeground,
    marginBlock: space.s6,
    paddingBlock: space.s2,
    paddingInline: space.s3,
  },
});
