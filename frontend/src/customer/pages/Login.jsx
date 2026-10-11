import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadProducts } from "../../store/productsSlice";
import { loadCart } from "../../store/cartSlice";
import { loadWishlist } from "../../store/wishlistSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { loginWithPassword } from "../services/authService";
import {
  page, card, title, subtitle, label, input, errorText, noteText,
  darkButton, outlineButton, backButton, linkButton,
} from "../../shared/ui";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location.state?.from;
  const [identifier, setIdentifier] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const justRegistered = Boolean(location.state?.justRegistered);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const next = {};
    const value = identifier.trim();

    if (!value) next.identifier = "Enter your email address.";
    else if (/^\d{10}$/.test(value)) {
      next.identifier = "Phone sign-in is not available yet. Please use your email.";
    } else if (!/^\S+@\S+\.\S+$/.test(value)) {
      next.identifier = "Enter a valid email address.";
    }
    if (!password) next.password = "Enter your password.";

    setErrors(next);
    setNote("");
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    const result = await loginWithPassword(value, password);
    setSubmitting(false);

    if (!result.ok) {
      setErrors({ password: result.message });
      return;
    }

    // Load this customer's saved cart and wishlist from the database.
    dispatch(loadProducts());
    dispatch(loadCart());
    dispatch(loadWishlist());
    navigate(from || "/", { replace: true });
  };

  return (
    <div style={page}>
      <Navbar />

      <main style={{ padding: "35px 40px 70px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "520px", margin: "0 auto" }}>
          <button type="button" onClick={() => navigate("/")} style={backButton}>
            ← Back to Home
          </button>

          <form onSubmit={handleSubmit} noValidate style={card}>
            <h1 style={title}>Welcome back</h1>
            <p style={subtitle}>
              {justRegistered
                ? "Account created. Please sign in to continue."
                : from
                ? "Please sign in to continue."
                : "Sign in to view your Shop360 account."}
            </p>

            <div style={{ marginBottom: "18px" }}>
              <label htmlFor="identifier" style={label}>Email or phone</label>
              <input
                id="identifier"
                style={input}
                placeholder="you@example.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
              {errors.identifier && <p style={errorText}>{errors.identifier}</p>}
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label htmlFor="password" style={label}>Password</label>
              <input
                id="password"
                type="password"
                style={input}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p style={errorText}>{errors.password}</p>}
            </div>

            <button
              type="button"
              style={{ ...linkButton, marginBottom: "20px" }}
              onClick={() => setNote("Password reset is not available yet.")}
            >
              Forgot Password?
            </button>

            <button type="submit" disabled={submitting} style={darkButton}>
              {submitting ? "Signing in..." : "Sign In"}
            </button>

            <div style={{ display: "flex", gap: "14px", margin: "16px 0 20px" }}>
              {["Google", "Apple"].map((name) => (
                <button
                  key={name}
                  type="button"
                  style={outlineButton}
                  onClick={() => setNote(`${name} sign-in is not available yet.`)}
                >
                  {name}
                </button>
              ))}
            </div>

            <button type="button" style={linkButton} onClick={() => navigate("/signup", { state: location.state })}>
              Create Account
            </button>

            {note && <p role="status" style={noteText}>{note}</p>}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
