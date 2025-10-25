import React from "react";
import { useNavigate } from "react-router";
import useAuth from "../../../hooks/useAuth";

// Coin packages
const packages = [
  { id: "coin1", coins: 10, price: 1 },
  { id: "coin2", coins: 150, price: 10 },
  { id: "coin3", coins: 500, price: 20 },
  { id: "coin4", coins: 1000, price: 35 },
];

export default function PurchaseCoin() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dummy purchase handler
  const handlePurchase = (pkg) => {
    // Payment simulation
    const paymentInfo = {
      userId: user.uid,
      coinsPurchased: pkg.coins,
      amountPaid: pkg.price,
      date: new Date().toISOString(),
      paymentId: `dummy_${Date.now()}`,
    };

    console.log("✅ Payment Info:", paymentInfo);

    // Navigate to payment page
    navigate(`/dashboard/payment/${pkg.id}`, { state: paymentInfo });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-50 to-blue-100 flex flex-col items-center py-12 px-4">
      {/* Title */}
      <h1 className="text-3xl font-bold text-blue-800 mb-10 text-center">
        Purchase Coins
      </h1>

      {/* Coin Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-2xl shadow-xl border border-blue-200 p-6 flex flex-col items-center text-center hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl font-bold text-blue-700">
              {pkg.coins} Coins
            </h2>
            <p className="text-gray-600 text-lg mt-2">= ${pkg.price}</p>

            <button
              onClick={() => handlePurchase(pkg)}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-medium transition-colors"
            >
              Buy ${pkg.price}
            </button>
          </div>
        ))}
      </div>

      {/* Footer Note */}
      <p className="mt-12 text-gray-500 text-center text-sm">
        Stripe payment integration can be added.
      </p>
    </div>
  );
}
