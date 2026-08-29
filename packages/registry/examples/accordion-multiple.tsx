import * as stylex from '@stylexjs/stylex';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { container } from '@/lib/constants.stylex';

export default function AccordionMultiple() {
  return (
    <Accordion multiple defaultValue={['item-1', 'item-2']} style={styles.root}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Can I open more than one?</AccordionTrigger>
        <AccordionContent>
          Yes. Pass `multiple` to keep several items expanded at once.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is state still per-item?</AccordionTrigger>
        <AccordionContent>
          Yes. Each item tracks its own open state independently.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Can I set an initial selection?</AccordionTrigger>
        <AccordionContent>
          Yes, via `defaultValue` — an array of the values that start open.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

const styles = stylex.create({
  root: {
    maxWidth: container.lg,
  },
});
