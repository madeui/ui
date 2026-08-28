import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

export default function EmptyDemo() {
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
            <path d={`M2 5.5 8 2l6 3.5v5L8 14l-6-3.5z M8 8v6 M2 5.5 8 8l6-2.5`} />
          </svg>
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any projects. Get started by creating your first
          one.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button size="sm">Create project</Button>
      </EmptyContent>
    </Empty>
  );
}
