import { useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { registerAccount } from "../services/authService";
import {
  page, card, title, label, input, errorText, darkButton, backButton,
} from "../../shared/ui";

const Signup = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const accountType = searchParams.get("type") === "vendor" ? "vendor" : "customer";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = {};
    if (name.trim().length < 2) next.name = "Enter your full name.";
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) next.email = "Enter a valid email address.";
    if (password.length < 6) next.password = "Password must be at least 6 characters.";
    if (confirmPassword !== password) next.confirmPassword = "Passwords do not match.";

    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const result = await registerAccount({
      name,
      email,
      password,
      type: accountType,
    });
    setSubmitting(false);

    if (!result.ok) {
      setErrors(
        result.error === "exists"
          ? { email: "An account with this email already exists. Please sign in." }
          : { form: result.message }
      );
      return;
    }

    // Account is created. Send the user to Sign In (they are not logged in yet).
    navigate("/login", {
      replace: true,
      state: {
        from: location.state?.from,
        email: email.trim(),
        justRegistered: true,
      },
    });
  };

  return (
    <div style={page}>
      <Navbar />

      <main style={{ padding: "35px 40px 70px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto" }}>
          <button type="button" onClick={() => navigate("/signup", { state: location.state })} style={backButton}>
            ← Back to Account Type
          </button>

          <form onSubmit={handleSubmit} noValidate style={card}>
            <h1 style={{ ...title, marginBottom: "24px" }}>Create account</h1>

            <div style={{ marginBottom: "18px" }}>
              <label htmlFor="name" style={label}>Full name</label>
              <input
                id="name"
                style={input}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <p style={errorText}>{errors.name}</p>}
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label htmlFor="email" style={label}>Email address</label>
              <input
                id="email"
                type="email"
                style={input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p style={errorText}>{errors.email}</p>}
            </div>

            <div style={{ marginBottom: "18px" }}>
              <label htmlFor="password" style={label}>Password</label>
              <input
                id="password"
                type="password"
                style={input}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p style={errorText}>{errors.password}</p>}
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label htmlFor="confirmPassword" style={label}>Confirm password</label>
              <input
                id="confirmPassword"
                type="password"
                style={input}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && (
                <p style={errorText}>{errors.confirmPassword}</p>
              )}
            </div>

            {errors.form && <p style={{ ...errorText, margin: "0 0 12px" }}>{errors.form}</p>}

            <button type="submit" disabled={submitting} style={darkButton}>
              {submitting ? "Creating account..." : "Continue"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Signup;
