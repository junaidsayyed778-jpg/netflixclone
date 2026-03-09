import { useContext, useEffect } from "react";
import { AuthContext } from "../authContext";
import {getMe, login, regsiter } from "../services/authServices";

export const useAuth = () => {
  const context = useContext(AuthContext);
 const { user, setUser, loading, setLoading, error, setError } = context;

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const data = await login({ email, password });
      setUser(data.user);
      return true;
    } catch (err) {
      console.log(err);
      return false
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setLoading(true);
    try {
      const data = await regsiter({ username, email, password });
      setUser(data.user);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return {user,setUser, loading, setLoading, handleLogin, handleRegister };
}