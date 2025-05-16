import { configureStore, createSlice } from '@reduxjs/toolkit';

// -------- USER SLICE --------
const savedUser = JSON.parse(localStorage.getItem('loggedInUser'));

const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: savedUser || null,
  },
  reducers: {
    signIn: (state, action) => {
      state.currentUser = action.payload;
      localStorage.setItem('loggedInUser', JSON.stringify(action.payload));
    },
    signOut: (state) => {
      state.currentUser = null;
      localStorage.removeItem('loggedInUser');
    },
    register: (state, action) => {
      // Optionally handle register state
    },
  },
});

// -------- PRODUCTS SLICE --------
const savedCart = JSON.parse(localStorage.getItem('cart')) || [];

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    veg: [
      { id: 1, name: 'Dal Rice', price: 150, image: '/images/Dalrice.jpeg' },
      { id: 2, name: 'Veg Biryani', price: 250, image: '/images/vegBiriyani.jpeg' },
      { id: 3, name: 'Veg Noodles', price: 100, image: '/images/vegnoodles.jpeg' },
      { id: 4, name: 'Veg Salad', price: 350, image: '/images/vegsalad.jpeg' },
      { id: 5, name: 'Veg Sandwich', price: 70, image: '/images/vegsandwich.jpeg' },
      { id: 6, name: 'Paneer Butter Masala', price: 280, image: '/images/paneerbuttermasala.jpeg' },
      { id: 7, name: 'Chole Bhature', price: 180, image: '/images/cholebhature.jpeg' },
      { id: 8, name: 'Masala Dosa', price: 120, image: '/images/masaladosa.jpeg' },
      { id: 9, name: 'Aloo Paratha', price: 90, image: '/images/alooparatha.jpeg' },
      { id: 10, name: 'Mushroom Curry', price: 200, image: '/images/mushroomcurry.jpeg' },
    ],
    nonVeg: [
      { id: 11, name: 'Chicken Biryani', price: 300, image: '/images/chickenbiriyani.jpeg' },
      { id: 12, name: 'Butter Chicken', price: 320, image: '/images/butterchicken.jpeg' },
      { id: 13, name: 'Egg Curry', price: 180, image: '/images/eggcurry.jpeg' },
      { id: 14, name: 'Mutton Rogan Josh', price: 400, image: '/images/muttonroganjosh.jpeg' },
      { id: 15, name: 'Fish Fry', price: 250, image: '/images/fishfry.jpeg' },
      { id: 16, name: 'Prawn Curry', price: 350, image: '/images/prawncurry.jpeg' },
      { id: 17, name: 'Chicken 65', price: 220, image: '/images/chicken65.jpeg' },
      { id: 18, name: 'Tandoori Chicken', price: 300, image: '/images/tandoorichicken.jpeg' },
      { id: 19, name: 'Chicken Noodles', price: 180, image: '/images/chickennoodles.jpeg' },
      { id: 20, name: 'Egg Fried Rice', price: 160, image: '/images/eggfriedrice.jpeg' },
    ],
    softDrinks: [
      { id: 21, name: 'Fanta', price: 35, image: '/images/fanta.jpeg' },
      { id: 22, name: 'Pepsi', price: 40, image: '/images/pepsi.jpeg' },
      { id: 23, name: 'Diet Coke', price: 46, image: '/images/dietcoke.jpeg' },
      { id: 24, name: 'Sprite', price: 80, image: '/images/sprite.jpeg' },
      { id: 25, name: 'Thums Up', price: 40, image: '/images/thumsup.jpeg' },
      { id: 26, name: 'Red Bull', price: 50, image: '/images/redbull.jpeg' },
    ],
    cart: savedCart,
  },
  reducers: {
    addToCart: (state, action) => {
      const item = state.cart.find(i => i.id === action.payload.id);
      if (item) {
        item.quantity += 1;
      } else {
        state.cart.push({ ...action.payload, quantity: 1 });
      }
    },
    incrementQuantity: (state, action) => {
      const item = state.cart.find(i => i.id === action.payload.id || i.id === action.payload);
      if (item) item.quantity += 1;
    },
    decrementQuantity: (state, action) => {
      const item = state.cart.find(i => i.id === action.payload.id || i.id === action.payload);
      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },
    removeFromCart: (state, action) => {
      const id = action.payload.id || action.payload;
      state.cart = state.cart.filter(i => i.id !== id);
    },
    clearCart: (state) => {
      state.cart = [];
    },
  },
});

// Export actions
export const {
  signIn,
  signOut,
  register,
} = userSlice.actions;

export const {
  addToCart,
  incrementQuantity,
  decrementQuantity,
  removeFromCart,
  clearCart,
} = productsSlice.actions;

// Configure store
const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    products: productsSlice.reducer,
  },
});

// Persist cart to localStorage
store.subscribe(() => {
  const state = store.getState();
  localStorage.setItem('cart', JSON.stringify(state.products.cart));
});

export default store;
