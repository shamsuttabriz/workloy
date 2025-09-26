import React from "react";
import { Link, Outlet } from "react-router";
import AuthImage from "../assets/authImage.png";
import Logo from "../pages/shared/Logo";

function AuthLayout() {
  return (
    <div className="mx-4 md:px-6 md:max-w-7xl md:mx-auto ">
      <div className="my-4">
        <Logo />
      </div>
      <div className="hero-content -mx-3 md:mx-0 flex items-center justify-between flex-col-reverse lg:flex-row">
        <div className="md:flex-1 w-full">
          <Outlet />
        </div>
        <div className="hidden md:block md:flex-1">
          <img
            src={AuthImage}
            className="max-w-[120px] mt-10 md:mt-auto md:max-w-[300px] mx-auto rounded-lg"
          />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
