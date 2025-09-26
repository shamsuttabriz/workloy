import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";
import LoadingPage from "../pages/shared/LoadingPage";

const useDbUser = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { isLoading, data: userInfo = {} } = useQuery({
    queryKey: ["users", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user?.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  return userInfo;
};

export default useDbUser;
