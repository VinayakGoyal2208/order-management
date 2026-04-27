import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
  // Initialize state: Check if token exists, otherwise set to null
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name"); // Added name for the Navbar UI

    // Only return an object if a token actually exists
    return token ? { token, role, name } : null;
  });

  const login = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("name", data.user.name); // Store name for UI

    setUser({
      token: data.token,
      role: data.role,
      name: data.user.name,
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    setUser(null);
  };

  // Optional: Sync tabs (If you logout in one tab, logout in all)
  useEffect(() => {
    const handleStorageChange = () => {
      if (!localStorage.getItem("token")) {
        setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};