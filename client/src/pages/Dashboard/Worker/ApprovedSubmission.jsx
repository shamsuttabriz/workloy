import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function ApprovedSubmission() {
  const axiosSecure = useAxiosSecure();

  // ---------- Fetch Approved Submissions ----------
  const {
    isLoading,
    isError,
    data: submissions = [],
  } = useQuery({
    queryKey: ["approvedSubmissions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/submissions/my");
      return res.data.filter((item) => item.status === "approved");
    },
  });

  // ---------- Loading / Error ----------
  if (isLoading)
    return <p className="text-center mt-20 text-blue-600">Loading...</p>;
  if (isError)
    return (
      <p className="text-center mt-20 text-red-600">Failed to load data.</p>
    );
  if (!submissions.length)
    return (
      <p className="text-center mt-20 text-blue-600">
        No approved submissions found.
      </p>
    );

  // ---------- UI ----------
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 py-10 px-4 md:px-8">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-2">
          Approved Submissions
        </h2>
        <p className="text-gray-600">
          My submission demonstrates a clear understanding of the topic.
        </p>
      </div>

      {/* Responsive Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {submissions.map((sub) => (
          <div
            key={sub._id}
            className="bg-white shadow-md rounded-2xl p-5 border border-blue-100 hover:shadow-lg transition duration-200"
          >
            <h2 className="text-lg font-semibold text-blue-700 mb-2">
              {sub.task_title}
            </h2>

            <p className="text-sm text-slate-900 mb-1">
              <span className="font-medium">Task ID:</span> {sub._id}
            </p>

            <p className="text-sm text-slate-900 mb-1">
              <span className="font-medium">Payable Amount:</span> $
              {sub.payable_amount}
            </p>

            <div className="mt-3">
              <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                {sub.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
