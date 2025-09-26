// WorkerTasksList.jsx
import React from "react";
import { Link, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingPage from "../../shared/LoadingPage";

export default function TaskList() {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["availableTasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tasks/available");
      return res.data;
    },
  });

  const fmtDate = (d) => {
    if (!d) return "No deadline";
    try {
      return new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return d;
    }
  };

  // ✅ Loading State
  if (isLoading) return <LoadingPage />;

  // ✅ Error State
  if (isError)
    return (
      <div className="text-red-500 text-center">
        {error?.message || "Failed to load tasks"}
      </div>
    );

  // ✅ Empty State
  if (!tasks.length)
    return (
      <div className="text-center text-gray-500">
        No available tasks right now.
      </div>
    );

  // ✅ Success State
  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Available Tasks</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tasks.map((task) => {
          const title = task.task_title || "Untitled task";
          const buyer = task.created_by || "Unknown buyer";
          const completion = fmtDate(task.completion_date);
          const payable = task.payable_amount ?? 0;
          const required = task.required_worker ?? task.required_workers ?? 0;
          const key = task._id || task.id || `${title}-${Math.random()}`;

          return (
            <div
              key={key}
              className="bg-white rounded-lg shadow p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {title}
                </h3>
                <p className="text-sm text-gray-600">
                  Buyer:
                  <span className="font-medium text-gray-800">{buyer}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Deadline: <span className="font-medium">{completion}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Payable: <span className="font-medium">{payable}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Required Workers:
                  <span className="font-medium">{required}</span>
                </p>
              </div>

              <div className="mt-4">
                <Link
                  to={`/dashboard/task-details/${task._id}`}
                  aria-label={`View details for ${title}`}
                  className="w-full py-2 block text-center bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
