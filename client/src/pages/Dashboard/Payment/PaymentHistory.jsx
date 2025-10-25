import React from "react";
import useAuth from "../../../hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingPage from "../../shared/LoadingPage";

const PaymentHistory = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  // ✅ Fetch payment data
  const { isLoading, data: payHistoryInfo = [] } = useQuery({
    queryKey: ["payments", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/payments?email=${user.email}`);
      return res.data;
    },
  });

  // ✅ Loading state
  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-50 to-blue-100 p-4 sm:p-8">
      <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
        Payment History
      </h2>

      {payHistoryInfo.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-6 text-center text-gray-600">
          No payments found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {payHistoryInfo.map((payment) => (
            <div
              key={payment.transactionId}
              className="bg-white rounded-2xl shadow-md p-5 border border-blue-100 transition-transform transform hover:-translate-y-1 hover:shadow-lg"
            >
              <h3 className="text-lg font-semibold text-blue-700 break-words mb-2">
                Transaction ID:
              </h3>
              <p className="text-sm text-gray-700 break-words mb-3">
                {payment.transactionId}
              </p>

              <div className="flex flex-col gap-1 text-gray-700">
                <p>
                  <span className="font-medium text-blue-600">Amount:</span> $
                  {payment.amount}
                </p>
                <p>
                  <span className="font-medium text-blue-600">
                    Payment Method:
                  </span>{" "}
                  {payment.paymentMethod[0]}
                </p>
                <p>
                  <span className="font-medium text-blue-600">Date:</span>{" "}
                  {new Date(payment.paid_at).toLocaleDateString()}{" "}
                  {new Date(payment.paid_at).toLocaleTimeString()}
                </p>
                <p className="text-green-600 font-semibold mt-1">✅ Paid</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;
