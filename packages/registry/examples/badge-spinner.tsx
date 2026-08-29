import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';

export default function BadgeSpinner() {
  return (
    <Badge variant="secondary">
      <Spinner width="12" height="12" />
      Syncing
    </Badge>
  );
}
