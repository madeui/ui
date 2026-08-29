import * as stylex from '@stylexjs/stylex';

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

const members = [
  { name: 'Ada Lovelace', role: 'Owner' },
  { name: 'Grace Hopper', role: 'Admin' },
  { name: 'Margaret Hamilton', role: 'Member' },
];

function DotsIcon() {
  return (
    <svg width="16" height="16" viewBox={`0 0 16 16`} fill="currentColor" aria-hidden>
      <circle cx="8" cy="3" r="1.25" />
      <circle cx="8" cy="8" r="1.25" />
      <circle cx="8" cy="13" r="1.25" />
    </svg>
  );
}

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
                    <DotsIcon />
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
