// src/components/SubmissionModal.jsx
import React from "react";

export default function SubmissionModal({ data, onClose }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Submission Details
        </h2>

        {/* ----- Main Details ----- */}
        <div className="space-y-2 text-gray-700 text-sm leading-relaxed">
          <p>
            <span className="font-semibold">Worker Name:</span>{" "}
            {data.worker_name}
          </p>
          <p>
            <span className="font-semibold">Worker Email:</span>{" "}
            {data.worker_email}
          </p>
          <p>
            <span className="font-semibold">Task Title:</span> {data.task_title}
          </p>
          <p>
            <span className="font-semibold">Task Description:</span>{" "}
            {data.task_description}
          </p>
          <p>
            <span className="font-semibold">Payable Amount:</span> $
            {data.payable_amount}
          </p>
          <p>
            <span className="font-semibold">Submitted At:</span>{" "}
            {new Date(data.createdAt).toLocaleString()}
          </p>
        </div>

        {/* ----- Extra details text ----- */}
        <div className="mt-4">
          <h3 className="font-semibold text-gray-800 mb-1">
            Worker's Submission:
          </h3>
          <p className="text-gray-600 text-sm">{data.submission_details}</p>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
