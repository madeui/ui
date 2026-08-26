import * as stylex from '@stylexjs/stylex';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TabsDisabled() {
  return (
    <Tabs defaultValue="active" style={styles.tabs}>
      <TabsList>
        <TabsTrigger value="active">Active</TabsTrigger>
        <TabsTrigger value="disabled" disabled>
          Disabled
        </TabsTrigger>
      </TabsList>
      <TabsContent value="active">The other tab is disabled.</TabsContent>
    </Tabs>
  );
}

const styles = stylex.create({
  tabs: {
    width: '24rem',
  },
});
