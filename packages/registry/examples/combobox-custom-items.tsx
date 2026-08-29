import * as stylex from '@stylexjs/stylex';

import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { fontSize } from '@/lib/constants.stylex';
import { colors } from '@/lib/tokens.stylex';

interface Framework {
  label: string;
  value: string;
  description: string;
}

const frameworks: Framework[] = [
  {
    label: 'Next.js',
    value: 'next',
    description: 'The React framework for the web',
  },
  {
    label: 'SvelteKit',
    value: 'sveltekit',
    description: 'Web development, streamlined',
  },
  {
    label: 'Nuxt',
    value: 'nuxt',
    description: 'The intuitive Vue framework',
  },
];

export default function ComboboxCustomItems() {
  return (
    <Combobox
      items={frameworks}
      itemToStringValue={(framework: Framework) => framework.label}
    >
      <ComboboxInput placeholder="Search framework…" />
      <ComboboxContent>
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(framework: Framework) => (
            <ComboboxItem key={framework.value} value={framework}>
              <div {...stylex.props(styles.row)}>
                <span {...stylex.props(styles.title)}>{framework.label}</span>
                <span {...stylex.props(styles.description)}>
                  {framework.description}
                </span>
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

const styles = stylex.create({
  row: {
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    fontSize: fontSize.sm,
  },
  description: {
    color: colors.mutedForeground,
    fontSize: fontSize.xs,
  },
});
