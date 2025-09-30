import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function BuyerHome() {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["buyer-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/buyer-stats");
      return res.data;
    },
  });

  console.log(stats)

  if (isLoading) return <p className="text-center py-6">Loading...</p>;

  const items = [
    { label: "Total Tasks", value: stats.totalTasks, icon: "📋" },
    { label: "Pending Tasks", value: stats.totalPending, icon: "⏳" },
    { label: "Total Payment", value: stats.totalPayment, icon: "💳" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-white shadow-md hover:shadow-lg transition-shadow p-6"
        >
          <span className="text-4xl mb-3">{item.icon}</span>
          <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
