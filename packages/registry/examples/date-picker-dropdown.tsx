import {
  DatePicker,
  DatePickerContent,
  DatePickerTrigger,
} from '@/components/ui/date-picker';

export default function DatePickerDropdown() {
  return (
    <DatePicker placeholder="Date of birth">
      <DatePickerTrigger />
      <DatePickerContent
        captionLayout="dropdown"
        defaultMonth={new Date(1990, 0)}
        startMonth={new Date(1930, 0)}
        endMonth={new Date()}
      />
    </DatePicker>
  );
}
