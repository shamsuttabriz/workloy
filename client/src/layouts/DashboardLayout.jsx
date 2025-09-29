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

  console.log(role, roleLoading);

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

  return (
    <div className="drawer lg:drawer-open h-screen">
      {/* drawer toggle for mobile */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main content */}
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-slate-200 shadow-md px-4 flex justify-between">
          {/* Left - Logo + toggle button */}
          <div className="flex items-center gap-2">
            {/* Hamburger only on mobile */}
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

          {/* Right - user info + notification */}
          <div className="flex  items-center gap-2 md:gap-4">
            {/* Coins + User info */}
            <div className="flex items-center gap-2 md:gap-4 text-sm md:text-base">
              <span className="font-semibold">{user.coins} Coins</span>
              <div className="flex flex-col leading-tight">
                <span className="font-medium">{user.name}</span>
                <span className="text-xs text-gray-500">{user.role}</span>
              </div>
              <Link to="/dashboard/profile" className="flex items-center gap-2">
                <img
                  src={user.image}
                  alt="user avatar"
                  className="w-8 h-8 rounded-full border-2 border-brand p-0.5"
                />
              </Link>
            </div>

            {/* Notification */}
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
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
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

          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive
                    ? "bg-brand text-white rounded-md px-2 py-1"
                    : "text-gray-700"
                }`
              }
            >
              <HiHome className="w-5 h-5" />
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/my-tasks"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive
                    ? "bg-brand text-white rounded-md px-2 py-1"
                    : "text-gray-700"
                }`
              }
            >
              <HiClipboardList className="w-5 h-5" />
              My Tasks
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/add-task"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive
                    ? "bg-brand text-white rounded-md px-2 py-1"
                    : "text-gray-700"
                }`
              }
            >
              <HiPlusCircle className="w-5 h-5" />
              Add Task
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/task-review"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive
                    ? "bg-brand text-white rounded-md px-2 py-1"
                    : "text-gray-700"
                }`
              }
            >
              <HiOutlineClipboardCheck className="w-5 h-5" />
              Task Review
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/purchase-coin"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive
                    ? "bg-brand text-white rounded-md px-2 py-1"
                    : "text-gray-700"
                }`
              }
            >
              <HiCurrencyDollar className="w-5 h-5" />
              Purchase Coin
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/payment-history"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive
                    ? "bg-brand text-white rounded-md px-2 py-1"
                    : "text-gray-700"
                }`
              }
            >
              <HiCreditCard className="w-5 h-5" />
              Payment History
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/task-list"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive
                    ? "bg-brand text-white rounded-md px-2 py-1"
                    : "text-gray-700"
                }`
              }
            >
              <HiFolderOpen className="w-5 h-5" />
              Task List
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/approved-submission"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive
                    ? "bg-brand text-white rounded-md px-2 py-1"
                    : "text-gray-700"
                }`
              }
            >
              <HiCheckCircle className="w-5 h-5" />
              Approved Submission
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/my-submission"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive
                    ? "bg-brand text-white rounded-md px-2 py-1"
                    : "text-gray-700"
                }`
              }
            >
              <HiDocumentText className="w-5 h-5" />
              My Submissions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/dashboard/withdraw"
              className={({ isActive }) =>
                `flex items-center gap-2 ${
                  isActive
                    ? "bg-brand text-white rounded-md px-2 py-1"
                    : "text-gray-700"
                }`
              }
            >
              <HiArrowCircleUp className="w-5 h-5" />
              Withdraw
            </NavLink>
          </li>

          {/* Admin Links */}
          {!roleLoading && role === "Admin" && (
            <>
              <li>
                <NavLink
                  to="/dashboard/withdraw-requests"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive
                        ? "bg-brand text-white rounded-md px-2 py-1"
                        : "text-gray-700"
                    }`
                  }
                >
                  <HiCurrencyDollar className="w-5 h-5" />
                  Withdraw Requests
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/manage-users"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive
                        ? "bg-brand text-white rounded-md px-2 py-1"
                        : "text-gray-700"
                    }`
                  }
                >
                  <HiUserGroup className="w-5 h-5" />
                  Manage Users
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/dashboard/manage-tasks"
                  className={({ isActive }) =>
                    `flex items-center gap-2 ${
                      isActive
                        ? "bg-brand text-white rounded-md px-2 py-1"
                        : "text-gray-700"
                    }`
                  }
                >
                  <HiClipboardList className="w-5 h-5" />
                  Manage Tasks
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
