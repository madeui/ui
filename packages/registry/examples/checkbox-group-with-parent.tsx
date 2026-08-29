'use client';

import * as React from 'react';

import * as stylex from '@stylexjs/stylex';

import { Checkbox } from '@/components/ui/checkbox';
import { CheckboxGroup } from '@/components/ui/checkbox-group';
import { Label } from '@/components/ui/label';
import { space } from '@/lib/constants.stylex';

const notifications = ['comments', 'mentions', 'follows'];

export default function CheckboxGroupWithParent() {
  const [value, setValue] = React.useState<string[]>(['comments']);

  return (
    <CheckboxGroup
      value={value}
      onValueChange={setValue}
      allValues={notifications}
      aria-label="Notification preferences"
    >
      <Label>
        <Checkbox parent /> All notifications
      </Label>
      <Label style={styles.child}>
        <Checkbox name="comments" /> Comments
      </Label>
      <Label style={styles.child}>
        <Checkbox name="mentions" /> Mentions
      </Label>
      <Label style={styles.child}>
        <Checkbox name="follows" /> Follows
      </Label>
    </CheckboxGroup>
  );
}

const styles = stylex.create({
  child: {
    marginLeft: space.s6,
  },
});
