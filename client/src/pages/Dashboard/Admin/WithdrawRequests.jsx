import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaCheckCircle } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingPage from "../../shared/LoadingPage";

export default function WithdrawRequests() {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  // Fetch pending withdrawals
  const { data: withdrawals = [], isLoading, isError } = useQuery({
    queryKey: ["pendingWithdrawals"],
    queryFn: async () => {
      const res = await axiosSecure.get("/withdrawals/pending");
      return res.data;
    },
  });

  // Approve mutation
  const mutation = useMutation({
    mutationFn: async (id) => axiosSecure.patch(`/withdrawals/approve/${id}`),
    onSuccess: () => {
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
      <div className="p-4 max-w-4xl mx-auto text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-700">
          Pending Withdraw Requests
        </h1>
        <p className="text-red-600">Failed to load withdraw requests.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-50 to-blue-100 p-6 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold text-blue-800 text-center mb-5">
        Pending Withdraw Requests
      </h1>

      <div className="w-full max-w-4xl flex flex-col gap-4">
        {withdrawals.length === 0 ? (
          <p className="text-gray-500 text-center">No pending requests</p>
        ) : (
          withdrawals.map((w) => (
            <div
              key={w._id}
              className="bg-white rounded-2xl shadow-md border border-blue-200 p-5 flex flex-col md:flex-row md:justify-between md:items-center gap-4 transition hover:shadow-xl"
            >
              <div className="flex flex-col gap-1">
                <span className="text-blue-700 font-semibold text-lg">
                  {w.worker_email}
                </span>
                <span className="text-gray-600">
                  Amount: ${w.withdrawal_amount}
                </span>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-center text-sm font-medium mt-1 ${
                    w.status === "approved"
                      ? "bg-green-200 text-green-700"
                      : "bg-yellow-200 text-yellow-700"
                  }`}
                >
                  {w.status}
                </span>
              </div>

              {w.status === "pending" && (
                <button
                  onClick={() => mutation.mutate(w._id)}
                  disabled={mutation.isLoading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full flex items-center gap-2 transition self-start md:self-auto"
                >
                  <FaCheckCircle />
                  {mutation.isLoading ? "Processing..." : "Approve"}
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
