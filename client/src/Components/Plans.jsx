import React from "react";
import { useNavigate } from "react-router-dom";
import "../Components/Plans.css";

const Plans = () => {
  const navigate = useNavigate();

  const plans = [
    {
      id: "basic",
      name: "Basic Support",
      price: "$99/month", // Removed the $ symbol
      features: [
        "Remote troubleshooting (5 hours/month)",
        "Software installation support",
        "Email system troubleshooting",
        "Business hours support (9am-5pm)",
        "Response time: 4 hours",
      ],
    },
    {
      id: "pro",
      name: "Professional Support",
      price: "$299/month", // Removed the $ symbol
      features: [
        "Unlimited remote support",
        "Priority response (2 hours)",
        "24/7 emergency support",
        "Monthly system health check",
        "Network monitoring",
        "Security updates",
      ],
      recommended: true,
    },
    {
      id: "enterprise",
      name: "Enterprise Support",
      price: "Custom", // No change needed for "Custom"
      features: [
        "Dedicated support technician",
        "On-site visits (when needed)",
        "Custom SLA agreements",
        "Quarterly security audits",
        "Strategic IT planning",
        "24/7 priority support",
      ],
    },
  ];

  const handlePlanClick = (planId) => {
    navigate("/payment", { state: { plan: planId } }); // Pass just the ID
  };

  return (
    <section id="plans" className="plans">
      <div className="container">
        <h2>Choose Your Support Plan</h2>
        <p className="subtitle">
          Our team is committed to providing quick, reliable, and professional
          support tailored to your needs.
        </p>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`plan-card ${plan.recommended ? "recommended" : ""}`}
              onClick={() => handlePlanClick(plan.id)} // Pass plan.id instead of plan
            >
              {plan.recommended && (
                <div className="recommended-badge">Recommended</div>
              )}
              <h3>{plan.name}</h3>
              <div className="plan-price">{plan.price}</div>
              <ul>
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <div className="select-button">Select Plan</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;
