import { Button } from '@/components/ui/button';
import { Toaster, ToastProvider, useToast } from '@/components/ui/toast';

function DemoButton() {
  const toast = useToast();
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.add({
          title: 'Scheduled: Catch up',
          description: 'Friday, February 10 at 5:57 PM',
        })
      }
    >
      Show toast
    </Button>
  );
}

export default function ToastDemo() {
  return (
    <ToastProvider>
      <DemoButton />
      <Toaster />
    </ToastProvider>
  );
}
