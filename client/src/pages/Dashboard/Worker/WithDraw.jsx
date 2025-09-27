import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { FaCoins, FaDollarSign } from "react-icons/fa";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const WithDraw = () => {
  const queryClient = useQueryClient();
  const [coinToWithdraw, setCoinToWithdraw] = useState("");
  const [paymentSystem, setPaymentSystem] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const axiosSecure = useAxiosSecure();


  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["userCoin"],
    queryFn: async () => {
      const res = await axiosSecure.get("/user/coins"); // 👉 এখানে তোমার API endpoint দাও
      return res.data; // { totalCoins: number, worker_name: string, worker_email: string }
    },
  });

  console.log(userData);

  // 💡 Withdraw amount auto calculate (20 coin = 1 dollar)
  const withdrawDollar = coinToWithdraw ? (coinToWithdraw / 20).toFixed(2) : 0;

  const mutation = useMutation({
    mutationFn: async (withdrawData) => {
      return await axiosSecure.post("/withdrawals", withdrawData);
    },
    onSuccess: () => {
      // ✅ Cache refresh
      queryClient.invalidateQueries({ queryKey: ["userCoin"] });

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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Failed to load data</p>;

  const { totalCoins, worker_name, worker_email } = userData || {};
  const canWithdraw = totalCoins >= 200; // ✅ Minimum 200 coins to withdraw

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!coinToWithdraw || !paymentSystem || !accountNumber) return;

    if (parseInt(coinToWithdraw) > totalCoins) {
      return Swal.fire({
        icon: "warning",
        title: "Insufficient Coins",
        text: "You cannot withdraw more coins than you have.",
      });
    }

    const withdrawData = {
      worker_email,
      worker_name,
      withdrawal_coin: parseInt(coinToWithdraw),
      withdrawal_amount: parseFloat(withdrawDollar),
      payment_system: paymentSystem,
      account_number: accountNumber,
      withdraw_date: new Date().toISOString(),
      status: "pending",
    };

    mutation.mutate(withdrawData);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg p-6 rounded-lg">
      <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
        <FaCoins className="text-yellow-500" /> Withdraw Coins
      </h2>

      <p className="mb-2 flex items-center gap-2 text-gray-700">
        <FaCoins className="text-yellow-500" /> Current Coins:{" "}
        <span className="font-bold">{totalCoins}</span>
      </p>

      <p className="mb-4 flex items-center gap-2 text-gray-700">
        <FaDollarSign className="text-green-600" /> Total Dollar:{" "}
        <span className="font-bold">${(totalCoins / 20).toFixed(2)}</span>
      </p>

      {canWithdraw ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Coins to Withdraw</label>
            <input
              type="number"
              min="0"
              value={coinToWithdraw}
              onChange={(e) => setCoinToWithdraw(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Withdrawal Amount ($)
            </label>
            <input
              type="text"
              value={withdrawDollar}
              readOnly
              className="w-full border rounded p-2 bg-gray-100"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">
              Select Payment System
            </label>
            <select
              value={paymentSystem}
              onChange={(e) => setPaymentSystem(e.target.value)}
              className="w-full border rounded p-2"
            >
              <option value="">-- Select --</option>
              <option value="Bkash">Bkash</option>
              <option value="Rocket">Rocket</option>
              <option value="Nagad">Nagad</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isLoading}
            className="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 transition"
          >
            {mutation.isLoading ? "Submitting..." : "Withdraw"}
          </button>
        </form>
      ) : (
        <p className="text-red-600 font-medium text-center mt-4">
          Insufficient coin (Minimum 200 required to withdraw)
        </p>
      )}
    </div>
  );
};

export default WithDraw;
