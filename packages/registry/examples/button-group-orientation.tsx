import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';

export default function ButtonGroupOrientation() {
  return (
    <ButtonGroup orientation="vertical">
      <Button variant="outline">Archive</Button>
      <Button variant="outline">Report</Button>
      <Button variant="outline">Snooze</Button>
    </ButtonGroup>
  );
}
