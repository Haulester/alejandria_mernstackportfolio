import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';
import Button from './Button';

function Navbar() {
  return (
    <nav>
      <div className="logo">
        <span className="logo-text">The Daily Purr</span>
      </div>
      <div className="nav-right">
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>
          <li>
            <Link to='/articles'>Articles</Link>
          </li>
        </ul>
        <Link to='/login'>
          <Button>Login</Button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
