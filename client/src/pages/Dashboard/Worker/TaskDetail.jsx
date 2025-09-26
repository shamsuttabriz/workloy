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

  // Fetch Single Task
  const { data: task, isLoading } = useQuery({
    queryKey: ["task", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/tasks/${id}`);
      return res.data;
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

  return (
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="w-full max-w-xl bg-light rounded-2xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-[var(--color-brand-dark)]">{task.task_title}</h1>

        <div className="bg-white p-4 rounded-lg space-y-2">
          <p className="text-[var(--color-natural-dark)]"><strong>Buyer:</strong> {user.displayName} ({task.created_by})</p>
          <p className="text-[var(--color-natural-light)]"><strong>Completion Date:</strong> {new Date(task.completion_date).toLocaleDateString()}</p>
          <p className="text-[var(--color-natural-dark)]"><strong>Payable Amount:</strong> ${task.payable_amount}</p>
          <p className="text-[var(--color-natural-dark)]"><strong>Required Workers:</strong> {task.required_workers}</p>
          <p className="text-[var(--color-natural-light)]"><strong>Details:</strong> {task.task_detail}</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <label className="block">
            <span className="font-semibold text-[var(--color-natural-dark)]">Submission Details</span>
            <textarea
              {...register("submission_details", { required: true })}
              className="mt-2 w-full p-3 border border-[var(--color-brand)] rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-brand)] resize-none bg-white text-[var(--color-natural-dark)]"
              placeholder="Enter your work link or details"
              rows={5}
            />
          </label>

          <button
            type="submit"
            className="w-full py-3 bg-[var(--color-accant)] text-white font-semibold rounded-xl hover:bg-[var(--color-accant-light)] transition-colors duration-200"
          >
            Submit Work
          </button>
        </form>
      </div>
    </div>
  );
}