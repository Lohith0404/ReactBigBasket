import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export default function Orders() {
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  
  const [detailsVisible, setDetailsVisible] = useState({});
  const [trackingVisible, setTrackingVisible] = useState({});
  const [deliveryStages, setDeliveryStages] = useState({});

  const stages = ['Order Placed', 'Packed', 'Out for Delivery', 'Delivered'];

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders')) || [];
    setOrders(storedOrders);

    if (location.state?.showCelebration) {
      setCelebrationMessage('🎉 Your order has been placed successfully!');
      const timer = setTimeout(() => setCelebrationMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  const toggleDetails = (index) => {
    setDetailsVisible((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleTracking = (index) => {
    setTrackingVisible((prev) => {
      const newState = { ...prev, [index]: !prev[index] };
      if (newState[index] && deliveryStages[index] === undefined) {
        simulateDeliveryProgress(index);
      }
      return newState;
    });
  };

  const simulateDeliveryProgress = (index) => {
    let stage = 0;
    setDeliveryStages((prev) => ({ ...prev, [index]: stage }));

    const interval = setInterval(() => {
      stage++;
      if (stage >= stages.length) {
        clearInterval(interval);
        return;
      }
      setDeliveryStages((prev) => ({ ...prev, [index]: stage }));
    }, 1500);
  };

  // NEW: Clear all orders handler
  const clearAllOrders = () => {
    localStorage.removeItem('orders');
    setOrders([]);
    setDetailsVisible({});
    setTrackingVisible({});
    setDeliveryStages({});
  };

  return (
    <div className="orders-page">
      <h2>My Orders</h2>

      {/* Clear All Orders Button */}
      {orders.length > 0 && (
        <button onClick={clearAllOrders} className="clear-orders-btn">
          Clear All Orders
        </button>
      )}

      {celebrationMessage && (
        <div className="celebration-message">{celebrationMessage}</div>
      )}

      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        orders.map((order, index) => (
          <div key={index} className="order-block">
            <h3>Order #{index + 1}</h3>

            <button onClick={() => toggleDetails(index)}>
              {detailsVisible[index] ? 'Hide Details' : 'Show Details'}
            </button>

            <button onClick={() => toggleTracking(index)} className="track-btn">
              {trackingVisible[index] ? 'Hide Tracking' : 'Track Details'}
            </button>

            {detailsVisible[index] && (
              <div className="order-details">
                <h4>Items:</h4>
                <ul>
                  {(order.cartItems || order.items || []).map((item, i) => (
                    <li key={i}>
                      {item.name} - ₹{item.price} × {item.quantity}
                    </li>
                  ))}
                </ul>

                <h4>Order Info:</h4>
                <p>Subtotal: ₹{order.subtotal || order.total || 0}</p>
                <p>Discount: ₹{order.discount || 0}</p>
                <p>Shipping: ₹{order.shipping || 0}</p>
                <p>Tax: ₹{order.tax || 0}</p>
                <p>Total: ₹{order.total || order.finalAmount || 0}</p>
                <p>Payment: {order.paymentMethod || 'N/A'}</p>
              </div>
            )}

            {trackingVisible[index] && (
              <div className="delivery-tracking">
                <h4>Delivery Status:</h4>
                <div className="timeline">
                  {stages.map((stageName, sIndex) => (
                    <div
                      key={sIndex}
                      className={`stage ${
                        sIndex <= (deliveryStages[index] ?? -1) ? 'active' : ''
                      }`}
                    >
                      {stageName}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
