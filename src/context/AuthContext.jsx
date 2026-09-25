import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

// Unified with SignIn.jsx / Profile.jsx, which both read/write this key.
const STORAGE_KEY = "account";

function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [userInfo, setUserInfo] = useState(getStoredUser);

  const login = (data) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (data?.token) localStorage.setItem("token", data.token);
    setUserInfo(data);

    // Lets WishlistContext (and anything else listening) know in the
    // SAME tab, since "storage" only fires in other tabs.
    window.dispatchEvent(new Event("login"));
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem("token");
    setUserInfo(null);

    window.dispatchEvent(new Event("logout"));
  };

  return (
    <AuthContext.Provider value={{ userInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
