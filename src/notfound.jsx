import React from 'react';
import './mystyles.css';

function NotFound() {
  return (
    <div className="not-found">
      <img
        src="/images/404.jpg"  // Correct path to public image
        alt="404 Not Found"
        className="error-image"
      />
      <h2>Oops! Page not found.</h2>
      <p>The page you’re looking for doesn’t exist.</p>
    </div>
  );
}

export default NotFound;
