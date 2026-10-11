import api, { getErrorMessage } from "../../shared/api/client";
import { getSession, setSession, clearSession } from "../../shared/api/session";

// ---- session (who is logged in) ----
export const getUser = () => getSession();

export const isLoggedIn = () => {
  const session = getSession();
  return Boolean(session?.token && session?.customerId);
};

export const getCustomerId = () => getSession()?.customerId;

export const logout = () => clearSession();

// ---- API calls ----
// POST /auth/register. Returns { ok: true } or { ok: false, error, message }.
// The person is NOT logged in after registering; they sign in next.
export const registerAccount = async ({ name, email, password }) => {
  try {
    await api.post("/auth/register", {
      name: name.trim(),
      email: email.trim(),
      password,
    });
    return { ok: true };
  } catch (error) {
    const message = getErrorMessage(error, "Could not create your account.");
    return {
      ok: false,
      error: /already registered/i.test(message) ? "exists" : "failed",
      message,
    };
  }
};

// POST /auth/login. Saves the token and customerId.
export const loginWithPassword = async (email, password) => {
  try {
    const { data } = await api.post("/auth/login", {
      email: email.trim(),
      password,
    });
    setSession({
      token: data.token,
      customerId: data.customerId,
      name: data.name,
      email: data.email,
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, message: getErrorMessage(error, "Could not sign in.") };
  }
};
