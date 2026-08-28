import * as stylex from '@stylexjs/stylex';

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { container } from '@/lib/constants.stylex';

const invoices = [
  { invoice: 'INV001', status: 'Paid', method: 'Credit card', amount: '$250.00' },
  { invoice: 'INV002', status: 'Pending', method: 'PayPal', amount: '$150.00' },
  { invoice: 'INV003', status: 'Unpaid', method: 'Bank transfer', amount: '$350.00' },
  { invoice: 'INV004', status: 'Paid', method: 'Credit card', amount: '$450.00' },
];

export default function TableDemo() {
  return (
    <div {...stylex.props(styles.root)}>
      <Table>
        <TableCaption>A list of your recent invoices.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead style={styles.right}>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((row) => (
            <TableRow key={row.invoice}>
              <TableCell>{row.invoice}</TableCell>
              <TableCell>{row.status}</TableCell>
              <TableCell>{row.method}</TableCell>
              <TableCell style={styles.right}>{row.amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell style={styles.right}>$1,200.00</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

const styles = stylex.create({
  root: {
    maxWidth: container.xl,
    width: '100%',
  },
  right: {
    textAlign: 'right',
  },
});
