import {
  DatePicker,
  DatePickerContent,
  DatePickerTrigger,
} from '@/components/ui/date-picker';

export default function DatePickerDisabled() {
  return (
    <DatePicker disabled defaultValue={new Date()}>
      <DatePickerTrigger />
      <DatePickerContent />
    </DatePicker>
  );
}
