import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: `https://server-seven-tau-43.vercel.app`,
  baseURL: `http://localhost:5001`,
});

const userAxios = () => {
  return axiosInstance;
};

export default userAxios;
