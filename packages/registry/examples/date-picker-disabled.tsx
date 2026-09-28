import {
  DatePicker,
  DatePickerContent,
  DatePickerTrigger,
} from '@/components/ui/date-picker';

export default function DatePickerDisabled() {
  // A fixed day rather than today, so the server and the browser render the same date.
  return (
    <DatePicker
      disabled
      defaultValue={new Date(new Date().getFullYear(), 0, 12)}
    >
      <DatePickerTrigger />
      <DatePickerContent />
    </DatePicker>
  );
}
