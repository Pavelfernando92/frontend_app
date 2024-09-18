import axios from "axios";

const lotussApi = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_BACKEND_URL}`,
});

export default lotussApi;
