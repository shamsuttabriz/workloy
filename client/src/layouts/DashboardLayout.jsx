import {
  HiHome,
  HiClipboardList,
  HiPlusCircle,
  HiCurrencyDollar,
  HiCreditCard,
  HiCheckCircle,
  HiFolderOpen,
  HiDocumentText,
  HiArrowCircleUp,
  HiOutlineClipboardCheck,
  HiUserGroup,
} from "react-icons/hi";
import { Link, NavLink, Outlet } from "react-router";
import { Bell } from "lucide-react";
import Logo from "../pages/shared/Logo";
import useAxiosSecure from "../hooks/useAxiosSecure";
import LoadingPage from "../pages/shared/LoadingPage";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import useUserRole from "../hooks/useUserRole";

const DashboardLayout = () => {
  const axiosSecure = useAxiosSecure();
  const { user: hello } = useAuth();
  const { role, roleLoading } = useUserRole();

  const { data, isLoading, error } = useQuery({
    queryKey: ["user", hello?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${hello?.email}`);
      return res.data;
    },
  });

  if (isLoading) return <LoadingPage />;
  if (error) return <p>Something went wrong here</p>;

  const user = {
    name: hello.displayName,
    role: data.role,
    coins: data.coins,
    image: hello.photoURL,
  };

  const menuItem = (to, Icon, label) => (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-2 px-2 py-1 rounded-md ${
            isActive ? "bg-brand text-white" : "text-gray-700 hover:bg-gray-200"
          }`
        }
      >
        <Icon className="w-5 h-5" />
        {label}
      </NavLink>
    </li>
  );

  return (
    <div className="drawer lg:drawer-open h-screen">
      {/* drawer toggle for mobile */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-slate-100 shadow-md px-4 py-2 flex justify-between">
          <div className="flex items-center gap-2">
            <label
              htmlFor="dashboard-drawer"
              className="btn btn-square btn-ghost lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold">{user.coins} Coins</span>
            <div className="flex flex-col leading-tight">
              <span className="font-medium">{user.name}</span>
              <span className="text-xs text-gray-500">{user.role}</span>
            </div>
            <Link to="/dashboard/profile">
              <img
                src={user.image}
                alt="user avatar"
                className="w-8 h-8 rounded-full border-2 border-brand p-0.5"
              />
            </Link>

            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <Bell className="w-5 h-5" />
                <span className="badge badge-sm bg-brand-dark text-light indicator-item">
                  3
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-slate-200 text-center py-3 shadow-inner mt-auto">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Workloy. All rights reserved.
          </p>
        </footer>
      </div>

      {/* Sidebar drawer */}
      <div className="drawer-side">
        <label
          htmlFor="dashboard-drawer"
          className="drawer-overlay lg:hidden"
        ></label>
        <ul className="menu bg-base-300 min-h-full w-72 p-4 space-y-2">
          <Link to="/" className="mb-6 block">
            <Logo />
          </Link>

          {menuItem("/dashboard", HiHome, "Home")}
          {menuItem("/dashboard/my-tasks", HiClipboardList, "My Tasks")}
          {menuItem("/dashboard/add-task", HiPlusCircle, "Add Task")}
          {menuItem(
            "/dashboard/task-review",
            HiOutlineClipboardCheck,
            "Task Review"
          )}
          {menuItem(
            "/dashboard/purchase-coin",
            HiCurrencyDollar,
            "Purchase Coin"
          )}
          {menuItem(
            "/dashboard/payment-history",
            HiCreditCard,
            "Payment History"
          )}
          {menuItem("/dashboard/task-list", HiFolderOpen, "Task List")}
          {menuItem(
            "/dashboard/approved-submission",
            HiCheckCircle,
            "Approved Submission"
          )}
          {menuItem(
            "/dashboard/my-submission",
            HiDocumentText,
            "My Submissions"
          )}
          {menuItem("/dashboard/withdraw", HiArrowCircleUp, "Withdraw")}

          {/* Admin Links */}
          {!roleLoading && role === "Admin" && (
            <>
              {menuItem(
                "/dashboard/withdraw-requests",
                HiCurrencyDollar,
                "Withdraw Requests"
              )}
              {menuItem("/dashboard/manage-users", HiUserGroup, "Manage Users")}
              {menuItem(
                "/dashboard/manage-tasks",
                HiClipboardList,
                "Manage Tasks"
              )}
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
