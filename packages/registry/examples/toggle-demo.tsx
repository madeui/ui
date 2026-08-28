import { Toggle } from '@/components/ui/toggle';

export default function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bold">
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
        <path d={`M4 2.5h5a2.75 2.75 0 0 1 0 5.5H4zM4 8h5.75a2.75 2.75 0 0 1 0 5.5H4z`} />
      </svg>
    </Toggle>
  );
}
