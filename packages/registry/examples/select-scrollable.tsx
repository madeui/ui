import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const timezones = [
  'UTC-08:00 Pacific', 'UTC-07:00 Mountain', 'UTC-06:00 Central',
  'UTC-05:00 Eastern', 'UTC-03:00 Buenos Aires', 'UTC+00:00 London',
  'UTC+01:00 Paris', 'UTC+02:00 Athens', 'UTC+03:00 Istanbul',
  'UTC+04:00 Dubai', 'UTC+05:30 Mumbai', 'UTC+07:00 Bangkok',
  'UTC+08:00 Singapore', 'UTC+09:00 Tokyo', 'UTC+10:00 Sydney',
  'UTC+12:00 Auckland',
].map((label) => ({ label, value: label }));

export default function SelectScrollable() {
  return (
    <Select items={timezones}>
      <SelectTrigger>
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        {timezones.map(({ label, value }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
