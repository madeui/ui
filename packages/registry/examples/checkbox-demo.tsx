import { Checkbox } from '@/components/ui/checkbox';

export default function CheckboxDemo() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, padding: 16 }}>
      <label style={{ alignItems: 'center', display: 'flex', fontFamily: 'system-ui', fontSize: 14, gap: 8 }}>
        <Checkbox defaultChecked /> Accept terms and conditions
      </label>
      <label style={{ alignItems: 'center', display: 'flex', fontFamily: 'system-ui', fontSize: 14, gap: 8, opacity: 0.5 }}>
        <Checkbox disabled /> Disabled
      </label>
    </div>
  );
}
