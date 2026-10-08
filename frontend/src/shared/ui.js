// Shared style objects for the login, signup, checkout and payment pages.
// Same colors and fonts as the rest of the site.
const serif = 'Georgia, "Times New Roman", serif';

export const page = {
  minHeight: "100vh",
  backgroundColor: "#fffaf2",
  color: "#24211d",
  fontFamily: "Arial, Helvetica Neue, Helvetica, sans-serif",
  boxSizing: "border-box",
};

export const card = {
  backgroundColor: "#ffffff",
  border: "1px solid #d9c6ad",
  borderRadius: "14px",
  padding: "28px",
  boxSizing: "border-box",
};

export const title = {
  margin: "0 0 8px",
  fontFamily: serif,
  fontSize: "36px",
  fontWeight: "700",
  color: "#211f1b",
};

export const sectionTitle = {
  margin: "0 0 18px",
  fontFamily: serif,
  fontSize: "22px",
  fontWeight: "700",
  color: "#211f1b",
};

export const subtitle = { margin: "0 0 24px", fontSize: "14px", color: "#716c64" };

export const label = {
  display: "block",
  margin: "0 0 8px",
  fontSize: "13px",
  fontWeight: "700",
  color: "#211f1b",
};

export const input = {
  width: "100%",
  height: "46px",
  padding: "0 14px",
  border: "1px solid #d9c6ad",
  borderRadius: "8px",
  backgroundColor: "#fffdf9",
  fontSize: "14px",
  color: "#211f1b",
  fontFamily: "inherit",
  boxSizing: "border-box",
  outline: "none",
};

export const errorText = { margin: "6px 0 0", fontSize: "12px", color: "#b3261e" };

export const noteText = { margin: "14px 0 0", fontSize: "13px", color: "#716c64" };

export const darkButton = {
  width: "100%",
  height: "46px",
  border: "none",
  borderRadius: "7px",
  backgroundColor: "#211f1b",
  color: "#ffffff",
  fontSize: "14px",
  fontWeight: "700",
  cursor: "pointer",
};

export const goldButton = { ...darkButton, backgroundColor: "#b58243" };

export const outlineButton = {
  ...darkButton,
  border: "1px solid #d9c6ad",
  backgroundColor: "#ffffff",
  color: "#211f1b",
};

export const backButton = {
  display: "inline-flex",
  alignItems: "center",
  height: "40px",
  padding: "0 18px",
  marginBottom: "24px",
  border: "1px solid #d9c6ad",
  borderRadius: "8px",
  backgroundColor: "#ffffff",
  color: "#211f1b",
  fontSize: "14px",
  fontWeight: "600",
  cursor: "pointer",
};

export const linkButton = {
  border: "none",
  background: "transparent",
  padding: 0,
  fontSize: "13px",
  color: "#211f1b",
  textDecoration: "underline",
  cursor: "pointer",
};
