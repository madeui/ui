import * as stylex from '@stylexjs/stylex';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { container } from '@/lib/constants.stylex';

export default function AccordionDisabled() {
  return (
    <Accordion multiple={false} style={styles.root}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Available plan</AccordionTrigger>
        <AccordionContent>
          This plan can be selected and configured.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2" disabled>
        <AccordionTrigger>Enterprise plan (disabled)</AccordionTrigger>
        <AccordionContent>
          Contact sales to unlock this plan.
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
