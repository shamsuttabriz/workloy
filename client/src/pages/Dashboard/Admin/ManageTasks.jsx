// ManageTasks.jsx
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function ManageTasks() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ===================== Fetch all tasks =====================
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["allTasks"],
    queryFn: async () => {
      const res = await axiosSecure.get("/tasks/available"); // Admin all tasks API
      return res.data;
    },
  });

  // ===================== Delete Task Mutation =====================
  const deleteTaskMutation = useMutation({
    mutationFn: async (taskId) => {
      return await axiosSecure.delete(`/tasks/${taskId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allTasks"] });
      Swal.fire({
        icon: "success",
        title: "Task Deleted!",
        timer: 1500,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed to delete task",
        timer: 1500,
        showConfirmButton: false,
      });
    },
  });

  if (isLoading) return <p className="text-center mt-10">Loading tasks...</p>;

  return (
    <div className="p-4 max-w-full">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800">
        Manage Tasks
      </h2>

      <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left text-sm sm:text-base font-medium text-gray-700">
                Title
              </th>
              <th className="py-3 px-4 text-left text-sm sm:text-base font-medium text-gray-700">
                Created By
              </th>
              <th className="py-3 px-4 text-left text-sm sm:text-base font-medium text-gray-700">
                Completion Date
              </th>
              <th className="py-3 px-4 text-left text-sm sm:text-base font-medium text-gray-700">
                Required Workers
              </th>
              <th className="py-3 px-4 text-center text-sm sm:text-base font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="py-6 text-center text-gray-500 text-sm sm:text-base"
                >
                  No tasks found.
                </td>
              </tr>
            ) : (
              tasks.map((task) => (
                <tr
                  key={task._id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="py-3 px-4 text-sm sm:text-base">
                    {task.task_title}
                  </td>
                  <td className="py-3 px-4 text-sm sm:text-base">
                    {task.created_by}
                  </td>
                  <td className="py-3 px-4 text-sm sm:text-base">
                    {new Date(task.completion_date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 text-sm sm:text-base">
                    {task.required_workers}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: "Are you sure?",
                          text: "You won't be able to revert this!",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#3085d6",
                          cancelButtonColor: "#d33",
                          confirmButtonText: "Yes, delete it!",
                        }).then((result) => {
                          if (result.isConfirmed) {
                            deleteTaskMutation.mutate(task._id);
                          }
                        })
                      }
                      className="inline-flex items-center justify-center bg-red-500 hover:bg-red-600 text-white text-sm sm:text-base font-medium px-3 py-1 rounded-md transition-colors duration-200"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
