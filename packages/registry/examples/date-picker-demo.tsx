import {
  DatePicker,
  DatePickerContent,
  DatePickerTrigger,
} from '@/components/ui/date-picker';

export default function DatePickerDemo() {
  return (
    <DatePicker>
      <DatePickerTrigger />
      <DatePickerContent />
    </DatePicker>
  );
}
