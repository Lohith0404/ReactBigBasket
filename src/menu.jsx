// src/menu.js
import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div className="menu">
      <Link to="/veg">🌿 Veg</Link>
      <Link to="/nonveg">🍗 Non-Veg</Link>
      <Link to="/softdrinks">🥤SoftDrinks</Link>
      <Link to="/cart">🛒 Cart</Link>
      <Link to="/signin">🔑 Sign In</Link>
      <Link to="/aboutus">ℹ️ About Us</Link> {/* corrected from /about */}
    </div>
  );
}

export default Menu;
