import { useState } from "react";

function Login({ onSignUp }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f3ed] flex items-center justify-center px-4 py-8">

      {/* Login Card */}
      <div className="w-full max-w-[520px] bg-white rounded-[24px] shadow-lg px-8 py-10">

        {/* Logo */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Shop<span className="text-[#b47a2a]">360</span>
          </h1>
        </div>

        {/* Welcome */}
        <div className="text-center mt-7">
          <h2 className="text-3xl font-bold text-black">
            Welcome back! 👋
          </h2>

          <p className="text-lg text-gray-500 mt-2">
            Sign in to continue
          </p>
        </div>

        {/* Login Form */}
        <form className="mt-8">

          {/* Email */}
          <div>
            <label className="block text-lg font-semibold text-black mb-2">
              Email Address
            </label>

            <div className="relative">
              {/* Mail Icon */}
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <svg
                  width="24"
                  height="24"
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
                placeholder="Enter your email address"
                className="w-full h-16 border border-gray-300 rounded-xl pl-14 pr-5 text-lg outline-none focus:border-[#b47a2a] focus:ring-1 focus:ring-[#b47a2a]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mt-6">
            <label className="block text-lg font-semibold text-black mb-2">
              Password
            </label>

            <div className="relative">

              {/* Lock Icon */}
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="5" y="10" width="14" height="10" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                  <circle cx="12" cy="15" r="1" />
                </svg>
              </span>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full h-16 border border-gray-300 rounded-xl pl-14 pr-14 text-lg outline-none focus:border-[#b47a2a] focus:ring-1 focus:ring-[#b47a2a]"
              />

              {/* Eye Icon */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
              >
                {showPassword ? (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M3 3l18 18" />
                    <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                    <path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c5 0 8.5 4 9.5 8-.4 1.6-1.2 3-2.3 4.2" />
                    <path d="M6.2 6.2C4.5 7.4 3.4 9.1 2.5 12c1 4 4.5 8 9.5 8 1.5 0 2.8-.3 4-.8" />
                  </svg>
                ) : (
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Remember Me + Forgot Password */}
          <div className="flex items-center justify-between mt-5">

            <label className="flex items-center gap-2 text-base text-gray-700">
              <input
                type="checkbox"
                className="w-4 h-4 accent-black"
              />
              Remember me
            </label>

            <button
              type="button"
              className="text-base font-semibold text-[#b47a2a] hover:underline"
            >
              Forgot Password?
            </button>

          </div>

          {/* Sign In */}
          <button
            type="submit"
            className="w-full h-14 bg-black text-white rounded-xl text-lg font-bold mt-7 hover:bg-gray-800 transition"
          >
            Sign In
          </button>

        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 mt-9">
          <div className="flex-1 border-t border-gray-200"></div>

          <span className="text-gray-500 text-base whitespace-nowrap">
            or continue with
          </span>

          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Google + Apple */}
        <div className="grid grid-cols-2 gap-4 mt-7">

          {/* Google */}
          <button
            type="button"
            className="h-16 border border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <svg width="25" height="25" viewBox="0 0 24 24">
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
                d="M12 6.36c1.43 0 2.71.49 3.72 1.46l2.79-2.79C16.83 3.47 14.63 2.5 12 2.5a9.74 9.74 0 0 0-8.7 5.39l3.24 2.5C7.31 8.08 9.46 6.36 12 6.36Z"
              />
            </svg>

            <span className="text-sm font-medium">
              Continue with
              <br />
              Google
            </span>
          </button>

          {/* Apple */}
          <button
            type="button"
            className="h-16 border border-gray-300 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-50 transition"
          >
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M16.7 12.8c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.7-1.3-.1-2.5.8-3.2.8-.7 0-1.7-.8-2.8-.8-1.4 0-2.7.8-3.4 2-.1.2-1.1 1.9-.3 4.2.4 1.2 1 2.5 1.8 3.4.7.9 1.5 1.8 2.6 1.8 1 0 1.5-.7 2.8-.7s1.7.7 2.8.7c1.1 0 1.8-.9 2.5-1.8.8-1 1.1-2 1.5-3.1-.1 0-3-.1-3-3.4Z" />
              <path d="M14.6 6.4c.6-.7 1-1.6.9-2.6-.9 0-1.9.6-2.5 1.3-.5.6-1 1.6-.9 2.5 1 .1 1.9-.5 2.5-1.2Z" />
            </svg>

            <span className="text-sm font-medium">
              Continue with
              <br />
              Apple
            </span>
          </button>

        </div>

        {/* Create Account */}
        <p className="text-center text-gray-500 mt-9 text-base">
          Don't have an account?{" "}

          <button
            type="button"
            onClick={onSignUp}
            className="text-[#b47a2a] font-semibold hover:underline"
          >
            Create Account
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;