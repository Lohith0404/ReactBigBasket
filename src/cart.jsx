import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { incrementQuantity, decrementQuantity, removeFromCart, clearCart } from './store';
import QRCode from 'react-qr-code';
import emailjs from '@emailjs/browser';

export default function Cart() {
  const user = useSelector(state => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items = useSelector((state) => state.products.cart);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const [manualDiscountPercent, setManualDiscountPercent] = useState(0);
  const [couponDiscountPercent, setCouponDiscountPercent] = useState(0);
  const [couponError, setCouponError] = useState('');
  const couponCodeRef = useRef();
  const emailInputRef = useRef();

  const totalDiscountPercent = manualDiscountPercent + couponDiscountPercent;
  const discountAmount = (total * totalDiscountPercent) / 100;
  const taxAmount = (total - discountAmount) * 0.05;
  const finalAmount = total - discountAmount + taxAmount;

  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [walletBalance, setWalletBalance] = useState(1000); // Sample wallet balance

  const generateOrderCode = () => 'ORD' + Math.floor(100000 + Math.random() * 900000);

  const handleCouponApply = () => {
    const code = couponCodeRef.current.value.trim().toUpperCase();
    switch (code) {
      case 'LOHIT10':
        setCouponDiscountPercent(10);
        setCouponError('');
        break;
      case 'SAVE5':
        setCouponDiscountPercent(5);
        setCouponError('');
        break;
      case 'SAVE15':
        setCouponDiscountPercent(15);
        setCouponError('');
        break;
      default:
        setCouponDiscountPercent(0);
        setCouponError('❌ Invalid coupon code');
    }
  };

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    setPaymentConfirmed(false);
  };

  const sendConfirmationEmail = async (orderCode, clientEmail, finalAmount, taxAmount, discountAmount, total) => {
    const templateParams = {
      order_id: orderCode,
      orders: items.map(item => ({
        name: item.name,
        price: (item.price * item.quantity).toFixed(2),
        units: item.quantity
      })),
      cost: {
        shipping: '0.00',
        tax: taxAmount.toFixed(2),
        total: finalAmount.toFixed(2),
        discount: discountAmount.toFixed(2),
        final_paid: finalAmount.toFixed(2),
      },
      email: clientEmail,
    };

    try {
      const response = await emailjs.send(
        'service_gtmfzni',
        'template_pxzkuro',
        templateParams,
        'KQm6IZQUFbmhKwZnv'
      );

      if (response.status === 200) {
        console.log('✅ Email sent successfully');
      } else {
        console.error('❌ Failed to send email:', response);
      }
    } catch (err) {
      console.error('❌ Error:', err);
    }
  };

  const confirmPayment = async () => {
    if (!user || !user.email) {
      alert('You must be signed in to place an order.');
      navigate('/signin');
      return;
    }

    const clientEmail = user.email;

    if (!paymentConfirmed && paymentMethod === 'UPI') return;

    const orderCode = generateOrderCode();

    const order = {
      code: orderCode,
      timestamp: Date.now(),
      items: [...items],
      total: total.toFixed(2),
      discount: discountAmount.toFixed(2),
      tax: taxAmount.toFixed(2),
      finalAmount: finalAmount.toFixed(2),
      paymentMethod,
      email: clientEmail,
    };

    const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    existingOrders.unshift(order);
    localStorage.setItem('orders', JSON.stringify(existingOrders));

    await sendConfirmationEmail(orderCode, clientEmail, finalAmount, taxAmount, discountAmount, total);

    dispatch(clearCart());
    setManualDiscountPercent(0);
    setCouponDiscountPercent(0);
    setCouponError('');
    if (couponCodeRef.current) couponCodeRef.current.value = '';
    setOrderPlaced(true);
  };

  useEffect(() => {
    if (orderPlaced) {
      const timer = setTimeout(() => {
        navigate('/orders');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [orderPlaced, navigate]);

  return (
    <div className="page">
      <h2>Your Cart</h2>

      {orderPlaced && (
        <div className="order-success-message celebration">
          🎉 <strong>Hurray!</strong> Your payment was successful! <br />
          🛒 Order is being processed.<br />
          🔁 Redirecting to <strong>Your Orders</strong> in 5 seconds...
        </div>
      )}

      {items.length === 0 && !orderPlaced ? (
        <h2>Your cart is empty...</h2>
      ) : (
        <>
          <div className="product-grid">
            {items.map((item) => (
              <div className="card" key={item.id}>
                <img src={item.image || 'fallback.jpg'} alt={item.name} className="cart-image" />
                <h3>{item.name}</h3>
                <p>₹{item.price} x {item.quantity}</p>
                <div className="quantity-controls">
                  <button onClick={() => dispatch(decrementQuantity(item))}>-</button>
                  <button onClick={() => dispatch(incrementQuantity(item))}>+</button>
                </div>
                <button onClick={() => dispatch(removeFromCart(item))}>Remove</button>
              </div>
            ))}
          </div>

          <div className="discount-section">
            <p>Manual Discount:</p>
            {[0, 5, 10, 15].map((d) => (
              <button key={d} onClick={() => setManualDiscountPercent(d)}>{d}%</button>
            ))}
          </div>

          <div className="discount-section">
            <p>Apply Coupon:</p>
            <input ref={couponCodeRef} type="text" placeholder="e.g. LOHIT10" />
            <button onClick={handleCouponApply}>Apply</button>
            {couponError && <p className="error">{couponError}</p>}
          </div>

          <div className="price-details">
            <p>Total: ₹{total.toFixed(2)}</p>
            <p>Discount: -₹{discountAmount.toFixed(2)}</p>
            <p>Tax (5%): +₹{taxAmount.toFixed(2)}</p>
            <p><strong>Final Amount:</strong> ₹{finalAmount.toFixed(2)}</p>
          </div>

          <div className="email-field">
            <p>Email for confirmation:</p>
            <input
              ref={emailInputRef}
              type="email"
              placeholder="you@example.com"
              defaultValue={user?.email}
              disabled
            />
          </div>

          <div className="payment-methods">
            <h3>Choose Payment Method</h3>
            {['UPI', 'Card', 'Wallet'].map((method) => (
              <button
                key={method}
                onClick={() => handlePaymentMethodChange(method)}
                className={paymentMethod === method ? 'selected' : ''}>
                {method}
              </button>
            ))}
          </div>

          {paymentMethod === 'UPI' && (
            <div className="qr-popup">
              <h3>Scan to Pay (UPI)</h3>
              <QRCode value={`upi://pay?pa=7396741206@ybl&pn=Lohith%20Cart%20Craze&am=${finalAmount.toFixed(2)}&cu=INR`} />
              <label>
                <input
                  type="checkbox"
                  checked={paymentConfirmed}
                  onChange={(e) => setPaymentConfirmed(e.target.checked)}
                /> I have completed the payment
              </label>
              <button onClick={confirmPayment} disabled={!paymentConfirmed}>
                Complete Order
              </button>
            </div>
          )}

          {paymentMethod === 'Card' && (
            <div className="card-payment">
              <input type="text" placeholder="Card Number" />
              <input type="text" placeholder="Name" />
              <input type="text" placeholder="Expiration" />
              <input type="text" placeholder="CVV" />
              <button onClick={confirmPayment}>Complete Order</button>
            </div>
          )}

          {paymentMethod === 'Wallet' && (
            <div className="wallet-payment">
              <p>Your Wallet Balance: ₹{walletBalance}</p>
              <button onClick={confirmPayment} disabled={walletBalance < finalAmount}>
                Complete Order
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
