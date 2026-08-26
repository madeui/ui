import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export default function PopoverDemo() {
  return (
    <div style={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'center', minHeight: 320, padding: 16 }}>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Open popover
        </PopoverTrigger>
        <PopoverContent>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <strong style={{ fontSize: 14 }}>Dimensions</strong>
            <Input placeholder="Width" defaultValue="100%" />
            <Input placeholder="Height" defaultValue="25px" />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
