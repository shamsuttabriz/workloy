import React from "react";

const LoadingPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-base-200">
      {/* DaisyUI spinner */}
      <span className="loading loading-spinner loading-lg text-primary"></span>
    </div>
  );
};

export default LoadingPage;
