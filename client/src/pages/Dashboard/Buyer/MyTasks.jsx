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

  /* ------------------------------
   * Load all tasks using TanStack Query
   * ------------------------------ */
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
      // completion_date with descending sort
      return res?.data?.sort(
        (a, b) => new Date(b.completion_date) - new Date(a.completion_date)
      );
    },
  });

  

  if (isLoading) {
    return <LoadingPage />;
  }

  /* ------------------------------
   * Update Task
   * ------------------------------ */
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
        refetch(); // ✅ আপডেটের পর টাস্ক লিস্ট রিফ্রেশ
      }
    } catch (error) {
      console.error(error);
      Swal.fire("❗ Error", "Failed to update task", "error");
    }
  };

  /* ------------------------------
   * Delete Task
   * ------------------------------ */
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
    } catch (error) {
      console.error(error);
      Swal.fire("❗ Error", "Failed to delete task", "error");
    }
  };

  /* ------------------------------
   * Loading & Error State
   * ------------------------------ */
  if (isLoading) return <p className="p-4">Loading tasks...</p>;
  if (isError) return <p className="p-4 text-red-500">Failed to load tasks.</p>;

  /* ------------------------------
   * JSX
   * ------------------------------ */
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-center sm:text-left">
        My Tasks
      </h2>

      <div className="overflow-x-auto rounded-lg border shadow-sm">
        <table className="table table-zebra w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th>Title</th>
              <th className="min-w-[140px]">Detail</th>
              <th>Workers</th>
              <th>Payable</th>
              <th className="min-w-[120px]">Completion Date</th>
              <th>Total Payable</th>
              <th className="min-w-[140px]">Submission Info</th>
              <th className="text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task._id} className="hover">
                <td>{task.task_title}</td>
                <td>{task.task_detail}</td>
                <td>{task.required_workers}</td>
                <td>{task.payable_amount}</td>
                <td>{new Date(task.completion_date).toLocaleDateString()}</td>
                <td>{task.total_payable_amount}</td>
                <td>{task.submission_info}</td>
                <td>
                  <div className="flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      onClick={() => setEditingTask(task)}
                      className="btn btn-xs sm:btn-sm bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDelete(task)}
                      className="btn btn-xs sm:btn-sm bg-red-500 hover:bg-red-600 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingTask && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-2">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-lg relative">
            <h3 className="text-xl font-bold mb-4 text-center">Update Task</h3>
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
