// The logged-in user (token + customerId) is kept in the browser so a refresh
// does not log the person out.
const KEY = "shopstack_session";

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY));
  } catch {
    return null;
  }
};

export const setSession = (session) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(session));
  } catch {
    // ignore storage errors
  }
};

export const clearSession = () => {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore storage errors
  }
};
