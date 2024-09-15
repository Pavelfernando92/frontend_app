import axios from "axios";
import { getSession } from "next-auth/react";

const lotussApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
});

lotussApi.interceptors.request.use(async (request) => {
  const session = await getSession();
  if (session) {
    request.headers.Authorization = `Bearer ${session.user.token}`;
  }
  return request;
});

export default lotussApi;
