import * as stylex from '@stylexjs/stylex';

import { Button } from '@/components/ui/button';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/components/ui/popover';
import { space } from '@/lib/constants.stylex';

export default function PopoverForm() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>
        Edit profile
      </PopoverTrigger>
      <PopoverContent>
        <PopoverHeader>
          <PopoverTitle>Edit profile</PopoverTitle>
          <PopoverDescription>Update your display name and handle.</PopoverDescription>
        </PopoverHeader>
        <form {...stylex.props(styles.form)}>
          <Field>
            <FieldLabel htmlFor="popover-form-name">Name</FieldLabel>
            <Input id="popover-form-name" defaultValue="Evil Rabbit" />
          </Field>
          <Field>
            <FieldLabel htmlFor="popover-form-handle">Handle</FieldLabel>
            <Input id="popover-form-handle" defaultValue="@evilrabbit" />
          </Field>
          <Button type="submit" size="sm">
            Save
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}

const styles = stylex.create({
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
    marginTop: space.s4,
  },
});
