import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function CardDemo() {
  return (
    <div style={{ maxWidth: 360, padding: 16 }}>
      <Card>
        <CardHeader>
          <CardTitle>Create project</CardTitle>
          <CardDescription>Deploy your new project in one click.</CardDescription>
        </CardHeader>
        <CardContent>
          <Input placeholder="Project name" />
        </CardContent>
        <CardFooter>
          <Button>Deploy</Button>
          <Button variant="ghost">Cancel</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
