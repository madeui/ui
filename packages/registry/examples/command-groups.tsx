import * as React from 'react';

import * as stylex from '@stylexjs/stylex';
import { Calendar, CreditCard, Smile, User } from 'lucide-react';

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command';
import { icon } from '@/lib/stylex-utils';

const commandGroups = [
  {
    value: 'suggestions',
    label: 'Suggestions',
    items: [
      { value: 'calendar', label: 'Calendar', icon: <Calendar {...stylex.props(icon.md)} /> },
      { value: 'search-emoji', label: 'Search emoji', icon: <Smile {...stylex.props(icon.md)} /> },
    ],
  },
  {
    value: 'settings',
    label: 'Settings',
    items: [
      {
        value: 'profile',
        label: 'Profile',
        icon: <User {...stylex.props(icon.md)} />,
        shortcut: '⌘P',
      },
      {
        value: 'billing',
        label: 'Billing',
        icon: <CreditCard {...stylex.props(icon.md)} />,
        shortcut: '⌘B',
      },
    ],
  },
];

export default function CommandGroups() {
  return (
    <Command items={commandGroups}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {(group: (typeof commandGroups)[number]) => (
          <React.Fragment key={group.value}>
            <CommandGroup heading={group.label}>
              {group.items.map((item) => (
                <CommandItem key={item.value} value={item}>
                  {item.icon}
                  {item.label}
                  {'shortcut' in item && item.shortcut && (
                    <CommandShortcut>{item.shortcut}</CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
            {group.value !==
              commandGroups[commandGroups.length - 1].value && (
              <CommandSeparator />
            )}
          </React.Fragment>
        )}
      </CommandList>
    </Command>
  );
}
