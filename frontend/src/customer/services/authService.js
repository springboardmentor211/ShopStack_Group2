// Login/signup storage. Right now accounts and the logged-in user are only
// saved in the browser (localStorage). When the backend is ready, replace the
// bodies of these functions with Axios calls (e.g. POST /api/auth/register and
// POST /api/auth/login) and keep the same names, so the pages do not change.
const USER_KEY = "shopstack_user";
const ACCOUNTS_KEY = "shopstack_accounts";

const read = (key, fallback) => {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
};

const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

// ---- logged-in user (session) ----
export const getUser = () => read(USER_KEY, null);

export const isLoggedIn = () => Boolean(getUser());

export const saveUser = (user) => write(USER_KEY, user);

export const logout = () => {
  try {
    localStorage.removeItem(USER_KEY);
  } catch {
    // ignore storage errors
  }
};

// ---- accounts created on the Create account page ----
const normalizeEmail = (email) => email.trim().toLowerCase();

// Passwords are not stored as plain text (demo only; the backend will do
// proper hashing later).
const hashPassword = async (password) => {
  try {
    const bytes = new TextEncoder().encode(password);
    const digest = await crypto.subtle.digest("SHA-256", bytes);
    return Array.from(new Uint8Array(digest))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return `plain:${password}`;
  }
};

// Returns { ok: true } or { ok: false, error: "exists" | "storage" }
export const registerAccount = async ({ name, email, password, type }) => {
  const accounts = read(ACCOUNTS_KEY, []);
  const key = normalizeEmail(email);

  if (accounts.some((account) => account.email === key)) {
    return { ok: false, error: "exists" };
  }

  accounts.push({
    name: name.trim(),
    email: key,
    type,
    passwordHash: await hashPassword(password),
  });

  return write(ACCOUNTS_KEY, accounts)
    ? { ok: true }
    : { ok: false, error: "storage" };
};

// Returns { ok: true, user } or { ok: false, error: "not_found" | "wrong_password" }
export const loginWithPassword = async (identifier, password) => {
  const key = normalizeEmail(identifier);
  const account = read(ACCOUNTS_KEY, []).find((item) => item.email === key);

  if (!account) return { ok: false, error: "not_found" };

  if (account.passwordHash !== (await hashPassword(password))) {
    return { ok: false, error: "wrong_password" };
  }

  const user = { name: account.name, email: account.email, type: account.type };
  saveUser(user);
  return { ok: true, user };
};
