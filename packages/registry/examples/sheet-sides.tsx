import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  type SheetSide,
} from '@/components/ui/sheet';
import { space } from '@/lib/constants.stylex';

const sides: SheetSide[] = ['top', 'right', 'bottom', 'left'];

export default function SheetSides() {
  return (
    <div {...stylex.props(styles.row)}>
      {sides.map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline" />}>
            {side}
          </SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Sheet from {side}</SheetTitle>
              <SheetDescription>
                Slides in from the {side} edge of the screen.
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}

const styles = stylex.create({
  row: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s2,
  },
});
