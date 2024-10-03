import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      email: string;
      token: string;
      id: number;
      role: string;
      nombre: string;
      apellido_paterno: string;
      apellido_paterno: string;
      telefono: string;
      profilePicture: string;
    };
  }
}
