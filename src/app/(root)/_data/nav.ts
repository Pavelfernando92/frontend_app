// data.ts
import { UserRoleEnum } from "@/enums/user.enums";

interface LinksInterface {
  name: string;
  path: string;
  roles: UserRoleEnum[];
}

export const navigationLinks: LinksInterface[] = [
  {
    name: "Inicio",
    path: "/",
    roles: [UserRoleEnum.USER, UserRoleEnum.ADMIN, UserRoleEnum.AMBASSADOR], // Usa el enum para los roles
  },
  {
    name: "Jugar",
    path: "/game",
    roles: [UserRoleEnum.USER, UserRoleEnum.ADMIN, UserRoleEnum.AMBASSADOR],
  },
  {
    name: "Ver Perfil",
    path: "/perfil",
    roles: [UserRoleEnum.USER, UserRoleEnum.ADMIN, UserRoleEnum.AMBASSADOR],
  },
  {
    name: "Dashboard",
    path: "/admin",
    roles: [UserRoleEnum.ADMIN], // Solo ADMIN
  },
  {
    name: "Dashboard Embajadores",
    path: "/embajadores",
    roles: [UserRoleEnum.AMBASSADOR], // Solo AMBASSADOR
  },
];
