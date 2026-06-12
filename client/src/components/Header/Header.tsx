import { NavLink } from 'react-router-dom';

import Logo from '../../assets/logo.svg';
import Counter from '../Counter/Counter';
import './Header.css';

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return isActive
    ? 'header__nav-link header__nav-link_active'
    : 'header__nav-link';
}

function Header() {
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
          <NavLink to="/login" className={getNavLinkClass}>
            Login
          </NavLink>
          <NavLink to="/register" className={getNavLinkClass}>
            Register
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

export default Header;
