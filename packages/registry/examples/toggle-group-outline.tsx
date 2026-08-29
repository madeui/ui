import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

export default function ToggleGroupOutline() {
  return (
    <ToggleGroup variant="outline" defaultValue={['left']}>
      <ToggleGroupItem value="left" aria-label="Align left">
        <svg
          width="16"
          height="16"
          viewBox={`0 0 16 16`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d={`M2 4h12M2 8h8M2 12h10`} />
        </svg>
      </ToggleGroupItem>
      <ToggleGroupItem value="center" aria-label="Align center">
        <svg
          width="16"
          height="16"
          viewBox={`0 0 16 16`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d={`M2 4h12M4 8h8M3 12h10`} />
        </svg>
      </ToggleGroupItem>
      <ToggleGroupItem value="right" aria-label="Align right">
        <svg
          width="16"
          height="16"
          viewBox={`0 0 16 16`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          aria-hidden
        >
          <path d={`M2 4h12M6 8h8M4 12h10`} />
        </svg>
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
