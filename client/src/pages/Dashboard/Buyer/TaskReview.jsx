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

  

  if (isLoading) return <p className="text-center mt-20">Loading...</p>;
  if (!submissions.length)
    return <p className="text-center mt-20">No pending submissions.</p>;

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
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Task To Review</h1>

      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Worker</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Task Title</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">View Submission</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {submissions.map((sub) => (
              <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{sub.worker_name}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{sub.task_title}</td>
                <td className="px-4 py-3 text-sm text-gray-700">${sub.payable_amount}</td>

                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => setModalData(sub)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-sm font-medium"
                  >
                    View
                  </button>
                </td>

                <td className="px-4 py-3 flex justify-center gap-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ----- Modal Component ----- */}
      <SubmissionModal data={modalData} onClose={() => setModalData(null)} />
    </div>
  );
}
