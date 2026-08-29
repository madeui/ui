import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '@/components/ui/avatar';

export default function AvatarGroupCountDemo() {
  return (
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://github.com/madeui.png" alt="@madeui" />
        <AvatarFallback>MD</AvatarFallback>
      </Avatar>
      <Avatar>
        <AvatarImage src="https://github.com/github.png" alt="@github" />
        <AvatarFallback>GH</AvatarFallback>
      </Avatar>
      <AvatarGroupCount>+3</AvatarGroupCount>
    </AvatarGroup>
  );
}
