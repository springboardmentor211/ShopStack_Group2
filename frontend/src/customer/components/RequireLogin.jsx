import { Navigate, useLocation } from "react-router-dom";
import { isLoggedIn } from "../services/authService";

// Wrap a page with this to make it available only to logged-in users.
// Logged-out visitors are sent to /login and returned here after signing in.
const RequireLogin = ({ children }) => {
  const location = useLocation();

  if (!isLoggedIn()) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  return children;
};

export default RequireLogin;
