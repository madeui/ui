import * as stylex from '@stylexjs/stylex';

import { container } from '@/lib/constants.stylex';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

export default function DialogCustom() {
  return (
    <Dialog>
      <DialogTrigger render={<Button />}>Rename</DialogTrigger>
      <DialogContent style={styles.narrow}>
        <DialogHeader>
          <DialogTitle>Rename project</DialogTitle>
          <DialogDescription>Give your project a new name.</DialogDescription>
        </DialogHeader>
        <Input defaultValue="madeui" />
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
          <DialogClose render={<Button />}>Save</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const styles = stylex.create({
  narrow: {
    width: container.md,
  },
});
