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
import { space } from '@/lib/constants.stylex';

export default function DialogScrollable() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>
        View terms
      </DialogTrigger>
      <DialogContent style={styles.content}>
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Last updated February 2026. Please read before continuing.
          </DialogDescription>
        </DialogHeader>
        <div {...stylex.props(styles.body)}>
          <p>
            1. Acceptance of terms. By accessing or using this service, you
            agree to be bound by these terms and all applicable laws and
            regulations.
          </p>
          <p>
            2. Use license. Permission is granted to temporarily use this
            service for personal, non-commercial purposes only. This is the
            grant of a license, not a transfer of title.
          </p>
          <p>
            3. Account responsibilities. You are responsible for maintaining
            the confidentiality of your account credentials and for all
            activity that occurs under your account.
          </p>
          <p>
            4. Service availability. We do not guarantee that the service
            will be uninterrupted, timely, secure, or error-free, and we
            reserve the right to modify or discontinue it at any time.
          </p>
          <p>
            5. Limitation of liability. In no event shall we be liable for
            any indirect, incidental, special, or consequential damages
            arising out of your use of the service.
          </p>
          <p>
            6. Changes to terms. We may revise these terms at any time. By
            continuing to use the service after changes take effect, you
            agree to the revised terms.
          </p>
          <p>
            7. Termination. We may suspend or terminate your access at any
            time, without notice, for conduct that violates these terms.
          </p>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="ghost" />}>Decline</DialogClose>
          <DialogClose render={<Button />}>Accept</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const styles = stylex.create({
  content: {
    maxHeight: `calc(100dvh - ${space.s16})`,
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    gap: space.s3,
    minHeight: 0,
    overflowY: 'auto',
  },
});
