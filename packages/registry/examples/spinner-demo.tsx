import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function SpinnerDemo() {
  return (
    <Button disabled>
      <Spinner /> Loading…
    </Button>
  );
}
