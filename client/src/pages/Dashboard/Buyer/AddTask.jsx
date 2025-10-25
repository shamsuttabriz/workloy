import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import useDbUser from "../../../hooks/useDbUser";

const AddTask = () => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const userInfo = useDbUser();
  const [uploading, setUploading] = useState(false);

  const userCoin = userInfo?.coins || 0;
  const imgbbKey = import.meta.env.VITE_IMGBB_API_KEY;

  const requiredWorkers = watch("required_workers") || 0;
  const payableAmount = watch("payable_amount") || 0;
  const totalPayable = requiredWorkers * payableAmount;

  const saveTask = async (taskData) => {
    try {
      await axiosSecure.post("/tasks", taskData);
      navigate("/dashboard/my-tasks");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to save task", "error");
    }
  };

  const reduceCoin = async (amount) => {
    await axiosSecure.patch(`/users/${user.email}`, { increment: -amount });
  };

  const onSubmit = async (data) => {
    if (totalPayable > userCoin) {
      return Swal.fire({
        icon: "warning",
        title: "Not enough coins",
        text: "Please purchase coins first",
      }).then(() => navigate("/dashboard/purchase-coin"));
    }

    setUploading(true);
    const imageFile = data.task_image[0];
    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
        {
          method: "POST",
          body: formData,
        }
      );
      const imgResponse = await res.json();
      setUploading(false);

      if (!imgResponse.success) {
        return Swal.fire("Error", "Image upload failed!", "error");
      }

      const imageUrl = imgResponse.data.url;

      await saveTask({
        task_title: data.task_title,
        task_detail: data.task_detail,
        required_workers: data.required_workers,
        payable_amount: data.payable_amount,
        completion_date: data.completion_date,
        submission_info: data.submission_info,
        task_image_url: imageUrl,
        total_payable_amount: totalPayable,
        created_by: user.email,
      });

      await reduceCoin(totalPayable);

      Swal.fire({
        icon: "success",
        title: "Task Added Successfully",
        showConfirmButton: false,
        timer: 1500,
      });

      reset();
    } catch (error) {
      setUploading(false);
      console.error(error);
      Swal.fire("Error", "Something went wrong!", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-sky-50 to-blue-100 flex justify-center items-center px-4 py-12">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-8 border border-blue-200">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-blue-700 mb-8">
          ➕ Add New Task
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Task Title */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Task Title</span>
            </label>
            <input
              type="text"
              placeholder="Ex: Watch my YouTube video and comment"
              className="input input-bordered w-full"
              {...register("task_title", {
                required: "Task title is required",
              })}
            />
            {errors.task_title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.task_title.message}
              </p>
            )}
          </div>

          {/* Task Detail */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Task Detail</span>
            </label>
            <textarea
              placeholder="Describe the task in detail"
              className="textarea textarea-bordered w-full"
              rows={4}
              {...register("task_detail", {
                required: "Task detail is required",
              })}
            />
            {errors.task_detail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.task_detail.message}
              </p>
            )}
          </div>

          {/* Workers & Payable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Required Workers
                </span>
              </label>
              <input
                type="number"
                placeholder="Ex: 100"
                className="input input-bordered w-full"
                {...register("required_workers", {
                  required: "Required workers is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "At least 1 worker" },
                })}
              />
              {errors.required_workers && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.required_workers.message}
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text font-semibold">
                  Payable Amount (per worker)
                </span>
              </label>
              <input
                type="number"
                placeholder="Ex: 10"
                className="input input-bordered w-full"
                {...register("payable_amount", {
                  required: "Payable amount is required",
                  valueAsNumber: true,
                  min: { value: 1, message: "Amount must be greater than 0" },
                })}
              />
              {errors.payable_amount && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.payable_amount.message}
                </p>
              )}
            </div>
          </div>

          <p className="text-blue-700 font-semibold text-right">
            Total Pay: {totalPayable} coins
          </p>

          {/* Completion Date */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Completion Date</span>
            </label>
            <input
              type="date"
              className="input input-bordered w-full"
              {...register("completion_date", {
                required: "Completion date is required",
              })}
            />
            {errors.completion_date && (
              <p className="text-red-500 text-sm mt-1">
                {errors.completion_date.message}
              </p>
            )}
          </div>

          {/* Submission Info */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Submission Info</span>
            </label>
            <input
              type="text"
              placeholder="What to submit (e.g. screenshot / proof)"
              className="input input-bordered w-full"
              {...register("submission_info", {
                required: "Submission info is required",
              })}
            />
            {errors.submission_info && (
              <p className="text-red-500 text-sm mt-1">
                {errors.submission_info.message}
              </p>
            )}
          </div>

          {/* Task Image */}
          <div>
            <label className="label">
              <span className="label-text font-semibold">Task Image</span>
            </label>
            <input
              type="file"
              accept="image/*"
              className="file-input file-input-bordered w-full"
              {...register("task_image", {
                required: "Task image is required",
              })}
            />
            {errors.task_image && (
              <p className="text-red-500 text-sm mt-1">
                {errors.task_image.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              className="btn btn-primary w-full md:w-1/2 bg-blue-600 hover:bg-blue-700 text-white transition"
              disabled={uploading}
            >
              {uploading ? "Uploading..." : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
