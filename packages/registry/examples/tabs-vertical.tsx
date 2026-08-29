import * as stylex from '@stylexjs/stylex';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { container } from '@/lib/constants.stylex';

export default function TabsVertical() {
  return (
    <Tabs defaultValue="profile" orientation="vertical" style={styles.tabs}>
      <TabsList>
        <TabsTrigger value="profile">Profile</TabsTrigger>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
      </TabsList>
      <TabsContent value="profile">Update your name and photo.</TabsContent>
      <TabsContent value="account">Manage your account details.</TabsContent>
      <TabsContent value="notifications">Choose what you're notified about.</TabsContent>
    </Tabs>
  );
}

const styles = stylex.create({
  tabs: {
    width: container.lg,
  },
});
