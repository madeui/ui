import * as stylex from '@stylexjs/stylex';
import { Bell, User } from 'lucide-react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { space, container } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';

export default function TabsIcons() {
  return (
    <Tabs defaultValue="account" style={styles.tabs}>
      <TabsList>
        <TabsTrigger value="account" style={styles.trigger}>
          <User {...stylex.props(icon.md)} />
          Account
        </TabsTrigger>
        <TabsTrigger value="notifications" style={styles.trigger}>
          <Bell {...stylex.props(icon.md)} />
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
