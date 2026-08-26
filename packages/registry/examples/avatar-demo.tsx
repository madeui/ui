import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AvatarDemo() {
  return (
    <div style={{ alignItems: 'center', display: 'flex', gap: 12, padding: 16 }}>
      <Avatar>
        <AvatarImage src="https://github.com/madeui.png" alt="@madeui" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar size="lg">
        <AvatarFallback>UI</AvatarFallback>
      </Avatar>
    </div>
  );
}
