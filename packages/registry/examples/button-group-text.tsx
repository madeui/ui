import { Button } from '@/components/ui/button';
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '@/components/ui/button-group';

export default function ButtonGroupTextExample() {
  return (
    <ButtonGroup>
      <ButtonGroupText>Filter</ButtonGroupText>
      <ButtonGroupSeparator />
      <Button variant="outline">Open</Button>
      <Button variant="outline">Closed</Button>
      <Button variant="outline">All</Button>
    </ButtonGroup>
  );
}
