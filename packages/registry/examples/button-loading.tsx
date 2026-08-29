import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export default function ButtonLoading() {
  return (
    <Button disabled>
      <Spinner />
      Please wait
    </Button>
  );
}
