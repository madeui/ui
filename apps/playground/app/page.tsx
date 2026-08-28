'use client';

import { useEffect, useState } from 'react';

import * as stylex from '@stylexjs/stylex';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Label } from '@/components/ui/label';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Progress,
  ProgressLabel,
  ProgressValue,
} from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Toggle } from '@/components/ui/toggle';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
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
import { space, fontSize, fontWeight, stroke, container } from '@/lib/constants.stylex';
import { colors, font, radius } from '@/lib/tokens.stylex';

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

        <section {...stylex.props(styles.row)} data-section="controls-2">
          <div {...stylex.props(styles.col)}>
            <Label>
              <Checkbox /> Label with checkbox
            </Label>
            <Slider defaultValue={40} />
            <Slider defaultValue={[20, 60]} />
            <Progress value={66} locale="en-US">
              <ProgressLabel>Uploading…</ProgressLabel>
              <ProgressValue />
            </Progress>
          </div>
          <div {...stylex.props(styles.col)}>
            <div {...stylex.props(styles.row)}>
              <Toggle aria-label="Toggle bold" defaultPressed>
                B
              </Toggle>
              <Toggle variant="outline" aria-label="Toggle italic">
                Italic
              </Toggle>
            </div>
            <ToggleGroup defaultValue={['b']}>
              <ToggleGroupItem value="a">Bold</ToggleGroupItem>
              <ToggleGroupItem value="b">Italic</ToggleGroupItem>
            </ToggleGroup>
            <ToggleGroup variant="outline" spacing="joined" defaultValue={['center']}>
              <ToggleGroupItem value="left">Left</ToggleGroupItem>
              <ToggleGroupItem value="center">Center</ToggleGroupItem>
              <ToggleGroupItem value="right">Right</ToggleGroupItem>
            </ToggleGroup>
            <div {...stylex.props(styles.row)}>
              <Skeleton style={styles.skeletonCircle} />
              <div {...stylex.props(styles.colSmall)}>
                <Skeleton style={styles.skeletonLine} />
                <Skeleton style={styles.skeletonLineShort} />
              </div>
            </div>
          </div>
        </section>

        <section {...stylex.props(styles.row)} data-section="navigation">
          <div {...stylex.props(styles.col)}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="#">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbEllipsis />
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <Separator />
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </section>

        <section {...stylex.props(styles.row)} data-section="overlays-2">
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="outline" />}>
              Alert dialog
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogCancel variant="destructive">
                  Delete
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Sheet>
            <SheetTrigger render={<Button variant="outline" />}>
              Open sheet
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit profile</SheetTitle>
                <SheetDescription>
                  Make changes to your profile here.
                </SheetDescription>
              </SheetHeader>
              <SheetFooter>
                <SheetClose render={<Button />}>Save changes</SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>

          <HoverCard>
            <HoverCardTrigger render={<Button variant="ghost" />}>
              @ui-lib
            </HoverCardTrigger>
            <HoverCardContent>
              Base UI + StyleX components you own.
            </HoverCardContent>
          </HoverCard>
        </section>

        <section {...stylex.props(styles.row)} data-section="display-2">
          <div {...stylex.props(styles.col)}>
            <Accordion multiple={false} defaultValue={['a']}>
              <AccordionItem value="a">
                <AccordionTrigger>Is it accessible?</AccordionTrigger>
                <AccordionContent>
                  Yes. It adheres to the WAI-ARIA design pattern.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="b">
                <AccordionTrigger>Is it styled?</AccordionTrigger>
                <AccordionContent>
                  Yes. It matches the other components.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            <Collapsible defaultOpen>
              <CollapsibleTrigger render={<Button variant="ghost" size="sm" />}>
                Toggle repositories
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div {...stylex.props(styles.colSmall)}>
                  <span>@base-ui/react</span>
                  <span>@stylexjs/stylex</span>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
          <div {...stylex.props(styles.col)}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>INV001</TableCell>
                  <TableCell>Paid</TableCell>
                  <TableCell>$250.00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>INV002</TableCell>
                  <TableCell>Pending</TableCell>
                  <TableCell>$150.00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <ScrollArea style={styles.scrollArea}>
              <div {...stylex.props(styles.colSmall)}>
                {Array.from({ length: 20 }, (_, i) => (
                  <span key={i}>v1.2.0-beta.{20 - i}</span>
                ))}
              </div>
            </ScrollArea>
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
  colSmall: {
    display: 'flex',
    flexDirection: 'column',
    fontSize: fontSize.sm,
    gap: space.s2,
  },
  skeletonCircle: {
    borderRadius: radius.full,
    height: space.s10,
    width: space.s10,
  },
  skeletonLine: {
    height: space.s3,
    width: container.xs,
  },
  skeletonLineShort: {
    height: space.s3,
    width: space.s16,
  },
  scrollArea: {
    borderColor: colors.border,
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: stroke.border,
    height: container.xs,
    padding: space.s3,
    width: container.xs,
  },
});
