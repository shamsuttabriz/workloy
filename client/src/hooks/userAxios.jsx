import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `http://localhost:5001`,
});

const userAxios = () => {
  return axiosInstance;
};

export default userAxios;
