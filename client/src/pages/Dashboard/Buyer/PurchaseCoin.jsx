import React from "react";
import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";

// ✅ এই data পরে সহজে আপডেট করা যাবে
const packages = [
  { id: "coin1", coins: 10, price: 1 },
  { id: "coin2", coins: 150, price: 10 },
  { id: "coin3", coins: 500, price: 20 },
  { id: "coin4", coins: 1000, price: 35 },
];

export default function PurchaseCoin() {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user);


  // ✅ Dummy Payment handler
  const handlePurchase = async (pkg) => {
    console.log(pkg);
    console.log(pkg.id);
    // এখানে আসল Stripe Checkout integration হবে।
    // এখন আমরা শুধু একটা dummy success flow বানালাম।
    // const confirm = window.confirm(
    //   `Confirm purchase: ${pkg.coins} coins for $${pkg.price}?`
    // );
    // if (!confirm) return;

    // ----- Demo: Payment successful -----
    // Payment info save করার জন্য যেভাবে call করতে হবে:
    const paymentInfo = {
      userId: user.uid, // ✅ প্রকৃত user context থেকে আনবেন
      coinsPurchased: pkg.coins,
      amountPaid: pkg.price,
      date: new Date().toISOString(),
      paymentId: `dummy_${Date.now()}`, // Stripe হলে এখানে stripe paymentId আসবে
    };
    console.log("✅ Payment Info Saved:", paymentInfo);

    // Buyer এর coin update করার জন্য আপনার backend call করবেন:
    // await fetch("/api/updateCoins", { method:"POST", body: JSON.stringify(paymentInfo) })

    // alert(`🎉 Payment successful! ${pkg.coins} coins added to your account.`);
    navigate(`/dashboard/payment/${pkg.id}`, {state: paymentInfo}); // ✅ Payment শেষে যেখানেই redirect করতে চান
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-50 to-blue-100 flex flex-col items-center py-12 px-4">
      <h1 className="text-3xl font-bold text-blue-800 mb-10 text-center">
        Purchase Coins
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {packages.map((pkg) => (
          <div
            key={pkg.coins}
            className="card shadow-xl border border-blue-200 hover:shadow-2xl transition-all duration-300 bg-white"
          >
            <div className="card-body items-center text-center">
              <h2 className="card-title text-2xl text-blue-700">
                {pkg.coins} Coins
              </h2>
              <p className="text-gray-600 text-lg">= ${pkg.price}</p>

              <div className="card-actions mt-6">
                <button
                  onClick={() => handlePurchase(pkg)}
                  className="btn btn-primary bg-blue-600 hover:bg-blue-700 text-white w-full"
                >
                  Buy ${pkg.price}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-12 text-gray-500 text-center text-sm">
        Stripe payment integration can be added.
      </p>
    </div>
  );
}
