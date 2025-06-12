import React from 'react';
import '../../styles/Page.css';
import homeImg from '../../assets/catprof.jpg'; 

function HomePage() {
  return (
    <div className="page-container">
      <img src={homeImg} alt="Welcome Banner" className="page-banner" />
      <h1>Welcome to Our Knowledge Hub</h1>
      <p>
        Dive into a world of insightful articles, meaningful stories, and practical guides.
        Whether you're here to learn something new or just browsing through curiosity,
        our platform provides a rich blend of knowledge across various topics.
      </p>
      <p>
        Stay inspired. Stay informed.
      </p>
      
    </div>
  );
}

export default HomePage;
