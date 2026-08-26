import * as stylex from '@stylexjs/stylex';

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

const styles = stylex.create({
  narrow: { width: '22rem' },
});

export default function DialogCustom() {
  return (
    <div style={{ padding: 16 }}>
      <Dialog>
        <DialogTrigger render={<Button />}>Rename</DialogTrigger>
        <DialogContent style={styles.narrow}>
          <DialogHeader>
            <DialogTitle>Rename project</DialogTitle>
            <DialogDescription>Give your project a new name.</DialogDescription>
          </DialogHeader>
          <Input defaultValue="ui-lib" />
          <DialogFooter>
            <DialogClose render={<Button variant="ghost" />}>Cancel</DialogClose>
            <DialogClose render={<Button />}>Save</DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
