import axios from "axios";
import useAuth from "./useAuth";

const axiosSecure = axios.create({
  baseURL: `http://localhost:5001`,
});

const useAxiosSecure = () => {
  const { user } = useAuth();

  axiosSecure.interceptors.request.use(
    (config) => {
      config.headers.Authorization = `Bearer ${user.accessToken}`;

      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  return axiosSecure;
};

export default useAxiosSecure;
