import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';

export default function EmptyInputGroup() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <svg
            width="16"
            height="16"
            viewBox={`0 0 16 16`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
          >
            <circle cx="7" cy="7" r="5" />
            <path d={`m13.5 13.5-3-3`} />
          </svg>
        </EmptyMedia>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          Try searching for a different keyword.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputGroup>
          <InputGroupInput placeholder="Search…" />
          <InputGroupAddon>
            <svg
              width="14"
              height="14"
              viewBox={`0 0 14 14`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              <circle cx="6" cy="6" r="4.5" />
              <path d={`m12 12-2.5-2.5`} />
            </svg>
          </InputGroupAddon>
        </InputGroup>
      </EmptyContent>
    </Empty>
  );
}
