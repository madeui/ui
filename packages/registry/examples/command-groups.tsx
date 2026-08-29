import * as React from 'react';

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

function CalendarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox={`0 0 16 16`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="3" width="12" height="11" rx="1.5" />
      <path d={`M2 6.5h12M5 1.5v3M11 1.5v3`} />
    </svg>
  );
}

function SmileIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox={`0 0 16 16`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="8" cy="8" r="6.5" />
      <path d={`M5.5 9.5c.6.8 1.4 1.2 2.5 1.2s1.9-.4 2.5-1.2`} />
      <path d={`M6 6h.01M10 6h.01`} />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox={`0 0 16 16`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="8" cy="5.5" r="2.5" />
      <path d={`M2.5 14c.8-2.8 3-4.5 5.5-4.5s4.7 1.7 5.5 4.5`} />
    </svg>
  );
}

function CardIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox={`0 0 16 16`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="1.5" y="4" width="13" height="9" rx="1.5" />
      <path d={`M1.5 7h13`} />
    </svg>
  );
}

const commandGroups = [
  {
    value: 'suggestions',
    label: 'Suggestions',
    items: [
      { value: 'calendar', label: 'Calendar', icon: <CalendarIcon /> },
      { value: 'search-emoji', label: 'Search emoji', icon: <SmileIcon /> },
    ],
  },
  {
    value: 'settings',
    label: 'Settings',
    items: [
      {
        value: 'profile',
        label: 'Profile',
        icon: <UserIcon />,
        shortcut: '⌘P',
      },
      { value: 'billing', label: 'Billing', icon: <CardIcon />, shortcut: '⌘B' },
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
