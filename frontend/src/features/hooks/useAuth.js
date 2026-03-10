import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import {getMe, login, regsiter } from "../services/authServices";


export const useAuth = () => {

  const { user, setUser, loading, setLoading, setError } =
    useContext(AuthContext);

  const handleLogin = async ({ email, password }) => {

    setLoading(true);

    try {

      const data = await login({ email, password });

      setUser(data.user);

      return true;

    } catch (err) {

      console.log(err);
      setError(err);
      return false;

    } finally {

      setLoading(false);

    }
  };

  const handleRegister = async ({ username, email, password }) => {

    setLoading(true);

    try {

      const data = await regsiter({ username, email, password });

      setUser(data.user);

      return true;

    } catch (err) {

      console.log(err);
      setError(err);
      return false;

    } finally {

      setLoading(false);

    }
  };

  return { user, loading, handleLogin, handleRegister };
};