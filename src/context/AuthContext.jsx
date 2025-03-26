import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app startup, check if the user is already logged in
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const baseURL = import.meta.env.VITE_API_BASE_URL;
        const response = await fetch(`${baseURL}/api/auth/dashboard`, {
          method: "GET",
          credentials: "include", // include cookies in the request
        });
        if (response.ok) {
          const data = await response.json();
          console.log("data", data);
          setUser(data);
        }
      } catch (error) {
        console.error("Failed to fetch current user", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCurrentUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
