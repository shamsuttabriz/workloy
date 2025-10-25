import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import useAuth from "../hooks/useAuth";

const Profile = () => {
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();
  const { user: hello } = useAuth();

  // Fetch user data
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user", hello.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${hello.email}`);
      return res.data;
    },
  });

  // Mutation for update
  const mutation = useMutation({
    mutationFn: async ({ name, image }) => {
      const res = await axiosSecure.put(`/users/${user.email}`, {
        name,
        image,
      });
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user", hello.email], data);
      Swal.fire("Updated!", "Your profile has been updated.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Something went wrong.", "error");
    },
  });

  // Handle profile update
  const handleUpdate = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Update Profile",
      html:
        `<input id="swal-name" class="swal2-input" placeholder="Name" value="${user.name}">` +
        `<input id="swal-image" class="swal2-input" placeholder="Image URL" value="${user.image}">`,
      focusConfirm: false,
      preConfirm: () => ({
        name: document.getElementById("swal-name").value,
        image: document.getElementById("swal-image").value,
      }),
    });

    if (formValues) mutation.mutate({ ...formValues });
  };

  if (isLoading)
    return <p className="text-center mt-20 text-blue-600">Loading...</p>;
  if (isError)
    return (
      <p className="text-center mt-20 text-red-500">
        Something went wrong. Please try again.
      </p>
    );

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-50 to-blue-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 md:p-8 border border-blue-100">
        <div className="flex flex-col items-center">
          <div className="relative">
            <img
              src={user.image || "https://via.placeholder.com/150"}
              alt={user.name}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-4 border-blue-500 shadow-md"
            />
          </div>

          <h2 className="mt-4 text-2xl md:text-3xl font-bold text-blue-700 text-center">
            {user.name}
          </h2>
          <p className="text-blue-600 mt-1">{user.role}</p>
          <p className="text-gray-500 mt-1 break-all">{user.email}</p>
          <p className="text-blue-600 font-medium mt-2">Coins: {user.coins}</p>

          <div className="mt-3 text-gray-400 text-sm text-center space-y-1">
            <p>Joined: {new Date(user.created_at).toLocaleDateString()}</p>
            <p>Last Login: {new Date(user.last_log_in).toLocaleString()}</p>
          </div>

          <button
            onClick={handleUpdate}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition duration-300 w-full"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
