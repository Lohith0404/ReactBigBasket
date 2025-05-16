import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const TrackOrderMap = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState(false); // Default: not confirmed

  useEffect(() => {
    if (isOrderConfirmed) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setPosition({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => {
            console.error("Geolocation error:", err.message);
            setError("Unable to fetch your location.");
          }
        );
      } else {
        setError("Geolocation is not supported by this browser.");
      }
    }
  }, [isOrderConfirmed]);

  const handleConfirmOrder = () => {
    setIsOrderConfirmed(true);
  };

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h2>Live Delivery Tracking</h2>

      {!isOrderConfirmed ? (
        <>
          <p>Your order is not confirmed yet.</p>
          <button onClick={handleConfirmOrder}>Track Your Order</button>
        </>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : position ? (
        <LoadScript googleMapsApiKey="AIzaSyC2j75LCvCp1ygVJ899DiDit3FkdQJ4bp8">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={15}
          >
            <Marker position={position} label="📍 You" />
          </GoogleMap>
        </LoadScript>
      ) : (
        <p>Loading map...</p>
      )}
    </div>
  );
};

export default TrackOrderMap;
