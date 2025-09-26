import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import userAxios from "../../hooks/userAxios";

function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const navigate = useNavigate();
  const { user, setUser, createUser, updateUser, setCoins } = useAuth();
  const [message, setMessage] = useState({ type: "", text: "" });
  const axiosInstance = userAxios();

  // Password must be at least 8 chars with 1 number & 1 special character
  const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

  const onSubmit = async (data) => {
    setMessage({ type: "", text: "" });

    const { name, photo, email, password, role } = data;
    const coins = role?.toLowerCase() === "worker" ? 10 : 50;

    try {
      // Create user
      await createUser(email, password);

      // Update profile
      await updateUser({ displayName: name, photoURL: photo });

      // Update local state
      setUser({ ...user, displayName: name, photoURL: photo });
      setCoins(coins);

      // update userInfo in the database
      const userInfo = {
        email,
        role,
        coins,
        created_at: new Date().toISOString(),
        last_log_in: new Date().toISOString(),
      };

      const userRes = await axiosInstance.post("/users", userInfo);
      console.log(userRes.data);

      // Notify success
      Swal.fire({
        icon: "success",
        title: "Account Created",
        text: "Your account has been successfully created!",
      });

      setMessage({
        type: "success",
        text: `Registration successful! You received ${coins} coins as a ${role}.`,
      });

      reset();
      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      Swal.fire({
        toast: true,
        position: "center",
        icon: "error",
        title: "Registration Failed",
        text: error.message,
        showConfirmButton: false,
        timer: 2000,
      });
      setMessage({
        type: "error",
        text: error.message || "❗ Registration failed!",
      });
    }
  };

  return (
    <div className="min-h-[calc(100vh-100px)] w-full flex items-center justify-center px-0 md:px-4">
      <div className="w-full max-w-lg rounded-xl md:p-8 bg-light shadow-lg">
        {/* Header */}
        <div className="my-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-dark)]">
            Create an Account
          </h2>
          <p className="text-base mt-2 text-[var(--color-natural-light)]">
            Register with Workloy
          </p>
        </div>

        {/* Feedback Message */}
        {message.text && (
          <div
            className={`mb-4 text-center font-medium ${
              message.type === "success" ? "text-green-600" : "text-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 px-4 pb-4">
          {/* Name */}
          <div>
            <label className="label">
              <span className="text-natural-dark font-semibold">Name</span>
            </label>
            <input
              type="text"
              {...register("name", { required: "Name is required" })}
              className="input input-bordered w-full"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="label">
              <span className="text-natural-dark font-semibold">Email</span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
              className="input input-bordered w-full"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Profile Picture URL */}
          <div>
            <label className="label">
              <span className="text-natural-dark font-semibold">
                Profile Picture URL
              </span>
            </label>
            <input
              type="url"
              {...register("photo", { required: "Profile URL is required" })}
              className="input input-bordered w-full"
              placeholder="Enter profile picture URL"
            />
            {errors.photo && (
              <p className="text-red-500 text-sm mt-1">
                {errors.photo.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="text-natural-dark font-semibold">Password</span>
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                validate: (value) =>
                  passwordRegex.test(value) ||
                  "Min 8 chars, at least 1 number & 1 special character",
              })}
              className="input input-bordered w-full"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Role Drop-down */}
          <div>
            <label className="label">
              <span className="text-natural-dark font-semibold">
                Select Role
              </span>
            </label>
            <select
              {...register("role", { required: "Select a role" })}
              className="select select-bordered w-full"
            >
              <option value="">Select...</option>
              <option value="Worker">Worker</option>
              <option value="Buyer">Buyer</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="btn w-full mt-2 bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-dark)]"
          >
            Register
          </button>

          {/* Redirect to Login */}
          <div className="text-center text-[var(--color-natural-light)] mt-3">
            Already have an account?{" "}
            <Link className="text-[var(--color-brand)] font-medium" to="/login">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
