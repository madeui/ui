import { Switch } from '@/components/ui/switch';

export default function SwitchDemo() {
  return (
    <label style={{ alignItems: 'center', display: 'flex', fontFamily: 'system-ui', fontSize: 14, gap: 8, padding: 16 }}>
      <Switch defaultChecked /> Airplane mode
    </label>
  );
}
