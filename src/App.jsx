import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { signOut } from './store';  // your redux slice action
import Menu from './menu';
import Home from './home';
import Veg from './veg';
import NonVeg from './nonveg';
import Cart from './cart';
import Signin from './signin';
import AboutUs from './aboutus';
import SoftDrinks from './softdrinks';
import NotFound from './notfound';
import Orders from './orders';
import TrackOrder from './TrackOrder';
import TrackOrderMap from './trackordermap';
import Register from './register';
import ProtectedRoute from './protectedroute';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const cartItems = useSelector(state => state.products.cart);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const [searchTerm, setSearchTerm] = useState('');
  const user = useSelector(state => state.user.currentUser);
  const isLoggedIn = !!user; // boolean indicating login status

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(signOut());
    navigate('/signin');
  };

  return (
    <>
      <header>
        <h1>🛒 CartCraze</h1>
      </header>

      <nav className="navbar">
        <Link to="/menu">Menu</Link>
        <Link to="/">Home</Link>
        <Link to="/veg">Veg</Link>
        <Link to="/nonveg">Non-Veg</Link>
        <Link to="/softdrinks">Soft Drinks</Link>
        <Link to="/cart">Cart ({cartCount})</Link>
        {!isLoggedIn ? (
          <>
            <Link to="/signin">Sign In</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <button onClick={handleLogout}>Logout</button>
        )}
        <Link to="/aboutus">About Us</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/trackmap">Live Map Tracking</Link>
        <input
          type="text"
          className="nav-search"
          placeholder="Search items..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </nav>

      <Routes>
        <Route path="/menu" element={<Menu />} />
        <Route path="/" element={<Home />} />
        <Route
          path="/veg"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Veg searchTerm={searchTerm} />
            </ProtectedRoute>
          }
        />
        <Route path="/nonveg" element={<NonVeg searchTerm={searchTerm} />} />
        <Route path="/softdrinks" element={<SoftDrinks searchTerm={searchTerm} />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/aboutus" element={<AboutUs />} />
        <Route path="/trackmap" element={<TrackOrderMap />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trackorder"
          element={
            <ProtectedRoute isLoggedIn={isLoggedIn}>
              <TrackOrder />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
