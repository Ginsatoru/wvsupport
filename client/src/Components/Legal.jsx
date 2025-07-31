// LegalPage.js
import React from "react";
import "./legal.css";

const Legal = () => {
  return (
    <div className="legal-container">
      <h1 className="legal-title">Terms & Conditions</h1>

      <section className="legal-section">
        <h2>Welcome</h2>
        <p>
          Thank you for choosing WV Support Services Cambodia. By accessing our website, you agree to be bound by these terms and conditions.
        </p>
      </section>

      <section className="legal-section">
        <h2>Use of Our Services</h2>
        <p>
          You agree to use our website responsibly. Any misuse or unauthorized use is strictly prohibited.
        </p>
      </section>

      <section className="legal-section">
        <h2>Intellectual Property</h2>
        <p>
          All content, including logos, images, and written material, is owned by WV Support Services Cambodia and protected under copyright laws.
        </p>
      </section>

      <section className="legal-section">
        <h2>Limitation of Liability</h2>
        <p>
          We are not liable for any damages that may occur from using our website or services.
        </p>
      </section>

      <section className="legal-section">
        <h2>Changes</h2>
        <p>
          We may update these terms at any time. Continued use after changes means you accept the new terms.
        </p>
      </section>

      <section className="legal-section">
        <h2>Contact Us</h2>
        <p>
          Have questions? Reach out to us at support@aaapos.com.
        </p>
      </section>
    </div>
  );
};

export default Legal;
