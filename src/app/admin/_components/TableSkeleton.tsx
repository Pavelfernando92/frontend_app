import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

const TableRowSkeleton = () => (
  <TableRow>
    <TableCell>
      <Skeleton className="h-4 w-[100px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[150px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[80px]" />
    </TableCell>
    <TableCell>
      <Skeleton className="h-4 w-[60px]" />
    </TableCell>
  </TableRow>
);

export default TableRowSkeleton;
