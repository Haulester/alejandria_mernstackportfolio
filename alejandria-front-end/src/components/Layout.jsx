import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer'; 

const Layout = () => {
  return (
    <>
      <Navbar />
      <div className="layout-container">
        <Outlet />
      </div>
      <Footer /> 
    </>
  );
};

export default Layout;
