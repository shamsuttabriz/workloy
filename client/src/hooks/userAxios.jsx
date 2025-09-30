import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://server-seven-tau-43.vercel.app`,
});

const userAxios = () => {
  return axiosInstance;
};

export default userAxios;
