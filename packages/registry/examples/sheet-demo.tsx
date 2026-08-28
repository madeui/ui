import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { space } from '@/lib/constants.stylex';

export default function SheetDemo() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div {...stylex.props(styles.fields)}>
          <Label>
            Name <Input defaultValue="Pedro Duarte" />
          </Label>
          <Label>
            Username <Input defaultValue="@peduarte" />
          </Label>
        </div>
        <SheetFooter>
          <SheetClose render={<Button />}>Save changes</SheetClose>
          <SheetClose render={<Button variant="outline" />}>Close</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

const styles = stylex.create({
  fields: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s4,
    paddingInline: space.s4,
  },
});
