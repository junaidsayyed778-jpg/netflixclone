import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/hooks/useAuth";
import { logout } from "../features/services/authServices";
import SearchBar from "./SearchBar";

// ───────────────────────────────────────────────────
// CUSTOM HOOK: Detect mobile viewport
// ───────────────────────────────────────────────────
const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
};

// ───────────────────────────────────────────────────
// HEADER COMPONENT
// ───────────────────────────────────────────────────
const Header = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile(768);

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

  // Close sidebar if user resizes from mobile → desktop
  useEffect(() => {
    if (!isMobile && menuOpen) setMenuOpen(false);
  }, [isMobile, menuOpen]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (menuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [menuOpen, isMobile]);

  // 🔥 Close sidebar on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && menuOpen) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

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

          {/* Watchlist - Desktop only */}
          {!isMobile && user && (
            <Link to="/watchlist" className="header__watchlist">
              My Watchlist
            </Link>
          )}

          {/* Logout/Sign In - Desktop only */}
          {!isMobile && (
            <button className="header__signin" onClick={clickHandler}>
              {user ? "Logout" : "Sign In"}
            </button>
          )}

        </div>

        {/* MOBILE MENU BUTTON - Mobile only */}
        {isMobile && (
          <button
            className="header__menuBtn"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
          >
            ☰
          </button>
        )}
      </div>

      {/* 🔥 OVERLAY + SIDEBAR - Mobile only 🔥 */}
      {isMobile && menuOpen && (
        <>
          {/* Overlay - Clicking here closes sidebar */}
          <div
            className="sidebar__overlay"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sidebar - Clicking inside does NOT close */}
          <div 
            className="sidebar sidebar--open"
            onClick={(e) => e.stopPropagation()} // 🔥 Prevent close when clicking inside
          >
            <button
              className="sidebar__close"
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
            >
              ✖
            </button>

            <div className="sidebar__content">
              {user && (
                <Link
                  to="/watchlist"
                  className="sidebar__link"
                  onClick={() => setMenuOpen(false)}
                >
                  My Watchlist
                </Link>
              )}
            </div>

            {/* Logout - Mobile sidebar only */}
            <button
              className="sidebar__logout"
              onClick={clickHandler}
            >
              {user ? "Logout" : "Sign In"}
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;