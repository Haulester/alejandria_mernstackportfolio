import React from 'react';
import '../styles/NotFound.css'; 

function NotFoundPage() {
  return (
    <div className="not-found-container">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you are looking for doesn’t exist or has been moved.</p>
      <a href="/">Go Back Home</a>
    </div>
  );
}

export default NotFoundPage;
