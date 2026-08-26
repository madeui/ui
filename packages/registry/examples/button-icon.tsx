import { Button } from '@/components/ui/button';

export default function ButtonIcon() {
  return (
    <Button size="icon" variant="outline" aria-label="Add">
      <svg width="16" height="16" viewBox={`0 0 16 16`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden>
        <path d={`M8 3v10M3 8h10`} />
      </svg>
    </Button>
  );
}
