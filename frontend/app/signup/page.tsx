"use client";

import useSignup from "./useSignup";

export default function Signup() {
  const { register, handleSubmit, errors, onSubmit, isSubmitting, serverError } = useSignup();

  return (
    <div className="min-h-screen flex items-center justify-center bg-cyan-950 relative">

      {/* Loading Spinner */}
      {isSubmitting && (
        <div className="absolute inset-0 flex items-center justify-center bg-cyan-950 bg-opacity-90 z-50">
          <div className="flex flex-col items-center">
            <svg
              className="animate-spin h-12 w-12 text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <p className="text-gray-300 mt-2">Signing Up...</p>
          </div>
        </div>
      )}

      <div className="bg-gray-800 py-2 px-10 rounded-xl shadow-lg w-96">
        <h2 className="text-3xl font-extrabold text-center text-green-400 mb-6">
          Sign Up
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div>
            <label className="block text-gray-300 text-md font-semibold mb-1">
              Name
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-md font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-gray-300 text-md font-semibold mb-1">
              Description
            </label>
            <textarea
              {...register("description")}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Tell us about the company (optional)"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-md font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-red-400 text-sm mt-1">{serverError}</p>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-green-500 text-white text-xl font-semibold p-3 rounded-3xl hover:bg-green-600 transition duration-300 transform hover:scale-105"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        <p className="text-gray-300 font-medium mt-4"> Already have an account?  <span className="underline"> <a href="/login">  Login </a> </span></p>
      </div>
    </div>
  );
}

