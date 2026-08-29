import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

const fruits = [
  'Apple', 'Apricot', 'Banana', 'Blackberry', 'Blueberry', 'Cantaloupe',
  'Cherry', 'Clementine', 'Coconut', 'Cranberry', 'Date', 'Dragonfruit',
  'Elderberry', 'Fig', 'Grape', 'Grapefruit', 'Guava', 'Honeydew', 'Kiwi',
  'Lemon', 'Lime', 'Lychee', 'Mango', 'Mandarin', 'Nectarine', 'Orange',
  'Papaya', 'Passionfruit', 'Peach', 'Pear', 'Persimmon', 'Pineapple',
  'Plum', 'Pomegranate', 'Raspberry', 'Star fruit', 'Strawberry',
  'Tangerine', 'Watermelon',
].map((label) => ({ label, value: label }));

export default function CommandScrollable() {
  return (
    <Command items={fruits} itemToStringLabel={(item) => item.label}>
      <CommandInput placeholder="Search fruit…" />
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandList>
        {(item: (typeof fruits)[number]) => (
          <CommandItem key={item.value} value={item}>
            {item.label}
          </CommandItem>
        )}
      </CommandList>
    </Command>
  );
}
