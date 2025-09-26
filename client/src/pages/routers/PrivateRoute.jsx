import React from "react";
import { Navigate, useLocation } from "react-router";
import LoadingPage from "../shared/LoadingPage";
import useAuth from "../../hooks/useAuth";

function PrivateRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingPage />;
  }

  if (!user) {
    return <Navigate  state={{from: location.pathname}}  to="/login" />;
  }

  return children;
}

export default PrivateRoute;
