import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import SubmissionModal from "./SubmissionModal.";

export default function TaskReview() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [modalData, setModalData] = useState(null);

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["pendingSubmissions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/submissions/pending");
      return res.data;
    },
  });

  if (isLoading)
    return <p className="text-center mt-20 text-blue-600">Loading...</p>;
  if (!submissions.length)
    return (
      <p className="text-center mt-20 text-gray-500">No pending submissions.</p>
    );

  const handleApprove = async (id) => {
    try {
      await axiosSecure.put(`/submissions/approve/${id}`);
      Swal.fire({
        icon: "success",
        title: "Approved!",
        text: "Submission approved and worker coin updated",
        timer: 2000,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["pendingSubmissions"]);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to approve submission",
      });
    }
  };

  const handleReject = async (id) => {
    try {
      await axiosSecure.put(`/submissions/reject/${id}`);
      Swal.fire({
        icon: "success",
        title: "Rejected",
        text: "Submission rejected and required_workers increased",
        timer: 2000,
        showConfirmButton: false,
      });
      queryClient.invalidateQueries(["pendingSubmissions"]);
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to reject submission",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-50 to-blue-100 p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-800">
        Task To Review
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {submissions.map((sub) => (
          <div
            key={sub._id}
            className="bg-white rounded-2xl shadow-md p-5 border border-blue-100 hover:shadow-lg transition-all"
          >
            <h3 className="text-xl font-semibold text-blue-700 mb-2 break-words">
              {sub.task_title}
            </h3>
            <p className="text-gray-700 mb-1">
              <span className="font-medium text-blue-600">Worker:</span>{" "}
              {sub.worker_name}
            </p>
            <p className="text-gray-700 mb-3">
              <span className="font-medium text-blue-600">Amount:</span> $
              {sub.payable_amount}
            </p>

            <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
              <button
                onClick={() => setModalData(sub)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium"
              >
                View Submission
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(sub._id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md text-sm font-medium"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(sub._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-md text-sm font-medium"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ----- Modal Component ----- */}
      <SubmissionModal data={modalData} onClose={() => setModalData(null)} />
    </div>
  );
}
