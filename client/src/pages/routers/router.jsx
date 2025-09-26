import { createBrowserRouter } from "react-router";
import MainLayout from "../../layouts/MainLayout";
import { Home } from "../Home/Home";
import AuthLayout from "../../layouts/AuthLayout";
import Login from "../Authentication/Login";
import Register from "../Authentication/Register";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../../layouts/DashboardLayout";
import Profile from "../Profile";
import AddTask from "../Dashboard/Buyer/AddTask";
import PurchaseCoin from "../Dashboard/Buyer/PurchaseCoin";
import MyTasks from "../Dashboard/Buyer/MyTasks";
import Payment from "../Dashboard/Payment/Payment";
import TaskList from "../Dashboard/Worker/TaskList";
import PaymentHistory from "../Dashboard/Payment/PaymentHistory";
import WithDraw from "../Dashboard/Worker/WithDraw";
import MySubmission from "../Dashboard/Worker/MySubmission";
import ApprovedSubmission from "../Dashboard/Worker/ApprovedSubmission";
import TaskDetail from "../Dashboard/Worker/TaskDetail";
import TaskReview from "../Dashboard/Buyer/TaskReview";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
    ],
  },
  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "register",
        Component: Register,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "my-tasks",
        Component: MyTasks,
      },
      {
        path: "add-task",
        Component: AddTask,
      },
      {
        path: "task-review",
        Component: TaskReview,
      },
      {
        path: "purchase-coin",
        Component: PurchaseCoin,
      },
      {
        path: "payment/:taskId",
        Component: Payment,
      },
      {
        path: "task-list",
        Component: TaskList,
      },
      {
        path: "task-details/:id",
        Component: TaskDetail,
      },
      {
        path: "approved-submission",
        Component: ApprovedSubmission,
      },
      {
        path: "payment-history",
        Component: PaymentHistory,
      },
      {
        path: "my-submission",
        Component: MySubmission,
      },
      {
        path: "withdraw",
        Component: WithDraw,
      },
    ],
  },
]);
