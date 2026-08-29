import { Item, ItemContent, ItemDescription, ItemMedia, ItemTitle } from '@/components/ui/item';

// The `render` prop swaps the underlying element — here an <a>, so hover and
// focus states apply to the anchor.
export default function ItemLink() {
  return (
    <Item variant="outline" render={<a href="#dashboard" />}>
      <ItemMedia variant="icon">
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
          <path d={`M2 6.5 8 2l6 4.5v6.5a1 1 0 0 1-1 1h-2.5v-4h-5v4H4a1 1 0 0 1-1-1z`} />
        </svg>
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Dashboard</ItemTitle>
        <ItemDescription>Overview of your account and activity.</ItemDescription>
      </ItemContent>
    </Item>
  );
}
