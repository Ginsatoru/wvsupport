import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Payment.css";
import QR from "./Images/ABA.png";

const Payment = () => {
  const location = useLocation();
  const planId = location.state?.plan; // This will be 'basic', 'pro', or 'enterprise'
  const navigate = useNavigate();
  const planKey = location.state?.plan; // This should be 'basic', 'pro', or 'enterprise'

  // Plan data with Stripe links
  const planData = {
    basic: {
      name: "Basic Support",
      price: "$99/month",
      stripeLink: "https://buy.stripe.com/test_fZeg0y1oL7Ded5m3ck",
    },
    pro: {
      name: "Professional Support",
      price: "$299/month",
      stripeLink: "https://buy.stripe.com/test_28E3cv1Hz7tmbyN6H873G09",
    },
    enterprise: {
      name: "Enterprise Support",
      price: "Custom",
      stripeLink: "/contact",
    },
  };

  // Get the current plan
  const currentPlan = planData[planId] || planData.basic; // Fallback to basic if no plan

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      // Optionally redirect or reset form here
    }, 4000);
  };

  const handleStripePayment = () => {
    if (!currentPlan.stripeLink) {
      console.error("Stripe link missing for plan:", planKey);
      alert("Payment system is currently unavailable. Please try again later.");
      return;
    }

    // Open Stripe in a new tab
    window.open(currentPlan.stripeLink, "_blank", "noopener,noreferrer");

    // Optional: Track payment initiation
    console.log("Initiated Stripe payment for plan:", currentPlan.name);
  };

  if (!planKey) {
    return (
      <div className="error-message">
        <p>No plan selected. Please go back and choose a plan.</p>
        <button onClick={() => navigate("/plans")}>Back to Plans</button>
      </div>
    );
  }

  return (
    <section id="payment" className="payment-page">
      <div className="container">
        <div className="payment-header">
          <h2>Complete Your {currentPlan.name} Subscription</h2>
          <p className="subtitle">
            You're almost there! Choose your preferred payment method below.
          </p>
          <div className="plan-summary">
            <h3>{currentPlan.name}</h3>
            <div className="price">{currentPlan.price}</div>
          </div>
        </div>

        <div className="payment-options">
          <div
            className={`payment-option ${
              paymentMethod === "aba" ? "selected" : ""
            }`}
            onClick={() => setPaymentMethod("aba")}
          >
            <div className="option-header">
              <div className="option-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="#0f8abe"
                >
                  <path d="M2 2h20v20H2V2zm18 18V4H4v16h16zM8 8h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
                </svg>
              </div>
              <h3>ABA PayWay</h3>
            </div>
            <p>Scan QR code to pay via ABA Mobile App</p>
          </div>

          <div
            className={`payment-option ${
              paymentMethod === "stripe" ? "selected" : ""
            }`}
            onClick={() => setPaymentMethod("stripe")}
          >
            <div className="option-header">
              <div className="option-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 28 28"
                  fill="#0f8abe"
                >
                  <path d="M13.3 15.5c0-.7.6-1.2 1.4-1.2 1.8 0 3.6.7 5 1.9V9.3c-1.4-.7-3.1-1.1-5-1.1-4.2 0-7.1 2.1-7.1 5.4 0 5.2 7.1 4.4 7.1 6.6 0 .8-.7 1.3-1.6 1.3-1.7 0-3.9-.8-5.5-2.1v6.9c1.8.8 3.8 1.2 5.5 1.2 4.4 0 7.5-2 7.5-5.5.1-5.6-7.3-4.7-7.3-6.6z" />
                </svg>
              </div>
              <h3>Credit/Debit Card</h3>
            </div>
            <p>Secure payment via Stripe</p>
          </div>
        </div>

        {paymentMethod === "aba" && (
          <div className="aba-payment">
            <form onSubmit={handleSubmit} className="customer-form">
              <h3>Your Information</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={customerInfo.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={customerInfo.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={customerInfo.phone}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="qr-section">
                <h4>Scan to Pay with ABA Mobile</h4>
                <div className="qr-code">
                  <img src={QR} alt="QR Code for ABA Payment" />
                </div>
                <p className="instructions">
                  1. Open ABA Mobile App
                  <br />
                  2. Tap 'Scan QR'
                  <br />
                  3. Confirm payment details <br />
                  4. Send us your screenshot
                </p>
              </div>

              {/* Screenshot upload field */}
              <div className="form-group">
                <label htmlFor="paymentScreenshot">
                  Attach Payment Screenshot
                </label>
                <input
                  type="file"
                  id="paymentScreenshot"
                  name="paymentScreenshot"
                  accept="image/*"
                />
              </div>

              <button type="submit" className="submit-button">
                I've Completed Payment
              </button>
            </form>
          </div>
        )}

        {paymentMethod === "stripe" && (
          <div className="stripe-payment">
            <div className="stripe-checkout">
              <h3>Secure Card Payment</h3>
              <p>You'll be redirected to Stripe's secure checkout page</p>
              <button onClick={handleStripePayment} className="stripe-button">
                Proceed to Payment
              </button>
              <div className="card-icons">
                <img
                  src="https://logowik.com/content/uploads/images/219_visa.jpg"
                  alt="Visa"
                />
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQDT6ma3FbEe4hyuodqU10gidPjcQ1yD2pwSg&s"
                  alt="Mastercard"
                />
                <img
                  src="https://webshoptiger.com/wp-content/uploads/2023/09/American-Express-Color.png"
                  alt="American Express"
                />
              </div>
              <p className="security-note">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#0f8abe">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11V11.99z" />
                </svg>
                Payments are secure and encrypted
              </p>
            </div>
          </div>
        )}
      </div>
      {showSuccess && (
        <>
          <div className="payment-success-overlay"></div>
          <div className="payment-success-message">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#e3f2fd" />
              <path
                d="M7 13l3 3 7-7"
                stroke="#0f8abe"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <h3>Payment information submitted!</h3>
            <p>
              We will contact you shortly. Thank you for choosing WV Support
              Services Cambodia.
            </p>
          </div>
        </>
      )}
    </section>
  );
};

export default Payment;
