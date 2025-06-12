import React from 'react';
import '../../styles/Page.css';
import aboutImg from '../../assets/catgang.jpg'; // Replace with your own image

function AboutPage() {
  return (
    <div className="page-container">
      <img src={aboutImg} alt="About Us" className="page-banner" />
      <h1>About Us</h1>
      <p>
        We are a team of passionate individuals committed to sharing knowledge and fostering growth.
        Our platform was born out of a desire to create a space where curiosity meets clarity,
        and information becomes inspiration.
      </p>
      <p>
        Every article we publish is written with care and backed by reliable sources,
        ensuring our readers get nothing but the best. Whether you're a student, a professional,
        or a lifelong learner — you belong here.
      </p>
    </div>
  );
}

export default AboutPage;
