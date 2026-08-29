import * as stylex from '@stylexjs/stylex';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { container } from '@/lib/constants.stylex';

const invoices = [
  { invoice: 'INV001', method: 'Credit card', amount: 250 },
  { invoice: 'INV002', method: 'PayPal', amount: 150 },
  { invoice: 'INV003', method: 'Bank transfer', amount: 350 },
];

const total = invoices.reduce((sum, row) => sum + row.amount, 0);

export default function TableFooterExample() {
  return (
    <div {...stylex.props(styles.root)}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Method</TableHead>
            <TableHead style={styles.right}>Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((row) => (
            <TableRow key={row.invoice}>
              <TableCell>{row.invoice}</TableCell>
              <TableCell>{row.method}</TableCell>
              <TableCell style={styles.right}>${row.amount.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell style={styles.right}>${total.toFixed(2)}</TableCell>
          </TableRow>
        </TableFooter>
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
