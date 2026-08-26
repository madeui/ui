import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const plans = [
  { label: 'Free', value: 'free' },
  { label: 'Pro', value: 'pro' },
  { label: 'Enterprise (contact us)', value: 'enterprise', disabled: true },
];

export default function SelectDisabled() {
  return (
    <div style={{ alignItems: 'flex-start', display: 'flex', justifyContent: 'center', minHeight: 280, padding: 16 }}>
      <Select items={plans} defaultValue="pro">
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {plans.map(({ label, value, disabled }) => (
            <SelectItem key={value} value={value} disabled={disabled}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
