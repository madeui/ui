import * as stylex from '@stylexjs/stylex';

import { space, fontSize, fontWeight } from '@/lib/constants.stylex';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Open popover
      </PopoverTrigger>
      <PopoverContent>
        <div {...stylex.props(styles.form)}>
          <strong {...stylex.props(styles.heading)}>Dimensions</strong>
          <Input placeholder="Width" defaultValue="100%" />
          <Input placeholder="Height" defaultValue="25px" />
        </div>
      </PopoverContent>
    </Popover>
  );
}

const styles = stylex.create({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s2,
  },
  heading: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
