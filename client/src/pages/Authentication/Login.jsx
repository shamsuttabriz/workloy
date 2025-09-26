import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";
import userAxios from "../../hooks/userAxios";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { signIn, signInGoogle } = useAuth();
  const [loginError, setLoginError] = useState("");

  const axiosInstance = userAxios();

  // ✅ Email + Password Login
  const onSubmit = (data) => {
    setLoginError("");
    signIn(data.email, data.password)
      .then(() => navigate("/dashboard"))
      .catch(() =>
        setLoginError("Incorrect email or password. Please try again.")
      );
  };

  // ✅ Google Sign-In
  const handlesignInGoogle = () => {
    setLoginError("");
    signInGoogle()
      .then(async (result) => {
        console.log(result);
        console.log(result.user);
        // update userInfo in the database
        const userInfo = {
          email: result.user.email,
          role: "Worker",
          created_at: new Date().toISOString(),
          last_log_in: new Date().toISOString(),
        };

        const res = await axiosInstance.post("/users", userInfo);
        console.log(res.data);
        navigate("/dashboard");
      })
      .catch(() => setLoginError("Google sign-in failed. Try again later."));
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl p-4 md:p-8 bg-[var(--color-light)] shadow-md">
        {/* Header */}
        <div className="mb-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark">
            Welcome Back
          </h2>
          <p className="text-base mt-2 text-natural-light">
            Sign in with Workloy
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Email */}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-[var(--color-natural-dark)]">
                Email
              </span>
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className="input input-bordered w-full focus:border-[var(--color-brand)]"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="label">
              <span className="label-text font-semibold text-[var(--color-natural-dark)]">
                Password
              </span>
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Minimum 6 characters required",
                },
              })}
              className="input input-bordered w-full focus:border-[var(--color-brand)]"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Error for incorrect email/password */}
          {loginError && (
            <p className="text-red-500 text-sm text-center">{loginError}</p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            className="btn w-full mt-2 bg-[var(--color-brand)] hover:bg-[var(--color-brand-dark)] text-white"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-[var(--color-natural-light)]"></div>
          <span className="px-2 text-[var(--color-natural-light)] text-sm">
            OR
          </span>
          <div className="flex-grow h-px bg-[var(--color-natural-light)]"></div>
        </div>

        {/* Google Sign-In */}
        <button
          onClick={handlesignInGoogle}
          className="btn w-full border border-[var(--color-natural-light)] text-[var(--color-natural-dark)] hover:bg-[var(--color-light)] flex items-center gap-2"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        {/* Redirect to Register */}
        <div className="text-[var(--color-natural-light)] text-center mt-4">
          Don't have an account?{" "}
          <Link
            className="text-[var(--color-brand)] hover:underline"
            to="/register"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
