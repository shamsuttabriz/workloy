import React, { useState } from "react";
import Swal from "sweetalert2";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingPage from "../../shared/LoadingPage";

export default function MyTasks() {
  const { user, setCoins } = useAuth();
  const axiosSecure = useAxiosSecure();
  const [editingTask, setEditingTask] = useState(null);

  // ✅ Load all tasks
  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["tasks", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks?email=${user.email}`);
      return res?.data?.sort(
        (a, b) => new Date(b.completion_date) - new Date(a.completion_date)
      );
    },
  });

  if (isLoading) return <LoadingPage />;
  if (isError)
    return (
      <p className="p-4 text-center text-red-500">Failed to load tasks.</p>
    );

  // ✅ Update Task
  const handleUpdate = async (e) => {
    e.preventDefault();
    const { task_title, task_detail, submission_info } = editingTask;
    try {
      const res = await axiosSecure.put(`/tasks/${editingTask._id}`, {
        task_title,
        task_detail,
        submission_info,
      });

      if (res.data?.message) {
        Swal.fire("✅ Updated", res.data.message, "success");
        setEditingTask(null);
        refetch();
      }
    } catch {
      Swal.fire("❗ Error", "Failed to update task", "error");
    }
  };

  // ✅ Delete Task
  const handleDelete = async (task) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This task will be deleted permanently",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const res = await axiosSecure.delete(`/tasks/${task._id}`);
      const { refillAmount } = res.data || { refillAmount: 0 };

      if (refillAmount > 0) {
        setCoins((prev) => prev + refillAmount);
        Swal.fire(
          "✅ Deleted",
          `Task deleted. ${refillAmount} coins refunded.`,
          "success"
        );
      } else {
        Swal.fire("✅ Deleted", "Task deleted.", "success");
      }

      refetch();
    } catch {
      Swal.fire("❗ Error", "Failed to delete task", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-50 to-blue-100 p-4 sm:p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-800">
        My Tasks
      </h2>

      {/* ✅ Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tasks.map((task) => (
          <div
            key={task._id}
            className="bg-white shadow-md rounded-xl p-5 border border-blue-100 hover:shadow-lg transition-all duration-200"
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2">
              {task.task_title}
            </h3>
            <p className="text-gray-700 mb-3 text-sm">
              <span className="font-medium text-blue-600">Detail:</span>{" "}
              {task.task_detail}
            </p>

            <div className="text-sm text-gray-600 space-y-1 mb-3">
              <p>
                <span className="font-medium text-blue-600">Workers:</span>{" "}
                {task.required_workers}
              </p>
              <p>
                <span className="font-medium text-blue-600">Payable:</span>{" "}
                {task.payable_amount}
              </p>
              <p>
                <span className="font-medium text-blue-600">Completion:</span>{" "}
                {new Date(task.completion_date).toLocaleDateString()}
              </p>
              <p>
                <span className="font-medium text-blue-600">
                  Total Payable:
                </span>{" "}
                {task.total_payable_amount}
              </p>
              <p className="break-words">
                <span className="font-medium text-blue-600">
                  Submission Info:
                </span>{" "}
                {task.submission_info}
              </p>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingTask(task)}
                className="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(task)}
                className="btn btn-sm bg-red-500 hover:bg-red-600 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-2">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
            <h3 className="text-xl font-bold mb-4 text-center text-blue-600">
              Update Task
            </h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                type="text"
                value={editingTask.task_title}
                onChange={(e) =>
                  setEditingTask({ ...editingTask, task_title: e.target.value })
                }
                className="input input-bordered w-full"
                placeholder="Task Title"
              />
              <textarea
                value={editingTask.task_detail}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    task_detail: e.target.value,
                  })
                }
                className="textarea textarea-bordered w-full"
                placeholder="Task Detail"
              />
              <textarea
                value={editingTask.submission_info}
                onChange={(e) =>
                  setEditingTask({
                    ...editingTask,
                    submission_info: e.target.value,
                  })
                }
                className="textarea textarea-bordered w-full"
                placeholder="Submission Info"
              />

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="btn btn-sm"
                  onClick={() => setEditingTask(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-sm bg-green-500 hover:bg-green-600 text-white"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
