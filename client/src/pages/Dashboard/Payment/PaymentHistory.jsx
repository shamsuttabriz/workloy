import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingPage from "../../shared/LoadingPage";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { isLoading, data: payHistoryInfo } = useQuery({
    queryKey: ["payments", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">Payment History</h2>

      {payHistoryInfo?.length === 0 ? (
        <p className="text-gray-500">No payments found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4 border-b">Transaction ID</th>
                <th className="py-2 px-4 border-b">Amount</th>
                <th className="py-2 px-4 border-b">Payment Method</th>
                <th className="py-2 px-4 border-b">Date</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {payHistoryInfo.map((payment) => (
                <tr key={payment.transactionId} className="text-center">
                  <td className="py-2 px-4 border-b break-words">
                    {payment.transactionId}
                  </td>
                  <td className="py-2 px-4 border-b">${payment.amount}</td>
                  <td className="py-2 px-4 border-b">
                    {payment.paymentMethod[0]}
                  </td>
                  <td className="py-2 px-4 border-b">
                    {new Date(payment.paid_at).toLocaleDateString()}{" "}
                    {new Date(payment.paid_at).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-4 border-b text-green-600 font-medium">
                    Paid
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
