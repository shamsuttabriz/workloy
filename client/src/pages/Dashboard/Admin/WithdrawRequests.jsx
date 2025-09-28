import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaCheckCircle } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingPage from "../../shared/LoadingPage";

export default function WithdrawRequests() {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  // 🔹 Get all pending withdrawals
  const { data: withdrawals = [], isLoading, isError } = useQuery({
    queryKey: ["pendingWithdrawals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/withdrawals/pending");
      return res.data;
    },
  });

  // 🔹 Approve mutation
  const mutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.patch(`/withdrawals/approve/${id}`);
    },
    onSuccess: () => {
      // আবার ফেচ হবে -> status আপডেট দেখাবে
      queryClient.invalidateQueries(["pendingWithdrawals"]);
      Swal.fire({
        icon: "success",
        title: "Payment Success",
        text: "Withdrawal approved & user coin decreased",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (err) => {
      Swal.fire(
        "Error",
        err?.response?.data?.message || "Something went wrong",
        "error"
      );
    },
  });

  if (isLoading) return <LoadingPage />;
  if (isError)
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <h1 className="text-xl font-bold mb-4">Pending Withdraw Requests</h1>
        <p className="text-red-600">Failed to load withdraw requests. Try again later.</p>
      </div>
    );

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Pending Withdraw Requests</h1>

      <table className="w-full border border-gray-300 text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">User Email</th>
            <th className="p-2 border">Amount</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>

        <tbody>
          {withdrawals.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 border text-left">
                No pending requests
              </td>
            </tr>
          ) : (
            withdrawals.map((w) => (
              <tr key={w._id}>
                <td className="p-2 border">{w.worker_email}</td>
                <td className="p-2 border">{w.withdrawal_amount}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded ${
                      w.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {w.status}
                  </span>
                </td>
                <td className="p-2 border">
                  {w.status === "pending" && (
                    <button
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 flex items-center gap-2 mx-auto"
                      onClick={() => mutation.mutate(w._id)}
                      disabled={mutation.isLoading}
                      aria-disabled={mutation.isLoading}
                      aria-label={`Approve withdrawal for ${w.worker_email}`}
                    >
                      <FaCheckCircle />
                      {mutation.isLoading ? "Processing..." : "Payment Success"}
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
