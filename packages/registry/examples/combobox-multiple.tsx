'use client';

import * as React from 'react';

import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
} from '@/components/ui/combobox';

const frameworks = ['Next.js', 'SvelteKit', 'Nuxt', 'Remix', 'Astro'];

export default function ComboboxMultiple() {
  const [value, setValue] = React.useState<string[]>(['Next.js']);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  return (
    <Combobox items={frameworks} multiple value={value} onValueChange={setValue}>
      <ComboboxChips ref={anchorRef}>
        <ComboboxValue>
          {(items: string[]) =>
            items.map((item) => <ComboboxChip key={item}>{item}</ComboboxChip>)
          }
        </ComboboxValue>
        <ComboboxChipsInput placeholder="Add framework…" />
      </ComboboxChips>
      <ComboboxContent anchor={anchorRef}>
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
