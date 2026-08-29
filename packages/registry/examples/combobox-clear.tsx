import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';

const frameworks = ['Next.js', 'SvelteKit', 'Nuxt', 'Remix', 'Astro'];

export default function ComboboxClear() {
  return (
    <Combobox items={frameworks} defaultValue="Next.js">
      <ComboboxInput showClear placeholder="Search framework…" />
      <ComboboxContent>
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
