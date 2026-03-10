import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/hooks/useAuth";
import { logout } from "../features/services/authServices";
import SearchBar from "./SearchBar";

const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const clickHandler = async(e) => {
    e.preventDefault();
    try{
      await logout();
      navigate("/login")
    }catch(err){
      console.error("logout error: ", err)
    }
  };

  return (
    <header className="header">
      <div className="header__container">
        <Link className="header__logo" to="/">
          <img
            src="https://www.freepnglogos.com/uploads/netflix-logo-0.png"
            alt="Netflix"
          />
        </Link>

        <div className="header__actions">
          <SearchBar />
          <button className="header__signin" onClick={clickHandler}>
            {user ? "Logout" : "Sign In"}
          </button>
          {user && location.pathname !== "/login" && (
                <Link to="/watchlist" className="header__watchlist">My Watchlist</Link>
              )}
        </div>
      </div>
    </header>
  );
};

export default Header;
