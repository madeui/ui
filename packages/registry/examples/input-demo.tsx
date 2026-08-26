import { Input } from '@/components/ui/input';

export default function InputDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxWidth: 320, padding: 16 }}>
      <Input placeholder="Email" type="email" />
      <Input placeholder="Disabled" disabled />
    </div>
  );
}
