'use client';

import * as React from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Kbd, KbdGroup } from '@/components/ui/kbd';
import { useHotkey } from '@/lib/use-hotkey';

const commands = [
  { value: 'calendar', label: 'Calendar' },
  { value: 'search-emoji', label: 'Search emoji' },
  { value: 'calculator', label: 'Calculator' },
];

type CommandEntry = (typeof commands)[number];

export default function CommandDialogHotkey() {
  const [open, setOpen] = React.useState(false);
  useHotkey('k', () => setOpen((value) => !value));

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command
          items={commands}
          itemToStringLabel={(item: CommandEntry) => item.label}
        >
          <CommandInput placeholder="Type a command or search…" />
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandList>
            {(item: CommandEntry) => (
              <CommandItem
                key={item.value}
                value={item}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
