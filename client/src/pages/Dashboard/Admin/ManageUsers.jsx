import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

export default function ManageUsers() {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ✅ Load all users
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

  console.log(users);

  // ✅ Delete user
  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      Swal.fire("Deleted!", "User has been removed.", "success");
    },
    onError: () => Swal.fire("Error", "Could not delete user", "error"),
  });

  // ✅ Update role
  const roleMutation = useMutation({
    mutationFn: async ({ id, role }) =>
      await axiosSecure.patch(`/users/role/${id}`, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      Swal.fire("Updated!", "Role updated successfully.", "success");
    },
    onError: () => Swal.fire("Error", "Could not update role", "error"),
  });

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Failed to load users</p>;

  const handleRoleChange = (id, newRole) => {
    roleMutation.mutate({ id, role: newRole });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <table className="w-full border border-gray-200">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Photo</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Coins</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="text-center">
              <td className="p-2 border">
                <img
                  src={u.image}
                  alt={u.name}
                  className="w-10 h-10 rounded-full mx-auto"
                />
              </td>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u._id, e.target.value)}
                  className="border rounded p-1"
                >
                  <option value="Admin">Admin</option>
                  <option value="Buyer">Buyer</option>
                  <option value="Worker">Worker</option>
                </select>
              </td>
              <td className="p-2 border">{u.coins}</td>
              <td className="p-2 border space-x-2">
                <button
                  onClick={() => handleDelete(u._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
