import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function AvatarDemo() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/madeui.png" alt="@madeui" />
      <AvatarFallback>MD</AvatarFallback>
    </Avatar>
  );
}
