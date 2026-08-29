import { Button } from '@/components/ui/button';
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

export default function SheetNoCloseButton() {
  return (
    <Sheet>
      <SheetTrigger render={<Button variant="outline" />}>
        Open
      </SheetTrigger>
      <SheetContent showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>Publish changes</SheetTitle>
          <SheetDescription>
            Review your changes, then publish or discard them below.
          </SheetDescription>
        </SheetHeader>
        <SheetFooter>
          <SheetClose render={<Button />}>Publish</SheetClose>
          <SheetClose render={<Button variant="outline" />}>Discard</SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
