import { useState } from "react";

function Registration({ onSignIn }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f3ed] flex items-center justify-center px-4 py-8">

      {/* Signup Card */}
      <div className="w-full max-w-[520px] bg-white rounded-[24px] shadow-lg px-8 py-8">

        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Shop<span className="text-[#b47a2a]">360</span>
          </h1>
        </div>

        {/* Heading */}
        <div className="text-center mt-6">
          <h2 className="text-3xl font-bold text-black">
            Create your account
          </h2>

          <p className="text-base text-gray-500 mt-2">
            Join Shop360 and start shopping
          </p>
        </div>

        {/* Form */}
        <form className="mt-7">

          {/* Full Name */}
          <div>
            <label className="block text-base font-semibold text-black mb-2">
              Full Name
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
                </svg>
              </span>

              <input
                type="text"
                placeholder="Full Name"
                className="w-full h-12 border border-gray-300 rounded-xl pl-12 pr-4 text-sm outline-none focus:border-[#b47a2a] focus:ring-1 focus:ring-[#b47a2a]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mt-4">
            <label className="block text-base font-semibold text-black mb-2">
              Email Address
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>

              <input
                type="email"
                placeholder="Email Address"
                className="w-full h-12 border border-gray-300 rounded-xl pl-12 pr-4 text-sm outline-none focus:border-[#b47a2a] focus:ring-1 focus:ring-[#b47a2a]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-4">
            <label className="block text-base font-semibold text-black mb-2">
              Password
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="5" y="10" width="14" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full h-12 border border-gray-300 rounded-xl pl-12 pr-12 text-sm outline-none focus:border-[#b47a2a] focus:ring-1 focus:ring-[#b47a2a]"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? (
                  <span>◉</span>
                ) : (
                  <span>◌</span>
                )}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mt-4">
            <label className="block text-base font-semibold text-black mb-2">
              Confirm Password
            </label>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="5" y="10" width="14" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
              </span>

              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full h-12 border border-gray-300 rounded-xl pl-12 pr-12 text-sm outline-none focus:border-[#b47a2a] focus:ring-1 focus:ring-[#b47a2a]"
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPassword ? (
                  <span>◉</span>
                ) : (
                  <span>◌</span>
                )}
              </button>
            </div>
          </div>

          {/* Terms */}
          <label className="flex items-center gap-2 mt-5 text-sm text-gray-600">
            <input
              type="checkbox"
              className="w-4 h-4"
            />

            <span>
              I agree to the{" "}
              <span className="font-semibold text-black">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="font-semibold text-black">
                Privacy Policy
              </span>
            </span>
          </label>

          {/* Create Account */}
          <button
            type="submit"
            className="w-full h-12 bg-black text-white rounded-xl text-base font-bold mt-5 hover:bg-gray-800 transition"
          >
            Create Account
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 mt-5">
          <div className="flex-1 border-t border-gray-200"></div>

          <span className="text-sm text-gray-500 whitespace-nowrap">
            or sign up with
          </span>

          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google + Apple */}
        <div className="grid grid-cols-2 gap-3 mt-4">

          {/* Google */}
          <button
            type="button"
            className="h-11 border border-gray-300 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M21.35 12.27c0-.78-.07-1.54-.2-2.27H12v4.3h5.22a4.46 4.46 0 0 1-1.94 2.92v2.42h3.14c1.84-1.69 2.93-4.18 2.93-7.37Z"
              />
              <path
                fill="#34A853"
                d="M12 21.5c2.63 0 4.84-.87 6.45-2.36l-3.14-2.42c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.5A9.74 9.74 0 0 0 12 21.5Z"
              />
              <path
                fill="#FBBC05"
                d="M6.54 13.61A5.85 5.85 0 0 1 6.23 12c0-.56.11-1.1.31-1.61v-2.5H3.3A9.5 9.5 0 0 0 2.5 12c0 1.53.37 2.98.8 4.11l3.24-2.5Z"
              />
              <path
                fill="#EA4335"
                d="M12 6.36c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.47 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.39l3.24 2.5c1.01-2.31 3.16-4.03 5.7-4.03Z"
              />
            </svg>

            <span className="text-sm font-medium">Google</span>
          </button>

          {/* Apple */}
          <button
            type="button"
            className="h-11 border border-gray-300 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M16.7 12.8c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.7.8-3.4 2-.1.2-1.1 1.9-.3 4.2.4 1.2 1 2.5 1.8 3.4.7.9 1.5 1.8 2.6 1.8 1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.1 0 1.8-.9 2.5-1.8.8-1 1.1-2 1.5-3.1-.1 0-3-.1-3-3.4Z" />
              <path d="M14.6 6.4c.6-.7 1-1.6.9-2.6-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.5 1 .1 1.9-.5 2.5-1.2Z" />
            </svg>

            <span className="text-sm font-medium">Apple</span>
          </button>

        </div>

        {/* Sign In */}
        <p className="text-center text-sm text-gray-500 mt-5">
          Already have an account?{" "}

          <button
            type="button"
            onClick={onSignIn}
            className="text-[#b47a2a] font-semibold hover:underline"
          >
            Sign In
          </button>
        </p>

      </div>
    </div>
  );
}

export default Registration;