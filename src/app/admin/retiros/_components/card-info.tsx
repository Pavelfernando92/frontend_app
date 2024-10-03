import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  user: User;
  handleWithdrawal: (e: React.FormEvent) => void;
  handleChangeWithDrawalAmount: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  withdrawalAmount: string;
};

const CardInfo = ({
  user,
  handleWithdrawal,
  handleChangeWithDrawalAmount,
  withdrawalAmount,
}: Props) => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Información del Usuario</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          <strong>Nombre:</strong> {user.nombre} {user.apellido_paterno}{" "}
          {user.apellido_materno}
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <span className="break-words">{user.email}</span>
        </p>
        <p>
          <strong>Teléfono:</strong> {user.telefono}
        </p>
        <p>
          <strong>Creditos:</strong> ${user.creditos}
        </p>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleWithdrawal} className="space-y-4 w-full">
          <div>
            <Label htmlFor="withdrawalAmount">Monto a retirar</Label>
            <Input
              id="withdrawalAmount"
              type="number"
              value={withdrawalAmount}
              onChange={handleChangeWithDrawalAmount}
              placeholder="Ingrese el monto a retirar"
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full sm:w-auto bg-[#800020] text-white"
          >
            Realizar Retiro
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};

export default CardInfo;
