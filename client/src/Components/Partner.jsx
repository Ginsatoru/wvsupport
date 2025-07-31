import React from "react";
import "./Partner.css";

const partners = [
  { name: "Microsoft", logo: "https://static.vecteezy.com/system/resources/previews/027/127/592/non_2x/microsoft-logo-microsoft-icon-transparent-free-png.png" },
  { name: "Amazon", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKVuQonqPSvrHl0AKa6sIXd7PkGS8lBl_68A&s" },
  { name: "Google", logo: "https://static.vecteezy.com/system/resources/previews/013/948/549/non_2x/google-logo-on-transparent-white-background-free-vector.jpg" },
  { name: "WordPress", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQF5kBtVrBMvZqDR2gSsWiSYsciCWJxyF6lvg&s" },
  { name: "Firebase", logo: "https://firebase.google.com/static/images/brand-guidelines/logo-vertical.png" },
  { name: "Adobe", logo: "https://blog.logomaster.ai/hs-fs/hubfs/adobe-logo-1.jpg?width=662&height=441&name=adobe-logo-1.jpg" },
];

const Partner = () => {
  return (
    <div className="partner-page">
      <div className="partner-hero">
        <h1>Our Trusted Partners</h1>
        <p>We collaborate with leading organizations to deliver top-notch solutions and innovations.</p>
      </div>

      <div className="partner-grid">
        {partners.map((partner, index) => (
          <div key={index} className="partner-card">
            <img src={partner.logo} alt={partner.name} className="partner-logo" />
            <h3>{partner.name}</h3>
          </div>
        ))}
      </div>

      <div className="partner-cta">
        <h2>Let's Build the Future Together</h2>
        <p>Interested in partnering with us? We'd love to hear from you.</p>
        <a onClick={() => window.location.href = '/contact'} className="partner-contact-button">
          Contact Our Team
        </a>
      </div>
    </div>
  );
};

export default Partner;
