import React from "react";
import { Link } from "react-router";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingPage from "../../shared/LoadingPage";

export default function TaskList() {
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch available tasks
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

  // ✅ Format deadline date
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
      <div className="text-red-500 text-center mt-10 font-medium">
        {error?.message || "Failed to load tasks."}
      </div>
    );

  // ✅ Empty State
  if (!tasks.length)
    return (
      <div className="text-center text-gray-600 mt-10 text-lg font-medium">
        No available tasks right now.
      </div>
    );

  // ✅ Success State
  return (
    <div className=" py-10 px-4 md:px-8 bg-gradient-to-br from-sky-50 to-blue-100 min-h-screen rounded-lg">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">
          Available Tasks
        </h2>
        <p className="text-gray-600">
          Explore the latest tasks and start earning today!
        </p>
      </div>

      {/* Task Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tasks.map((task) => {
          const title = task.task_title || "Untitled Task";
          const buyer = task.created_by || "Unknown Buyer";
          const completion = fmtDate(task.completion_date);
          const payable = task.payable_amount ?? 0;
          const required = task.required_worker ?? task.required_workers ?? 0;
          const key = task._id || task.id || `${title}-${Math.random()}`;

          return (
            <div
              key={key}
              className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl shadow-md p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              {/* Task Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {title}
                </h3>

                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-gray-800">Buyer:</span>{" "}
                  {buyer}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-gray-800">Deadline:</span>{" "}
                  {completion}
                </p>
                <p className="text-sm text-gray-600 mb-1">
                  <span className="font-medium text-gray-800">Payable:</span>{" "}
                  {payable} Coins
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium text-gray-800">
                    Required Workers:
                  </span>{" "}
                  {required}
                </p>
              </div>

              {/* Button */}
              <div className="mt-4">
                <Link
                  to={`/dashboard/task-details/${task._id}`}
                  aria-label={`View details for ${title}`}
                  className="w-full py-2 block text-center bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white font-medium rounded-xl shadow transition-all duration-300"
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
