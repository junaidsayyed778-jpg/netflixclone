import { useContext } from "react";
import { AuthContext } from "../context/authContext";

const GlobalLoader = () => {

  const { authLoading, loading } = useContext(AuthContext);

  if (!authLoading && !loading) return null;

  return (
    <div className="global-loader">
      <div className="spinner"></div>
    </div>
  );
};

export default GlobalLoader;