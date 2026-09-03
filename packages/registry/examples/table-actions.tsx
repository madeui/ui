import * as stylex from '@stylexjs/stylex';
import { EllipsisVertical } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { container } from '@/lib/constants.stylex';
import { icon } from '@/lib/stylex-utils';

const members = [
  { name: 'Ada Lovelace', role: 'Owner' },
  { name: 'Grace Hopper', role: 'Admin' },
  { name: 'Margaret Hamilton', role: 'Member' },
];

export default function TableActions() {
  return (
    <div {...stylex.props(styles.root)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead style={styles.right} />
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.name}>
              <TableCell>{member.name}</TableCell>
              <TableCell>{member.role}</TableCell>
              <TableCell style={styles.right}>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={<Button variant="ghost" size="icon" aria-label="Row actions" />}
                  >
                    <EllipsisVertical {...stylex.props(icon.md)} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Edit role</DropdownMenuItem>
                    <DropdownMenuItem>Copy email</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">Remove</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

const styles = stylex.create({
  root: {
    maxWidth: container.lg,
    width: '100%',
  },
  right: {
    textAlign: 'right',
  },
});
