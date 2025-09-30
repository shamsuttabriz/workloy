import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import LoadingPage from "../../shared/LoadingPage";

export default function WorkerHome() {
  const axiosSecure = useAxiosSecure();

  const { data: stats = {}, isLoading } = useQuery({
    queryKey: ["worker-stats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/dashboard/worker-stats");
      return res.data;
    },
  });

  if (isLoading) return <LoadingPage />;

  const items = [
    { label: "Total Submissions", value: stats.totalSubmissions, icon: "📑" },
    { label: "Pending Submissions", value: stats.totalPending, icon: "⏳" },
    { label: "Total Earnings ($)", value: stats.totalEarning, icon: "💵" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6">
      {items.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-green-50 to-white shadow-md hover:shadow-lg transition-shadow p-6"
        >
          <span className="text-4xl mb-3">{item.icon}</span>
          <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{item.value}</p>
        </div>
      ))}
    </div>
  );
}
