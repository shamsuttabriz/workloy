import React from "react";
import Navbar from "../pages/shared/Navbar";
import { Outlet } from "react-router";
import Footer from "../pages/shared/Footer";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mt-24 mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-332px)]">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;
