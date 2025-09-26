import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useAuth from "../../../hooks/useAuth";
import { Link } from "react-router";

export default function MySubmission() {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  // Fetch submissions
  const { data: submissions = [], isLoading } = useQuery({
    queryKey: ["mySubmissions"],
    queryFn: async () => {
      const res = await axiosSecure.get("/submissions/my");
      return res.data;
    },
  });

  if (isLoading)
    return (
      <p className="text-center mt-20 text-xl font-medium text-gray-500">
        Loading...
      </p>
    );

  if (!submissions.length)
    return (
      <p className="text-center mt-20 text-xl font-medium text-gray-500">
        No submissions found.
      </p>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 my-12">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-10 text-center">
        My Submissions
      </h1>

      <div className="grid gap-6 md:grid-cols-2">
        {submissions.map((sub) => (
          <div
            key={sub._id}
            className="bg-white shadow-lg rounded-xl border border-gray-200 overflow-hidden hover:scale-105 transition-transform duration-300"
          >
            <div className="p-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  {sub.task_title}
                </h2>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    sub.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : sub.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {sub.status.toUpperCase()}
                </span>
              </div>

              <p className="text-gray-600 mb-2">
                <strong>Buyer:</strong> {sub.buyer_name}
              </p>

              <p className="text-gray-600 mb-2">
                <strong>Amount:</strong> ${sub.payable_amount}
              </p>

              <p className="text-gray-600 mb-2">
                <strong>Date:</strong>{" "}
                {new Date(sub.current_date).toLocaleDateString()}
              </p>

              <div className="mt-3 bg-gray-50 p-3 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-1">
                  Submission Details:
                </h3>
                <p className="text-gray-600 text-sm">
                  {sub.submission_details}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
