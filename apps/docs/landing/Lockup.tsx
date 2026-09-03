import { WORDMARK_PATH } from './brand';

const VIEW_W = 99;
const VIEW_H = 28;

// The madeui lockup at any height: glyph (three placed squares and one
// snapping into its slot) plus the outlined Geist wordmark. Fitted by the
// glyph's true bounding box so it fills the full cell height.
export function Lockup({ height = 28 }: { height?: number }) {
  const width = Math.round((height * VIEW_W) / VIEW_H);
  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} width={width} height={height} aria-hidden>
      <Glyph />
      <g transform="translate(34,21) scale(0.185)" fill="currentColor">
        <path d={WORDMARK_PATH} />
      </g>
    </svg>
  );
}

// The glyph alone, drawn inside the lockup's 28-unit cell (0–28 wide).
function Glyph() {
  return (
    <g transform="scale(0.47417) translate(-6, 1.05)" fill="currentColor">
      <rect x="6" y="6" width="24" height="24" rx="7" />
      <rect x="6" y="34" width="24" height="24" rx="7" />
      <rect x="34" y="34" width="24" height="24" rx="7" />
      <rect
        x="38"
        y="2"
        width="24"
        height="24"
        rx="7"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeDasharray="5 4"
        strokeLinecap="round"
        transform="rotate(8 50 14)"
      />
    </g>
  );
}

// Stand-alone mark for the footer signature.
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox={`0 0 ${VIEW_H} ${VIEW_H}`} width={size} height={size} aria-hidden>
      <Glyph />
    </svg>
  );
}
