import React from "react";
import useAuth from "../../hooks/useAuth";
import LoadingPage from "../shared/LoadingPage";
import useUserRole from "../../hooks/useUserRole";
import { Navigate } from "react-router";

const AdminRoutes = ({children}) => {
  const { user, loading } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return <LoadingPage />;
  }

  if(!user || role !== 'Admin') {
    return <Navigate state={{from: location.pathname}} to="/forbidden"></Navigate>
  }

  return children;
};

export default AdminRoutes;
