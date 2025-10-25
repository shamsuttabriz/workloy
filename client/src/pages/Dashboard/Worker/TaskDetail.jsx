import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingPage from "../../shared/LoadingPage";

export default function TaskDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();

  // Fetch single task safely
  const { data: task, isLoading, isError } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      try {
        const res = await axiosSecure.get(`/tasks/${id}`);
        return res.data;
      } catch (err) {
        if (err.response?.status === 404) {
          return null;
        }
        throw err;
      }
    },
  });

  const onSubmit = async (data) => {
    try {
      await axiosSecure.post("/submissions", {
        task_id: task._id,
        task_title: task.task_title,
        payable_amount: task.payable_amount,
        worker_email: user.email,
        worker_name: user.displayName,
        buyer_name: task.buyer_name,
        buyer_email: task.buyer_email,
        submission_details: data.submission_details,
      });

      Swal.fire({
        icon: "success",
        title: "Submission Sent!",
        text: "Your work has been submitted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      reset();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Something went wrong. Please try again.",
      });
    }
  };

  if (isLoading) return <LoadingPage />;

  if (!task || isError)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 p-4">
        <p className="text-xl font-medium text-blue-600">
          Task not found or something went wrong.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-xl p-8 md:p-10 space-y-6">
        {/* Task Title */}
        <h1 className="text-3xl md:text-4xl font-extrabold text-center text-blue-700">
          {task.task_title}
        </h1>

        {/* Task Info */}
        <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl space-y-2">
          <p className="text-gray-800">
            <strong>Buyer:</strong> {task.buyer_name || "Unknown"} ({task.created_by})
          </p>
          <p className="text-gray-600">
            <strong>Completion Date:</strong>{" "}
            {task.completion_date
              ? new Date(task.completion_date).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "No deadline"}
          </p>
          <p className="text-gray-800">
            <strong>Payable Amount:</strong> ${task.payable_amount ?? 0}
          </p>
          <p className="text-gray-800">
            <strong>Required Workers:</strong> {task.required_workers ?? 1}
          </p>
          <p className="text-gray-600">
            <strong>Details:</strong> {task.task_detail || "No additional details"}
          </p>
        </div>

        {/* Submission Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block">
            <span className="font-semibold text-gray-800">Submission Details</span>
            <textarea
              {...register("submission_details", { required: true })}
              className="mt-2 w-full p-3 border border-blue-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none bg-white text-gray-800"
              placeholder="Enter your work link or details"
              rows={5}
            />
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors duration-200"
          >
            Submit Work
          </button>
        </form>
      </div>
    </div>
  );
}
