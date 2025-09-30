import React from "react";
import useUserRole from "../../../hooks/useUserRole";
import LoadingPage from "../../shared/LoadingPage";
import WorkerHome from "./WorkerHome";
import BuyerHome from "./BuyerHome";
import AdminHome from "./AdminHome";
import Forbidden from "../../Forbidden";

const DashboardHome = () => {
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <LoadingPage />;
  }

  if (role === "Worker") {
    return <WorkerHome />;
  } else if (role === "Buyer") {
    return <BuyerHome />;
  } else if (role === "Admin") {
    return <AdminHome />;
  } else {
    return <Forbidden />;
  }

};

export default DashboardHome;
