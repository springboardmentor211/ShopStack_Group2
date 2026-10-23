import api, { getErrorMessage } from "../../shared/api/client";
import { getSession, setSession, clearSession } from "../../shared/api/session";
import { startWarehouseSession } from "../../warehouse/services/devAuth";
import { USE_MOCK } from "../../warehouse/services/config";

const DEMO_ACCOUNTS_KEY = "shopstack_demo_accounts";

const getDemoAccounts = () => {
  try {
    const accounts = JSON.parse(localStorage.getItem(DEMO_ACCOUNTS_KEY) || "[]");
    return Array.isArray(accounts) ? accounts : [];
  } catch {
    return [];
  }
};

const hashDemoPassword = async (password, salt) => {
  const input = new TextEncoder().encode(`${salt}:${password}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
};

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
  if (USE_MOCK) {
    const accounts = getDemoAccounts();
    const normalizedEmail = email.trim().toLowerCase();
    if (accounts.some((account) => account.email === normalizedEmail)) {
      return {
        ok: false,
        error: "exists",
        message: "An account with this email already exists. Please sign in.",
      };
    }

    try {
      const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) => byte.toString(16).padStart(2, "0")).join("");
      accounts.push({
        customerId: Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        salt,
        passwordHash: await hashDemoPassword(password, salt),
      });
      localStorage.setItem(DEMO_ACCOUNTS_KEY, JSON.stringify(accounts));
      return { ok: true };
    } catch {
      return { ok: false, error: "failed", message: "Could not save the demo account in this browser." };
    }
  }

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
  if (USE_MOCK) {
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const account = getDemoAccounts().find((item) => item.email === normalizedEmail);
      if (!account || (await hashDemoPassword(password, account.salt)) !== account.passwordHash) {
        return { ok: false, message: "Invalid email or password." };
      }

      setSession({
        token: `demo-${crypto.randomUUID()}`,
        customerId: account.customerId,
        name: account.name,
        email: account.email,
      });
      return { ok: true };
    } catch {
      return { ok: false, message: "Could not sign in to the demo account." };
    }
  }

  try {
    const { data } = await api.post("/auth/login", {
      email: email.trim(),
      password,
    });
    if (data.warehouseId) {
      startWarehouseSession(data);
      return { ok: true, role: "warehouse" };
    }
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
