import { createContext, useEffect, useState } from "react";
import { getMe } from "../features/services/authServices";


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    const checkAuth = async () => {
      try {
        const data = await getMe();

        if (data?.user) {
          setUser(data.user);
        }

      } catch (err) {
        console.log(err);
        setError(err);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();

  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        authLoading,
        loading,
        setLoading,
        error,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

