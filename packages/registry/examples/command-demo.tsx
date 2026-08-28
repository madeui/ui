import * as stylex from '@stylexjs/stylex';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { ring } from '@/lib/stylex-utils';
import { container } from '@/lib/constants.stylex';
import { shadow } from '@/lib/tokens.stylex';

const commands = [
  { value: 'calendar', label: 'Calendar', group: 'Suggestions' },
  { value: 'search-emoji', label: 'Search emoji', group: 'Suggestions' },
  { value: 'calculator', label: 'Calculator', group: 'Suggestions' },
  { value: 'profile', label: 'Profile', group: 'Settings', shortcut: '⌘P' },
  { value: 'billing', label: 'Billing', group: 'Settings', shortcut: '⌘B' },
  { value: 'settings', label: 'Settings', group: 'Settings', shortcut: '⌘S' },
];

type CommandEntry = (typeof commands)[number];

export default function CommandDemo() {
  return (
    <Command
      items={commands}
      itemToStringLabel={(item: CommandEntry) => item.label}
      style={[styles.root, ring({ shadow: shadow.md })]}
    >
      <CommandInput placeholder="Type a command or search…" />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {(item: CommandEntry) => (
          <CommandItem key={item.value} value={item}>
            {item.label}
            {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
          </CommandItem>
        )}
      </CommandList>
    </Command>
  );
}

const styles = stylex.create({
  root: {
    maxWidth: container.lg,
  },
});
