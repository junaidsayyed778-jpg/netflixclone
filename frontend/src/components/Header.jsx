import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../features/hooks/useAuth";

const Header = () => {
  const { user } = useAuth()
  const navigate = useNavigate();

  const clickHandler = (e) => {
    e.preventDefault();
    navigate("/login");
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
          <select className="header__language">
            <option>English</option>
            <option>Hindi</option>
          </select>

          <button className="header__signin" onClick={clickHandler}>
            {user ? "Logout" : "Sign In"}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
