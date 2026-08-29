import { Badge } from '@/components/ui/badge';

export default function BadgeLink() {
  return (
    <Badge variant="secondary" render={<a href="#" />}>
      New release
    </Badge>
  );
}
