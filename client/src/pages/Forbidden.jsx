import React from "react";
import { useNavigate } from "react-router";

export default function Forbidden() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-8xl font-extrabold text-indigo-600">403</h1>
      <h2 className="mt-4 text-3xl font-bold text-gray-800">Forbidden</h2>
      <p className="mt-2 text-gray-600 text-center max-w-md">
        You don’t have permission to view this page.
        Please check your account or contact an administrator.
      </p>

      <div className="mt-6 flex gap-3">
        <button
          onClick={() => navigate(-1)}
          className="px-5 py-2 rounded-md bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
        >
          Go Back
        </button>

        <button
          onClick={() => navigate("/")}
          className="px-5 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Home
        </button>
      </div>
    </div>
  );
}
