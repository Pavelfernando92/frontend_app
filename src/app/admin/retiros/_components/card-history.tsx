import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Props = {
  withdrawalHistory: RetirosInterface[];
};

const CardHistory = ({ withdrawalHistory }: Props) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Historial de Retiros</CardTitle>
      </CardHeader>
      <CardContent>
        {withdrawalHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Monto</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {withdrawalHistory.map((retiro) => (
                  <TableRow key={retiro.id}>
                    <TableCell>
                      {new Date(retiro.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell>${retiro.quantity}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p>No hay historial de retiros para este usuario.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default CardHistory;
