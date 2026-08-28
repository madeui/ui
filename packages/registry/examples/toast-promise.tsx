import { Button } from '@/components/ui/button';
import { toast, Toaster, ToastProvider } from '@/components/ui/toast';

function save() {
  return new Promise<void>((resolve) => setTimeout(resolve, 2000));
}

export default function ToastPromise() {
  return (
    <ToastProvider>
      <Button
        variant="outline"
        onClick={() =>
          toast.promise(save(), {
            loading: 'Saving…',
            success: 'Changes saved',
            error: 'Could not save',
          })
        }
      >
        Save with toast.promise
      </Button>
      <Toaster />
    </ToastProvider>
  );
}
