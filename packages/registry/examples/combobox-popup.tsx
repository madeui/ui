import * as stylex from '@stylexjs/stylex';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
  ComboboxValue,
} from '@/components/ui/combobox';
import { space } from '@/lib/constants.stylex';

const fruits = ['Apple', 'Banana', 'Cherry', 'Mango', 'Peach'];

export default function ComboboxPopup() {
  return (
    <Combobox items={fruits}>
      <ComboboxTrigger>
        <ComboboxValue placeholder="Select a fruit" />
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput
          showTrigger={false}
          placeholder="Search fruit…"
          style={styles.input}
        />
        <ComboboxEmpty>No fruit found.</ComboboxEmpty>
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

const styles = stylex.create({
  input: {
    paddingBlock: space.s1,
    paddingInline: space.s1,
    width: '100%',
  },
});
