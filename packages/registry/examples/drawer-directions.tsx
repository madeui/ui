import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
  type DrawerSwipeDirection,
} from '@/components/ui/drawer';
import { space } from '@/lib/constants.stylex';

const directions: DrawerSwipeDirection[] = ['up', 'right', 'down', 'left'];

export default function DrawerDirections() {
  return (
    <div {...stylex.props(styles.row)}>
      {directions.map((direction) => (
        <Drawer key={direction} swipeDirection={direction}>
          <DrawerTrigger render={<Button variant="outline" />}>
            {direction}
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Drawer from {direction}</DrawerTitle>
              <DrawerDescription>
                Rests on and swipes back toward the {direction} edge.
              </DrawerDescription>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
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
