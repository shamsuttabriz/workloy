import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function AdminHome() {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/admin-home/admin-stats");
      return res.data;
    },
  });

  if (isLoading) return <p className="text-center py-6">Loading...</p>;

  const items = [
    { label: "Workers", value: stats.totalWorkers, icon: "👷" },
    { label: "Buyers", value: stats.totalBuyers, icon: "🛍️" },
    { label: "Coins", value: stats.totalAvailableCoins, icon: "💰" },
    { label: "Payments", value: stats.totalPayments, icon: "💳" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-white shadow-md hover:shadow-lg transition-shadow p-6"
        >
          <span className="text-4xl mb-3">{item.icon}</span>
          <h3 className="text-xl font-semibold text-gray-800">{item.label}</h3>
          <p className="text-2xl font-bold text-indigo-600 mt-2">
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}
