import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";

export default function TaskReview() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [modalData, setModalData] = useState(null);

  // ---------- Fetch Pending Submissions ----------
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

  // ---------- Approve Submission ----------
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

  // ---------- Reject Submission ----------
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
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Task To Review</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border">Worker</th>
              <th className="px-4 py-3 border">Task Title</th>
              <th className="px-4 py-3 border">Amount</th>
              <th className="px-4 py-3 border">View Submission</th>
              <th className="px-4 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub._id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{sub.worker_name}</td>
                <td className="px-4 py-2 border">{sub.task_title}</td>
                <td className="px-4 py-2 border">${sub.payable_amount}</td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => setModalData(sub)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    View
                  </button>
                </td>
                <td className="px-4 py-2 border flex gap-2 justify-center">
                  <button
                    onClick={() => handleApprove(sub._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(sub._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- Modal ---------- */}
      {modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-11/12 md:w-2/3 lg:w-1/2">
            <h2 className="text-2xl font-bold mb-4">Submission Details</h2>
            <p className="mb-4 text-gray-700">{modalData.submission_details}</p>
            <div className="flex justify-end">
              <button
                onClick={() => setModalData(null)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
