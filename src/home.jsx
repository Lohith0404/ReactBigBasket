import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from './store';

const Navbar = () => {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(signOut());
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h1>WELCOME TO CARTCRAZE....</h1>
        <Link to="/" className="nav-link">🏠 HOME</Link>
      </div>
      <div className="navbar-right">
        <Link to="/veg" className="nav-link">Veg</Link>
        <Link to="/cart" className="nav-link">Cart</Link>
        <Link to="/orders" className="nav-link">Orders</Link>
        {user.isLoggedIn ? (
          <button onClick={handleLogout} className="signin-button">Logout</button>
        ) : (
          <Link to="/signin" className="signin-button">Sign In</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
