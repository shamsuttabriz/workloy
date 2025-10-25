import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function ManageTasks() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ✅ Fetch all tasks
  const {
    data: tasks = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["allTasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tasks/available");
      return res.data;
    },
  });

  // ✅ Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => await axiosSecure.delete(`/tasks/${taskId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["allTasks"]);
      Swal.fire("Deleted!", "Task has been removed successfully.", "success");
    },
    onError: () => Swal.fire("Error", "Failed to delete task.", "error"),
  });

  // ✅ Loading / Error States
  if (isLoading)
    return (
      <p className="text-center text-blue-700 mt-10 text-lg font-medium">
        Loading tasks...
      </p>
    );

  if (isError)
    return (
      <p className="text-center text-red-600 mt-10 text-lg font-medium">
        Failed to load tasks
      </p>
    );

  if (tasks.length === 0)
    return (
      <p className="text-center text-blue-700 font-semibold text-2xl my-10">
        No tasks found
      </p>
    );

  // ✅ Handle delete confirmation
  const handleDelete = (taskId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the task!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTaskMutation.mutate(taskId);
      }
    });
  };

  // ✅ UI
  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-50 to-blue-100 p-6">
      <h1 className="text-3xl font-bold text-blue-800 text-center mb-10">
        Manage Tasks
      </h1>

      {/* Card Grid */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white rounded-2xl shadow-lg p-5 flex flex-col justify-between hover:shadow-xl hover:scale-[1.02] transition-all duration-200 border border-blue-100"
          >
            <div>
              <h2 className="text-xl font-semibold text-blue-800 mb-2">
                {task.task_title || "Untitled Task"}
              </h2>

              <p className="text-slate-700 text-sm mb-1">
                <span className="font-medium">Created By:</span>{" "}
                {task.created_by || "Unknown"}
              </p>

              <p className="text-slate-700 text-sm mb-1">
                <span className="font-medium">Completion Date:</span>{" "}
                {task.completion_date
                  ? new Date(task.completion_date).toLocaleDateString()
                  : "N/A"}
              </p>

              <p className="text-slate-700 text-sm mb-3">
                <span className="font-medium">Required Workers:</span>{" "}
                {task.required_workers ?? 0}
              </p>
            </div>

            <button
              onClick={() => handleDelete(task._id)}
              className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-md mt-3 transition-colors duration-200"
            >
              Delete Task
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
