import Link from "next/link";
import { Button } from "@/components/ui/button";
import { UserPlus, LogIn } from "lucide-react";
import { useLoginStore } from "@/store/useLoginStore";

export default function AuthButtons() {
  const { setShowLogin } = useLoginStore();
  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center">
      <Link href="" className="w-full sm:w-auto">
        <Button
          className="w-full bg-burgundy hover:bg-burgundy/90 text-white py-6 px-8 text-lg flex items-center gap-2"
          onClick={() => setShowLogin(true)}
        >
          <LogIn className="h-5 w-5" />
          Acceder a mi cuenta
        </Button>
      </Link>
      <Link href="/register" className="w-full sm:w-auto">
        <Button
          variant="outline"
          className="w-full border-burgundy text-burgundy hover:bg-burgundy/10 py-6 px-8 text-lg flex items-center gap-2"
        >
          <UserPlus className="h-5 w-5" />
          Crear cuenta nueva
        </Button>
      </Link>
    </div>
  );
}
