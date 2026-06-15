import { NavLink, useNavigate } from "react-router-dom";

import Logo from "../../assets/logo.svg";
import Counter from "../Counter/Counter";
import "./Header.css";
import { useAuth } from "../../contexts/AuthContext";
import { logoutUser } from "../../utils/api";

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? "header__nav-link header__nav-link_active"
    : "header__nav-link";
}

function Header() {
  const navigate = useNavigate();
  const { logout, currentUser, isAuthenticated } = useAuth();

  function handleLogout() {
    logoutUser().finally(() => {
      logout();
      navigate("/login");
    });
  }

  return (
    <header className="header">
      <div className="header__inner">
        <img src={Logo} alt="Recipe Browser logo" className="header__logo" />
        <nav className="header__nav">
          <NavLink to="/" className={getNavLinkClass}>
            Recipes
          </NavLink>
          <NavLink to="/favorites" className={getNavLinkClass}>
            Favorites <Counter />
          </NavLink>
          {isAuthenticated ? (
            <>
              {" "}
              <p className="header__text">{currentUser?.name}</p>
              <button
                type="button"
                className="header__logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {" "}
              <NavLink to="/login" className={getNavLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={getNavLinkClass}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
