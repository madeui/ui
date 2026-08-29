import * as stylex from '@stylexjs/stylex';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { space, container } from '@/lib/constants.stylex';

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox={`0 0 16 16`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <circle cx="8" cy="5" r="2.5" />
      <path d={`M3 13.5c0-2.5 2.2-4 5-4s5 1.5 5 4`} />
    </svg>
  );
}

function BellIcon() {
  return (
    <svg width="16" height="16" viewBox={`0 0 16 16`} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d={`M4 6.5a4 4 0 0 1 8 0c0 3 1 4 1 4H3s1-1 1-4Z`} />
      <path d={`M6.5 12.5a1.5 1.5 0 0 0 3 0`} />
    </svg>
  );
}

export default function TabsIcons() {
  return (
    <Tabs defaultValue="account" style={styles.tabs}>
      <TabsList>
        <TabsTrigger value="account" style={styles.trigger}>
          <UserIcon />
          Account
        </TabsTrigger>
        <TabsTrigger value="notifications" style={styles.trigger}>
          <BellIcon />
          Notifications
        </TabsTrigger>
      </TabsList>
      <TabsContent value="account">Update your account settings.</TabsContent>
      <TabsContent value="notifications">Manage notification preferences.</TabsContent>
    </Tabs>
  );
}

const styles = stylex.create({
  tabs: {
    width: container.lg,
  },
  trigger: {
    alignItems: 'center',
    display: 'inline-flex',
    gap: space.s15,
  },
});
