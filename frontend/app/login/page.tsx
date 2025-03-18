"use client";

import useLogin from "./useLogin";

export default function Login() {
  const { register, handleSubmit, errors, onSubmit, isSubmitting, serverError, success } = useLogin();

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
            <p className="text-gray-300 mt-2">Logging in...</p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg w-96">
        <h2 className="text-3xl font-extrabold text-center text-green-400 mb-6">
          Login
        </h2>
        {success && <p className="text-green-500 text-center">{success}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-gray-300 text-lg font-semibold mb-1">
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

          {/* Password Field */}
          <div>
            <label className="block text-gray-300 text-lg font-semibold mb-1">
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
            {serverError && (
              <p className="text-red-400 text-sm mt-1">{serverError}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-green-500 text-white text-xl font-semibold p-3 rounded-3xl hover:bg-green-600 transition duration-300 transform hover:scale-105"
            disabled={isSubmitting}
          >
            Login
          </button>
        <p className="text-gray-300 font-medium"> Don't have an account?  <span className="underline"> <a href="/signup">  Sign Up </a> </span></p>

        </form>
      </div>
    </div>
  );
}
