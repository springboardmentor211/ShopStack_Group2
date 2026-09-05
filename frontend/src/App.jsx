import { useState } from "react";

function App() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* Logo */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black">
            Shop360
          </h1>

          {isSignUp ? (
            <>
              <h2 className="text-2xl font-semibold mt-6">
                Create your account
              </h2>

              <p className="text-gray-500 mt-2">
                Join Shop360 and start shopping
              </p>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mt-6">
                Welcome back! 👋
              </h2>

              <p className="text-gray-500 mt-2">
                Sign in to continue
              </p>
            </>
          )}
        </div>

        {/* ================= SIGN UP ================= */}
        {isSignUp ? (
          <>
            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter your full name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 outline-none focus:ring-2 focus:ring-black"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 outline-none focus:ring-2 focus:ring-black"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 text-sm text-gray-600 mb-6">
              <input
                type="checkbox"
                className="mt-1"
              />

              <span>
                I agree to the Terms and Conditions
              </span>
            </label>

            {/* Create Account */}
            <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800">
              Create Account
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>

              <span className="text-sm text-gray-400">
                or continue with
              </span>

              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Google / Apple */}
            <div className="flex gap-3">
              <button className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50">
                Google
              </button>

              <button className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50">
                Apple
              </button>
            </div>

            {/* Login / Sign In */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}

              <button
                onClick={() => setIsSignUp(false)}
                className="text-black font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          </>
        ) : (
          /* ================= LOGIN ================= */
          <>
            {/* Email */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email address"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-16 outline-none focus:ring-2 focus:ring-black"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between mb-6">

              <label className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" />
                Remember me
              </label>

              <button className="text-sm font-medium text-black hover:underline">
                Forgot Password?
              </button>

            </div>

            {/* Sign In */}
            <button className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800">
              Sign In
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-200"></div>

              <span className="text-sm text-gray-400">
                or continue with
              </span>

              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* Google / Apple */}
            <div className="flex gap-3">
              <button className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50">
                Google
              </button>

              <button className="flex-1 border border-gray-300 py-3 rounded-lg font-medium hover:bg-gray-50">
                Apple
              </button>
            </div>

            {/* Sign Up */}
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{" "}

              <button
                onClick={() => setIsSignUp(true)}
                className="text-black font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          </>
        )}

      </div>
    </div>
  );
}

export default App;