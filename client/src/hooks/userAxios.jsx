import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `https://workloy-server.vercel.app`,
  // baseURL: `http://localhost:5001`,
});

const userAxios = () => {
  return axiosInstance;
};

export default userAxios;
