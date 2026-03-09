import { createContext, useEffect, useState } from "react";
import { getMe } from "./services/authServices";


export const AuthContext = createContext();

export const AuthProvider = ({ children}) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

   useEffect(() => {

    const checkAuth = async () => {
      try {
        const data = await getMe();

        if (data?.user) {
          setUser(data.user);
        }

      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, setLoading, error, setError }}>
      {children}
    </AuthContext.Provider>
  )
}