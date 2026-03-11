import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/hooks/useAuth";
import { logout } from "../features/services/authServices";
import SearchBar from "./SearchBar";

const Header = () => {

  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const clickHandler = async (e) => {
    e.preventDefault();

    try {
      await logout();
      navigate("/login");
      setMenuOpen(false);
    } catch (err) {
      console.error("logout error:", err);
    }
  };

  return (
    <header className="header">

      <div className="header__container">

        {/* LOGO */}
        <Link className="header__logo" to="/">
          <img
            src="https://www.freepnglogos.com/uploads/netflix-logo-0.png"
            alt="Netflix"
          />
        </Link>

        {/* SEARCH */}
        <SearchBar />

        {/* DESKTOP ACTIONS */}
        <div className="header__actions">

          {user && (
            <Link to="/watchlist" className="header__watchlist">
              My Watchlist
            </Link>
          )}

          <button className="header__signin" onClick={clickHandler}>
            {user ? "Logout" : "Sign In"}
          </button>

        </div>

        {/* MOBILE MENU */}
        <button
          className="header__menuBtn"
          onClick={() => setMenuOpen(true)}
        >
          ☰
        </button>

      </div>


      {/* OVERLAY */}

      {menuOpen && (
        <div
          className="sidebar__overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}


      {/* SIDEBAR */}

      <div className={`sidebar ${menuOpen ? "sidebar--open" : ""}`}>

        <button
          className="sidebar__close"
          onClick={() => setMenuOpen(false)}
        >
          ✖
        </button>

        {user && (
          <Link
            to="/watchlist"
            className="sidebar__link"
            onClick={() => setMenuOpen(false)}
          >
            My Watchlist
          </Link>
        )}

        <button
          className="sidebar__logout"
          onClick={clickHandler}
        >
          {user ? "Logout" : "Sign In"}
        </button>

      </div>

    </header>
  );
};

export default Header;