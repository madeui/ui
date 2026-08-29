import * as stylex from '@stylexjs/stylex';

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { space } from '@/lib/constants.stylex';

export default function PaginationIconsOnly() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" text="" style={styles.iconOnly} />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" text="" style={styles.iconOnly} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

const styles = stylex.create({
  iconOnly: {
    paddingInline: space.s2,
    width: space.s9,
  },
});
