import React from 'react'
import '../styles/Footer.css';function Footer() {
  return (
    <div>
       <footer>
        <h2>Stay Connected</h2>
        <p>Follow us on social media or get in touch!</p>
        <div className="footer-links">
          <a href="#">Facebook</a>
          <a href="#">Twitter</a>
          <a href="#">LinkedIn</a>
          <a href="#">Instagram</a>
        </div>
        <div className="footer-copyright">
          <p>&copy; 2025 The Daily Purr. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Footer
