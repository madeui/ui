'use client';

import { useEffect, useState } from 'react';

import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { darkTheme } from '@/lib/themes';
import { colors, font } from '@/lib/tokens.stylex';

export default function Home() {
  const [dark, setDark] = useState(false);

  // Theme goes on <html>, not a wrapper: dialogs/popovers portal to <body>,
  // and a subtree theme would not reach them.
  useEffect(() => {
    const { className } = stylex.props(dark && darkTheme);
    document.documentElement.className = className ?? '';
  }, [dark]);

  return (
    <main {...stylex.props(styles.page)}>
      <h1 {...stylex.props(styles.heading)}>ui-lib playground</h1>

      <section {...stylex.props(styles.row)}>
        <Button>Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructive</Button>
        <Button disabled>Disabled</Button>
      </section>

      <section {...stylex.props(styles.row)}>
        <Button size="sm" variant="outline">
          Small
        </Button>
        <Button size="md" variant="outline">
          Medium
        </Button>
        <Button size="lg" variant="outline">
          Large
        </Button>
        {/* Per-instance override via the style prop — merged last, wins. */}
        <Button style={styles.pill}>Pill override</Button>
      </section>

      <section {...stylex.props(styles.row)}>
        <Dialog>
          <DialogTrigger render={<Button variant="outline" />}>
            Open dialog
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete project</DialogTitle>
              <DialogDescription>
                This action cannot be undone. The project and all of its data
                will be permanently removed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose render={<Button variant="ghost" />}>
                Cancel
              </DialogClose>
              <DialogClose render={<Button variant="destructive" />}>
                Delete
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="secondary" onClick={() => setDark(!dark)}>
          {dark ? 'Light mode' : 'Dark mode'}
        </Button>
      </section>
    </main>
  );
}

const styles = stylex.create({
  page: {
    backgroundColor: colors.background,
    color: colors.foreground,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: '1.5rem',
    minHeight: '100vh',
    padding: '3rem',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
  },
  row: {
    alignItems: 'center',
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
  },
  pill: {
    borderRadius: '9999px',
  },
});
