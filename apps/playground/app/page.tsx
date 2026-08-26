'use client';

import { useEffect, useState } from 'react';

import * as stylex from '@stylexjs/stylex';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Toaster, ToastProvider, useToast } from '@/components/ui/toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { darkTheme } from '@/lib/themes';
import { space, fontSize, fontWeight, container } from '@/lib/constants.stylex';
import { colors, font } from '@/lib/tokens.stylex';

const fruits = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
];

function ToastButton() {
  const toast = useToast();
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.add({ title: 'Saved', description: 'Your changes were saved.' })
      }
    >
      Show toast
    </Button>
  );
}

export default function Home() {
  const [dark, setDark] = useState(false);

  // Theme goes on <html>, not a wrapper: dialogs/popovers portal to <body>,
  // and a subtree theme would not reach them.
  useEffect(() => {
    const { className } = stylex.props(dark && darkTheme);
    document.documentElement.className = className ?? '';
  }, [dark]);

  return (
    <ToastProvider>
      <main {...stylex.props(styles.page)}>
        <div {...stylex.props(styles.headerRow)}>
          <h1 {...stylex.props(styles.heading)}>ui-lib playground</h1>
          <Button variant="secondary" onClick={() => setDark(!dark)}>
            {dark ? 'Light mode' : 'Dark mode'}
          </Button>
        </div>

        <section {...stylex.props(styles.row)} data-section="buttons">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button disabled>Disabled</Button>
          <Badge>Badge</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </section>

        <section {...stylex.props(styles.row)} data-section="forms">
          <div {...stylex.props(styles.col)}>
            <Input placeholder="Email" />
            <Textarea placeholder="Your message" />
            <Select items={fruits}>
              <SelectTrigger>
                <SelectValue placeholder="Select a fruit" />
              </SelectTrigger>
              <SelectContent>
                {fruits.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div {...stylex.props(styles.col)}>
            <label {...stylex.props(styles.label)}>
              <Checkbox defaultChecked /> Accept terms
            </label>
            <label {...stylex.props(styles.label)}>
              <Switch defaultChecked /> Airplane mode
            </label>
            <RadioGroup defaultValue="b">
              <label {...stylex.props(styles.label)}>
                <RadioGroupItem value="a" /> Option A
              </label>
              <label {...stylex.props(styles.label)}>
                <RadioGroupItem value="b" /> Option B
              </label>
            </RadioGroup>
          </div>
        </section>

        <section {...stylex.props(styles.row)} data-section="overlays">
          <Dialog>
            <DialogTrigger render={<Button variant="outline" />}>
              Open dialog
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete project</DialogTitle>
                <DialogDescription>
                  This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose render={<Button variant="ghost" />}>
                  Cancel
                </DialogClose>
                <DialogClose render={<Button variant="destructive" />}>
                  Delete
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Popover>
            <PopoverTrigger render={<Button variant="outline" />}>
              Open popover
            </PopoverTrigger>
            <PopoverContent>Popover content with details.</PopoverContent>
          </Popover>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Open menu
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My account</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline" />}>
                Hover me
              </TooltipTrigger>
              <TooltipContent>Tooltip text</TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <ToastButton />
        </section>

        <section {...stylex.props(styles.row)} data-section="display">
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle>Create project</CardTitle>
              <CardDescription>Deploy in one click.</CardDescription>
            </CardHeader>
            <CardContent>
              <Input placeholder="Project name" />
            </CardContent>
            <CardFooter>
              <Button>Deploy</Button>
            </CardFooter>
          </Card>

          <div {...stylex.props(styles.col)}>
            <Alert>
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>Components install via CLI.</AlertDescription>
            </Alert>
            <div {...stylex.props(styles.row)}>
              <Avatar>
                <AvatarImage src="https://github.com/madeui.png" alt="avatar" />
                <AvatarFallback>MD</AvatarFallback>
              </Avatar>
              <Avatar size="lg">
                <AvatarFallback>UI</AvatarFallback>
              </Avatar>
            </div>
            <Tabs defaultValue="account">
              <TabsList>
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
              </TabsList>
              <TabsContent value="account">Account settings.</TabsContent>
              <TabsContent value="password">Password settings.</TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Toaster />
    </ToastProvider>
  );
}

const styles = stylex.create({
  page: {
    backgroundColor: colors.background,
    color: colors.foreground,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: space.s8,
    minHeight: '100vh',
    padding: space.s12,
  },
  headerRow: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
  },
  heading: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    margin: 0,
  },
  row: {
    alignItems: 'flex-start',
    display: 'flex',
    flexWrap: 'wrap',
    gap: space.s3,
  },
  col: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.s3,
    minWidth: container.sm,
  },
  label: {
    alignItems: 'center',
    display: 'flex',
    fontSize: fontSize.sm,
    gap: space.s2,
  },
  card: {
    maxWidth: container.md,
  },
});
