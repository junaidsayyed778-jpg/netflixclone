import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "../features/hooks/useAuth";
import { logout } from "../features/services/authServices";
import SearchBar from "./SearchBar";

const Header = () => {

  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  const clickHandler = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error("logout error:", err);
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

        {/* Search always visible */}
        <SearchBar />

        <div className="header__actions">

          {/* Desktop buttons */}
          <div className="header__desktop">

            {user && location.pathname !== "/login" && (
              <Link to="/watchlist" className="header__watchlist">
                My Watchlist
              </Link>
            )}

            <button className="header__signin" onClick={clickHandler}>
              {user ? "Logout" : "Sign In"}
            </button>

          </div>

          {/* Mobile hamburger */}
          <div
            className="header__menu"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </div>

        </div>

      </div>

      {/* Sidebar */}
      <div className={`sidebar ${menuOpen ? "active" : ""}`}>

        <Link to="/watchlist" onClick={() => setMenuOpen(false)}>
          My Watchlist
        </Link>

        <button onClick={clickHandler}>
          {user ? "Logout" : "Sign In"}
        </button>

      </div>

    </header>
  );
};

export default Header;