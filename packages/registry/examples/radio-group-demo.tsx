import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function RadioGroupDemo() {
  return (
    <div style={{ padding: 16 }}>
      <RadioGroup defaultValue="comfortable">
        {['default', 'comfortable', 'compact'].map((value) => (
          <label
            key={value}
            style={{ alignItems: 'center', display: 'flex', fontFamily: 'system-ui', fontSize: 14, gap: 8, textTransform: 'capitalize' }}
          >
            <RadioGroupItem value={value} /> {value}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}
