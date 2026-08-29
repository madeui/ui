import * as stylex from '@stylexjs/stylex';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { container } from '@/lib/constants.stylex';

export default function AccordionDemo() {
  return (
    <Accordion multiple={false} style={styles.root}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that match the other components.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It animates open with the panel height from Base UI.
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
