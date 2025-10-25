import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function ManageUsers() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ✅ Fetch all users
  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users");
      return res.data;
    },
  });

  // ✅ Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      Swal.fire("Deleted!", "User has been removed.", "success");
    },
    onError: () => Swal.fire("Error", "Could not delete user", "error"),
  });

  // ✅ Update user role mutation
  const roleMutation = useMutation({
    mutationFn: async ({ id, role }) =>
      await axiosSecure.patch(`/users/role/${id}`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      Swal.fire("Updated!", "Role updated successfully.", "success");
    },
    onError: () => Swal.fire("Error", "Could not update role", "error"),
  });

  // ✅ Handle state
  if (isLoading)
    return (
      <p className="text-center text-blue-700 mt-8 text-lg font-medium">
        Loading users...
      </p>
    );

  if (isError)
    return (
      <p className="text-center text-red-600 mt-8 text-lg font-medium">
        Failed to load users
      </p>
    );

  if (users.length === 0)
    return (
      <p className="text-center text-blue-700 font-semibold text-2xl my-10">
        No users found
      </p>
    );

  // ✅ Handle role change
  const handleRoleChange = (id, newRole) => {
    roleMutation.mutate({ id, role: newRole });
  };

  // ✅ Handle delete
  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  // ✅ UI
  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-100 to-blue-200 p-6">
      <h1 className="text-3xl font-bold text-center text-blue-800 mb-10">
        Manage Users
      </h1>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center text-blue-900 hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            <img
              src={user.image || "https://tinyurl.com/h3ehhkse"}
              alt={user.name || "User"}
              className="w-20 h-20 rounded-full mb-3 border-2 border-blue-300 object-cover"
            />

            <h2 className="font-semibold text-lg mb-1">
              {user.name || "Unknown User"}
            </h2>
            <p className="text-sm mb-1 break-all">
              {user.email || "No email available"}
            </p>
            <p className="text-sm mb-3 font-medium">Coins: {user.coins ?? 0}</p>

            <select
              value={user.role || "Buyer"}
              onChange={(e) => handleRoleChange(user._id, e.target.value)}
              className="border border-blue-300 rounded-md p-2 text-blue-900 text-center w-full mb-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="Admin">Admin</option>
              <option value="Buyer">Buyer</option>
              <option value="Worker">Worker</option>
            </select>

            <button
              onClick={() => handleDelete(user._id)}
              className="bg-red-500 text-white px-4 py-2 rounded-md w-full hover:bg-red-600 transition-colors duration-200"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
