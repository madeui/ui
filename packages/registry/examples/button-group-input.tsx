import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Input } from '@/components/ui/input';

export default function ButtonGroupInput() {
  return (
    <ButtonGroup>
      <Input type="email" placeholder="Email address" />
      <Button variant="outline">Subscribe</Button>
    </ButtonGroup>
  );
}
