import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// The fallback renders while the image loads — or when it fails.
export default function AvatarFallbackDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://example.com/broken.png" alt="Broken" />
      <AvatarFallback>UI</AvatarFallback>
    </Avatar>
  );
}
