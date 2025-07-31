import React from 'react';
import './WhoWeAre.css';
import { useNavigate } from "react-router-dom";

const WhoWeAre = () => {
  const navigate = useNavigate(); // ✅ Make sure to call this here

  return (
    <section className="who-wrapper">
      <div className="hero-banner">
        <div className="hero-text">
          <h1>Who We Are?</h1>
          <p>We're the spark of ideas, the force of transformation, and the heart of innovation.</p>
        </div>
      </div>

      <div className="who-section">
        <div className="section-block">
          <h2>Our Vision</h2>
          <p>
            To be a force of creativity and innovation, transforming industries and lives through digital experiences
            that are simple, human, and impactful.
          </p>
        </div>

        <div className="section-block">
          <h2>Our Mission</h2>
          <p>
            We craft meaningful solutions that connect people, solve problems, and inspire growth — one project at a time.
            Every product we build is rooted in purpose and driven by user-focused design.
          </p>
        </div>

        <div className="section-block">
          <h2>Our Core Values</h2>
          <ul>
            <li><strong>Curiosity:</strong> We ask questions and explore new paths fearlessly.</li>
            <li><strong>Integrity:</strong> We do what's right, not what's easy.</li>
            <li><strong>Collaboration:</strong> We believe in the power of shared ideas and open hearts.</li>
            <li><strong>Excellence:</strong> We sweat the small stuff — details matter.</li>
            <li><strong>Empathy:</strong> We build with people, for people.</li>
          </ul>
        </div>

        <div className="section-block">
          <h2>Our Culture</h2>
          <p>
            We’re remote but connected. Professional but fun. Focused but flexible. Our culture is built on trust, creativity,
            and an unshakable belief that the best work comes from teams who feel like family.
          </p>
        </div>

        <div className="cta-block">
          <h2>Let’s Build Something Meaningful</h2>
          <p>
            Whether you're a dreamer, a doer, or a partner, we’d love to connect. Join us as we create a future fueled by creativity,
            technology, and heart.
          </p>
          <a onClick={() => navigate("/contact")} className="cta-button" role="button" tabIndex={0}>
            Get In Touch
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;
