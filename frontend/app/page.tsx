import Link from "next/link";

export default function LandingPage() {
  return (

    <div className="min-h-screen bg-cyan-950 text-white flex flex-col items-center justify-center px-6">
      <h1 className="text-6xl font-extrabold text-green-400 mb-4 animate-pulse">
        Build Hierarchy
      </h1>

      <p className="text-lg text-gray-300 mb-6 text-center max-w-lg">
        Manage and visualize your organization's structure effortlessly.
      </p>

      <div className="bg-gray-800 mt-3  p-8 rounded-xl shadow-lg flex flex-col items-center w-full max-w-md">
        <p className="text-gray-300 text-xl font-bold mb-4">Don't have an account?</p>

        <Link
          href="/signup"
          className="text-center bg-green-500 hover:bg-green-600 text-xl text-white font-semibold px-3 py-2 rounded-3xl transition duration-300 transform hover:scale-105"
        >
          Sign Up
        </Link>

        <p className="text-gray-300 text-xl font-bold my-4">Already have an account?</p>

        <Link
          href="/login"
          className="text-center bg-gray-700 hover:bg-gray-600 text-xl text-white font-semibold px-3 py-2  rounded-3xl transition duration-300 transform hover:scale-105"
        >
          Login
        </Link>
      </div>
    </div>
  );
}
