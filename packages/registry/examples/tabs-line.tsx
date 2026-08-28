import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function TabsLine() {
  return (
    <Tabs defaultValue="overview">
      <TabsList variant="line">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="reports">Reports</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Overview of your project.</TabsContent>
      <TabsContent value="analytics">Traffic and usage.</TabsContent>
      <TabsContent value="reports">Exportable reports.</TabsContent>
    </Tabs>
  );
}
