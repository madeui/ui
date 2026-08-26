import { Button } from '@/components/ui/button';

// The render prop swaps the underlying element — here an <a> styled as a button.
export default function ButtonAsLink() {
  return (
    <Button variant="outline" render={<a href="#docs" />} nativeButton={false}>
      Read the docs
    </Button>
  );
}
