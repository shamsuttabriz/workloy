import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";

export default function MySubmission() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["mySubmissions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/submissions/my");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-50 to-blue-100">
        <p className="text-xl font-medium text-blue-600 animate-pulse">
          Loading your submissions...
        </p>
      </div>
    );

  if (!submissions.length)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-sky-50 to-blue-100">
        <p className="text-xl font-medium text-blue-600">
          No submissions found.
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-blue-100 py-10 px-4 md:px-8">
      <div className="max-w-8xl mx-auto">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-bold text-blue-700 mb-2">
            My Submissions
          </h2>
          <p className="text-gray-600">
            My submission demonstrates a clear understanding of the topic.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {submissions.map((sub) => {
            const statusColor =
              sub.status === "pending"
                ? "bg-yellow-100 text-yellow-800"
                : sub.status === "approved"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800";

            return (
              <div
                key={sub._id}
                className="bg-white rounded-lg shadow p-4 flex flex-col justify-between border border-blue-100 hover:shadow-lg hover:scale-[1.02] transition-transform duration-200"
              >
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-xl font-semibold text-gray-800 leading-snug">
                      {sub.task_title}
                    </h2>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}
                    >
                      {sub.status.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-2">
                    <strong>Buyer:</strong> {sub.buyer_name || "Unknown Buyer"}
                  </p>

                  <p className="text-gray-600 mb-2">
                    <strong>Amount:</strong> ${sub.payable_amount ?? 0}
                  </p>

                  <p className="text-gray-600 mb-2">
                    <strong>Date:</strong>{" "}
                    {new Date(sub.current_date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  <div className="mt-3 bg-sky-50 p-3 rounded-xl border border-sky-100">
                    <h3 className="font-medium text-blue-700 mb-1">
                      Submission Details:
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {sub.submission_details}
                    </p>
                  </div>
                </div>

                {/* ✅ Button like TaskList */}
                <Link
                  to={`/dashboard/task-details/${sub._id}`}
                  className="w-full py-2 block mt-3 text-center bg-gradient-to-r from-blue-500 to-sky-400 hover:from-blue-600 hover:to-sky-500 text-white font-medium rounded-xl shadow transition-all duration-300"
                >
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
