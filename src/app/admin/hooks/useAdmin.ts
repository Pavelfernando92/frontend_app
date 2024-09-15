import lotussApi from "@/lib/axios";
import { useState } from "react";

const useAdmin = () => {
  const [totalUsers, setTotalUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const getTotalUsers = async () => {
    setLoading(true);
    try {
      const res = await lotussApi("/usuarios");
      setTotalUsers(res.data.length);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return {
    totalUsers,
    loading,
    getTotalUsers,
  };
};

export default useAdmin;
