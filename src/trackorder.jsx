// src/TrackOrder.js
import React, { useEffect, useState } from "react";

const TrackOrder = () => {
  const [step, setStep] = useState(0);
  const statuses = ["Order Placed", "Packed", "Out for Delivery", "Delivered"];

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prevStep) => (prevStep < statuses.length - 1 ? prevStep + 1 : prevStep));
    }, 3000); // Move to next stage every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="track-order">
      <h2>Track My Order</h2>
      <p><strong>Order ID:</strong> #{Math.floor(100000 + Math.random() * 900000)}</p>
      <p><strong>Estimated Delivery:</strong> 30-45 mins</p>

      <div className="tracking-steps">
        {statuses.map((status, index) => (
          <div key={index} className={`step ${index <= step ? "active" : ""}`}>
            <div className="circle">{index + 1}</div>
            <p>{status}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackOrder;
