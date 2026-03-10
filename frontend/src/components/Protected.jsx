import { Navigate } from "react-router";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";

const Protected = ({ children }) => {

  const { user, authLoading } = useContext(AuthContext);

  if (authLoading) {
    return null; // or loader
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;