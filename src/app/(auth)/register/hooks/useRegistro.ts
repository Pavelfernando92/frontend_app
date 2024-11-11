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
  invitationCode?: string; // Added invitation code field
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
    invitationCode: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [responseRequest, setResponseRequest] = useState({
    error: false,
    msg: "",
  });

  // Function to validate birthdate (must be at least 18 years old)
  const validateBirthdate = (birthday: string): boolean => {
    const birthDate = new Date(birthday);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    // Adjust for cases where birth month/day hasn't occurred yet this year
    const isBirthdayPassed =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    return age > 18 || (age === 18 && isBirthdayPassed);
  };

  const registerUser = async (data: CreateUserType) => {
    setLoading(true);
    setResponseRequest({ error: false, msg: "" });

    try {
      const res = await lotussApi.post("/auth/register", data);
      setResponseRequest({
        error: false,
        msg: res.data.msg,
      });

      // Automatically log the user in after successful registration
      const resLogin = await signIn("credentials", {
        email: data.email,
        password: data.password,
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
