import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaCoins, FaDollarSign } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const WithDraw = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const [coinToWithdraw, setCoinToWithdraw] = useState("");
  const [paymentSystem, setPaymentSystem] = useState("");
  const [accountNumber, setAccountNumber] = useState("");

  // ✅ User coin info
  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userCoin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user/coins");
      return res.data; // { totalCoins, worker_name, worker_email }
    },
  });

  // 💡 Auto calculate withdraw amount (20 coin = 1 dollar)
  const withdrawDollar = coinToWithdraw
    ? (Number(coinToWithdraw) / 20).toFixed(2)
    : "0";

  // ✅ Total approved withdraw amount
  const { data: totalWithdrawData, isLoading: totalLoading } = useQuery({
    queryKey: ["totalWithdrawAmount", userData?.worker_email],
    enabled: !!userData?.worker_email,
    queryFn: async () => {
      const res = await axiosSecure.get(
        `/withdrawals/total/${userData.worker_email}`
      );
      return res.data; // { totalWithdrawAmount: number }
    },
  });

  // ✅ Mutation for withdrawal
  const mutation = useMutation({
    mutationFn: async (withdrawData) => {
      return await axiosSecure.post("/withdrawals", withdrawData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userCoin"] });
      queryClient.invalidateQueries({ queryKey: ["totalWithdrawAmount"] });

      Swal.fire({
        icon: "success",
        title: "Withdrawal request submitted!",
        text: "Admin will review your request shortly.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset form
      setCoinToWithdraw("");
      setPaymentSystem("");
      setAccountNumber("");
    },
    onError: (err) => {
      Swal.fire({
        icon: "error",
        title: "Something went wrong",
        text: err.message || "Please try again.",
      });
    },
  });

  if (isLoading) return <p className="text-center mt-10 text-lg">Loading...</p>;
  if (isError)
    return (
      <p className="text-center mt-10 text-red-600">Failed to load data</p>
    );

  const { totalCoins = 0, worker_name, worker_email } = userData || {};
  const canWithdraw = totalCoins >= 200;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!coinToWithdraw || !paymentSystem || !accountNumber) return;

    if (Number(coinToWithdraw) > totalCoins) {
      return Swal.fire({
        icon: "warning",
        title: "Insufficient Coins",
        text: "You cannot withdraw more coins than you have.",
      });
    }

    mutation.mutate({
      worker_email,
      worker_name,
      withdrawal_coin: Number(coinToWithdraw),
      withdrawal_amount: parseFloat(withdrawDollar),
      payment_system: paymentSystem,
      account_number: accountNumber,
      withdraw_date: new Date().toISOString(),
      status: "pending",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-10 px-4 flex justify-center">
      <div className="max-w-2xl w-full space-y-8">
        {/* ---- Stats Section ---- */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center">
            <FaCoins className="text-yellow-500 text-3xl mb-2" />
            <h3 className="text-gray-700 font-medium">Current Coins</h3>
            <p className="text-2xl font-bold text-gray-800">{totalCoins}</p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center">
            <FaDollarSign className="text-green-600 text-3xl mb-2" />
            <h3 className="text-gray-700 font-medium">Total Dollar</h3>
            <p className="text-2xl font-bold text-gray-800">
              ${(totalCoins / 20).toFixed(2)}
            </p>
          </div>

          <div className="bg-white shadow rounded-xl p-6 flex flex-col items-center">
            <FaDollarSign className="text-blue-600 text-3xl mb-2" />
            <h3 className="text-gray-700 font-medium">Total Withdrawn</h3>
            {totalLoading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <p className="text-2xl font-bold text-gray-800">
                ${totalWithdrawData?.totalWithdrawAmount.toFixed(2)}
              </p>
            )}
          </div>
        </div>

        {/* ---- Withdraw Form ---- */}
        <div className="bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <FaCoins className="text-yellow-500" /> Request a Withdrawal
          </h2>

          {canWithdraw ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Coins to Withdraw
                </label>
                <input
                  type="number"
                  min="0"
                  value={coinToWithdraw}
                  onChange={(e) => setCoinToWithdraw(e.target.value)}
                  className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="e.g. 200"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Withdrawal Amount ($)
                </label>
                <input
                  type="text"
                  value={withdrawDollar}
                  readOnly
                  className="w-full border-gray-300 rounded-lg p-3 bg-gray-100"
                />
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Select Payment System
                </label>
                <select
                  value={paymentSystem}
                  onChange={(e) => setPaymentSystem(e.target.value)}
                  className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="">-- Select --</option>
                  <option value="Bkash">Bkash</option>
                  <option value="Rocket">Rocket</option>
                  <option value="Nagad">Nagad</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  placeholder="Enter your account number"
                />
              </div>

              <button
                type="submit"
                disabled={mutation.isLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-blue-700 transition"
              >
                {mutation.isLoading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          ) : (
            <p className="text-red-600 font-medium text-center mt-4">
              Minimum 200 coins required to withdraw
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WithDraw;
