import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { page, title, noteText, backButton } from "../../shared/ui";

const OPTIONS = [
  { type: "customer", name: "Shop on Shop360", text: "Continue with Shop360" },
  { type: "vendor", name: "Sell on Shop360", text: "Continue with Shop360" },
  { type: "staff", name: "Staff Access — Invite Only", text: "Continue with Shop360" },
];

const AccountType = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [note, setNote] = useState("");

  const choose = (type) => {
    if (type === "staff") {
      setNote("Staff accounts are invite only. Please use the invite sent to your email.");
      return;
    }
    navigate(`/signup/details?type=${type}`, { state: location.state });
  };

  return (
    <div style={page}>
      <Navbar />

      <main style={{ padding: "35px 40px 70px", boxSizing: "border-box" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <button type="button" onClick={() => navigate("/login", { state: location.state })} style={backButton}>
            ← Back to Login
          </button>

          <h1 style={{ ...title, marginBottom: "24px" }}>Choose your Shop360 path</h1>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {OPTIONS.map((option) => (
              <button
                key={option.type}
                type="button"
                onClick={() => choose(option.type)}
                style={{
                  textAlign: "left",
                  padding: "26px 28px",
                  border: "1px solid #d9c6ad",
                  borderRadius: "14px",
                  backgroundColor: "#ffffff",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                <div style={{ fontSize: "17px", fontWeight: "700", color: "#211f1b" }}>
                  {option.name}
                </div>
                <div style={{ fontSize: "13px", color: "#716c64", marginTop: "10px" }}>
                  {option.text}
                </div>
              </button>
            ))}
          </div>

          {note && <p role="status" style={noteText}>{note}</p>}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AccountType;
