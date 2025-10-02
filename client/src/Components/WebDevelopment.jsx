import React from 'react';
import { FiCheckCircle, FiCode, FiSmartphone, FiShoppingCart, FiDatabase } from 'react-icons/fi';
import './WebDevelopment.css';

const WebDevelopmentPage = () => {
  return (
    <div className="webdev-page">
      {/* Hero Section */}
      <section className="webdev-hero">
        <div className="hero-content">
          <h1>Web Development Services</h1>
          <p className="hero-subtitle">Custom-built websites that drive results and elevate your digital presence</p>
          <div className="tech-stack">
            <span>React</span>
            <span>Next.js</span>
            <span>Node.js</span>
            <span>WordPress</span>
            <span>Shopify</span>
          </div>
        </div>
        <div className="hero-illustration">
          <div className="code-window"></div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="value-props">
        <div className="value-card">
          <FiCode className="value-icon" />
          <h3>Clean Code</h3>
          <p>Modern, maintainable code following best practices</p>
        </div>
        <div className="value-card">
          <FiSmartphone className="value-icon" />
          <h3>Mobile-First</h3>
          <p>Perfectly responsive on all devices</p>
        </div>
        <div className="value-card">
          <FiShoppingCart className="value-icon" />
          <h3>E-Commerce Ready</h3>
          <p>Scalable solutions for online stores</p>
        </div>
        <div className="value-card">
          <FiDatabase className="value-icon" />
          <h3>SEO Optimized</h3>
          <p>Built for visibility and performance</p>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <h2>Web Development Packages</h2>
        <p className="section-subtitle">Choose the perfect solution for your business needs</p>
        
        <div className="pricing-grid">
          {/* Basic Website */}
          <div className="pricing-card">
            <div className="pricing-header">
              <h3>Basic Website</h3>
              <div className="price">$1,500</div>
              <p className="price-desc">Great for startups & small biz</p>
            </div>
            <ul className="features-list">
              <li><FiCheckCircle /> Up to 5 pages</li>
              <li><FiCheckCircle /> CMS Integration</li>
              <li><FiCheckCircle /> Responsive Design</li>
              <li><FiCheckCircle /> Basic SEO Setup</li>
              <li><FiCheckCircle /> Contact Form</li>
              <li><FiCheckCircle /> 1 Month Support</li>
            </ul>
            <button className="pricing-cta">Get Started</button>
          </div>

          {/* Business Website */}
          <div className="pricing-card popular">
            <div className="popular-badge">Most Popular</div>
            <div className="pricing-header">
              <h3>Business Website</h3>
              <div className="price">$3,500</div>
              <p className="price-desc">Perfect for growing businesses</p>
            </div>
            <ul className="features-list">
              <li><FiCheckCircle /> Up to 15 pages</li>
              <li><FiCheckCircle /> Custom Design</li>
              <li><FiCheckCircle /> Advanced SEO</li>
              <li><FiCheckCircle /> Blog Integration</li>
              <li><FiCheckCircle /> Analytics Setup</li>
              <li><FiCheckCircle /> 3 Months Support</li>
            </ul>
            <button className="pricing-cta">Get Started</button>
          </div>

          {/* E-Commerce Website */}
          <div className="pricing-card">
            <div className="pricing-header">
              <h3>E-Commerce Web</h3>
              <div className="price">$6,000+</div>
              <p className="price-desc">Complete online store solution</p>
            </div>
            <ul className="features-list">
              <li><FiCheckCircle /> Product Catalog</li>
              <li><FiCheckCircle /> Payment Gateway</li>
              <li><FiCheckCircle /> Inventory System</li>
              <li><FiCheckCircle /> User Accounts</li>
              <li><FiCheckCircle /> Security Features</li>
              <li><FiCheckCircle /> 6 Months Support</li>
            </ul>
            <button className="pricing-cta">Get Started</button>
          </div>

          {/* Enterprise Solution */}
          <div className="pricing-card enterprise">
            <div className="pricing-header">
              <h3>Enterprise Solution</h3>
              <div className="custom">Custom</div>
              <p className="price-desc">Tailored for large organizations</p>
            </div>
            <ul className="features-list">
              <li><FiCheckCircle /> Complex Web Apps</li>
              <li><FiCheckCircle /> API Integrations</li>
              <li><FiCheckCircle /> Custom Backend</li>
              <li><FiCheckCircle /> Scalable System</li>
              <li><FiCheckCircle /> Dedicated Team</li>
              <li><FiCheckCircle /> Ongoing Support</li>
            </ul>
            <button className="pricing-cta" onClick={() => window.location.href = '/contact'}>Contact Us</button>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="process-section">
        <h2>Our Development Process</h2>
        <div className="process-steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Discovery</h3>
            <p>We analyze your needs and plan the project</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Design</h3>
            <p>Create wireframes and visual concepts</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Development</h3>
            <p>Build your website with modern technologies</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Launch</h3>
            <p>Deploy and optimize your live website</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="webdev-cta">
        <h2>Ready to Build Your Perfect Website?</h2>
        <p>Schedule a free consultation with our web development experts</p>
        <button className="primary-cta" onClick={() => window.location.href = '/contact'}>Get a Free Quote</button>
      </section>
    </div>
  );
};

export default WebDevelopmentPage;

/* Add or update in WebDevelopment.css */

