import lotussApi from "@/lib/axios";
import { AxiosError } from "axios";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

type CreateUserType = {
  email: string;
  password: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  telefono: string;
  birthday: string;
  aceptaTerminos: boolean;
};

const useRegistro = () => {
  const router = useRouter();

  const [formData, setFormData] = useState<CreateUserType>({
    email: "",
    password: "",
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    telefono: "",
    birthday: "",
    aceptaTerminos: false,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [responseRequest, setResponseRequest] = useState({
    error: false,
    msg: "",
  });

  const registerUser = async (formData: CreateUserType) => {
    setLoading(true);
    setResponseRequest({
      error: false,
      msg: "",
    });

    try {
      const res = await lotussApi.post("/auth/register", formData);
      setResponseRequest({
        error: false,
        msg: res.data.msg, // Este mensaje puede ser de éxito o de error de invitación
      });

      const resLogin = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (resLogin?.ok) router.push("/");
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        setResponseRequest({
          error: true,
          msg: error.response.data?.msg || "Ocurrió un error inesperado",
        });
      } else {
        setResponseRequest({
          error: true,
          msg: "Ocurrió un error inesperado",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const validateBirthdate = (birthday: string): boolean => {
    const birthDate = new Date(birthday);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const isBeforeBirthday =
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate());

    return age > 18 || (age === 18 && !isBeforeBirthday);
  };

  return {
    formData,
    loading,
    responseRequest,

    setFormData,
    validateBirthdate,
    registerUser,
  };
};

export default useRegistro;
