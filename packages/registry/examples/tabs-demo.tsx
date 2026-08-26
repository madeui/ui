import * as stylex from '@stylexjs/stylex';

import { container } from '@/lib/constants.stylex';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TabsDemo() {
  return (
    <Tabs defaultValue="account" style={styles.tabs}>
      <TabsList>
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="password">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        Make changes to your account here.
      </TabsContent>
      <TabsContent value="password">Change your password here.</TabsContent>
    </Tabs>
  );
}

const styles = stylex.create({
  tabs: {
    width: container.lg,
  },
});
