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
    enabled: !!hello?.email,
  });

  if (isLoading || roleLoading) return <LoadingPage />;
  if (error) return <p>Something went wrong!</p>;

  const user = {
    name: hello?.displayName || "Unknown User",
    role: data?.role || "User",
    coins: data?.coins || 0,
    image:
      hello?.photoURL ||
      "https://cdn-icons-png.flaticon.com/512/149/149071.png",
  };

  // ✅ Menu item helper
  const menuItem = (to, Icon, label, end = false) => (
    <li key={label}>
      <NavLink
        to={to}
        end={end}
        className={({ isActive }) =>
          `flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
            isActive
              ? "bg-gradient-to-r from-blue-500 to-sky-400 text-white shadow-md"
              : "text-gray-700 hover:bg-blue-100 hover:text-blue-600"
          }`
        }
      >
        <Icon className="w-5 h-5" />
        {label}
      </NavLink>
    </li>
  );

  // ✅ Role-based menu
  const roleMenus = {
    Worker: [
      ["/dashboard/task-list", HiFolderOpen, "Task List"],
      ["/dashboard/my-submission", HiDocumentText, "My Submissions"],
      ["/dashboard/withdraw", HiArrowCircleUp, "Withdraw"],
      ["/dashboard/approved-submission", HiCheckCircle, "Approved Submission"],
    ],
    Buyer: [
      ["/dashboard/my-tasks", HiClipboardList, "My Tasks"],
      ["/dashboard/add-task", HiPlusCircle, "Add Task"],
      ["/dashboard/task-review", HiOutlineClipboardCheck, "Task Review"],
      ["/dashboard/purchase-coin", HiCurrencyDollar, "Purchase Coin"],
      ["/dashboard/payment-history", HiCreditCard, "Payment History"],
    ],
    Admin: [
      ["/dashboard/withdraw-requests", HiCurrencyDollar, "Withdraw Requests"],
      ["/dashboard/manage-users", HiUserGroup, "Manage Users"],
      ["/dashboard/manage-tasks", HiClipboardList, "Manage Tasks"],
    ],
  };

  return (
    <div className="drawer lg:drawer-open bg-gradient-to-br from-sky-100 to-blue-50 min-h-screen">
      {/* Drawer toggle */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <aside className="fixed top-16 md:top-0 left-0 h-screen w-72 bg-white p-4 flex flex-col shadow-lg">
          <Link to="/" className="mb-3 md:mb-6 block">
            <Logo />
          </Link>
          <ul className="menu space-y-2 flex-1 overflow-y-auto">
            {menuItem("/dashboard", HiHome, "Home", true)}
            {roleMenus[role]?.map(([to, Icon, label]) =>
              menuItem(to, Icon, label)
            )}
          </ul>
        </aside>
      </div>

      {/* Main content */}
      <div className="drawer-content flex flex-col min-h-screen lg:ml-72">
        {/* Navbar */}
        <div className="navbar bg-white/80 backdrop-blur-md shadow-md px-4 py-2 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-2">
            {/* Hamburger for mobile */}
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
            <span className="font-bold text-lg lg:hidden text-blue-700">
              Dashboard
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <span className="font-semibold hidden sm:block text-blue-700">
              {user.coins} Coins
            </span>
            <div className="flex flex-col leading-tight text-right hidden sm:flex">
              <span className="font-medium text-gray-800">{user.name}</span>
              <span className="text-xs text-gray-500">{user.role}</span>
            </div>
            <Link to="/dashboard/profile">
              <img
                src={user.image}
                alt="user avatar"
                className="w-8 h-8 rounded-full border-2 border-blue-400"
              />
            </Link>
            <button className="btn btn-ghost btn-circle">
              <div className="indicator">
                <Bell className="w-5 h-5 text-blue-600" />
                <span className="badge badge-sm bg-blue-500 text-white indicator-item">
                  3
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Outlet */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="bg-blue-100 text-center py-3 shadow-inner">
          <p className="text-sm text-gray-600">
            &copy; {new Date().getFullYear()} Workloy. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
