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

  console.log(submissions);
  // ---------- Loading / Error ----------
  if (isLoading) return <p className="text-center mt-20">Loading...</p>;
  if (isError)
    return (
      <p className="text-center mt-20 text-red-600">Failed to load data.</p>
    );

  if (!submissions.length)
    return <p className="text-center mt-20">No approved submissions found.</p>;

  // ---------- UI ----------
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Approved Submissions
      </h1>

      <div className="overflow-x-auto rounded-lg shadow ring-1 ring-black ring-opacity-5">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Task ID
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Task Title
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Payable Amount
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200 bg-white">
            {submissions.map((sub) => (
              <tr key={sub._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-sm text-gray-700">
                  {sub._id}
                </td>
                <td className="px-4 py-3 text-sm text-gray-800 font-medium">
                  {sub.task_title}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  ${sub.payable_amount}
                </td>
                
                <td className="px-4 py-3 text-sm">
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
                    {sub.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
