import { Badge } from '@/components/ui/badge';

export default function BadgeIcon() {
  return (
    <Badge variant="secondary">
      <svg width="12" height="12" viewBox={`0 0 12 12`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={`M10.5 3 4.5 9 1.5 6`} />
      </svg>
      Verified
    </Badge>
  );
}
