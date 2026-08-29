import { Toggle } from '@/components/ui/toggle';

export default function ToggleText() {
  return (
    <Toggle aria-label="Toggle italic">
      <svg
        width="16"
        height="16"
        viewBox={`0 0 16 16`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <path d={`M6.5 2.5h6M3.5 13.5h6M9.5 2.5l-3 11`} />
      </svg>
      Italic
    </Toggle>
  );
}
