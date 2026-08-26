import { Button } from '@/components/ui/button';
import { Toaster, ToastProvider, useToast } from '@/components/ui/toast';

function DemoButton() {
  const toast = useToast();
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.add({
          title: 'Sticky toast',
          description: 'Stays for 10 seconds.',
          timeout: 10000,
        })
      }
    >
      Show sticky toast
    </Button>
  );
}

export default function ToastDuration() {
  return (
    <ToastProvider>
      <DemoButton />
      <Toaster />
    </ToastProvider>
  );
}
