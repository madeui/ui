import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
} from '@/components/ui/autocomplete';

const countries = [
  'Canada',
  'France',
  'Germany',
  'Italy',
  'Japan',
  'Norway',
  'Spain',
  'Turkey',
];

export default function AutocompleteAutoHighlight() {
  return (
    <Autocomplete items={countries} autoHighlight>
      <AutocompleteInput placeholder="Search countries…" />
      <AutocompleteContent>
        <AutocompleteEmpty>No countries found.</AutocompleteEmpty>
        <AutocompleteList>
          {(country: string) => (
            <AutocompleteItem key={country} value={country}>
              {country}
            </AutocompleteItem>
          )}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  );
}
