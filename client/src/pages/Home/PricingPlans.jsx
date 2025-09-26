import React from "react";

const pricingData = [
  {
    id: 1,
    name: "Free",
    price: "$0",
    features: [
      "Access to basic features",
      "Limited project submissions",
      "Community support",
    ],
    cta: "Get Started",
    highlight: false,
  },
  {
    id: 2,
    name: "Pro",
    price: "$29/mo",
    features: [
      "Unlimited project submissions",
      "Advanced analytics dashboard",
      "Priority support",
      "Team collaboration",
    ],
    cta: "Upgrade Now",
    highlight: true,
  },
  {
    id: 3,
    name: "Enterprise",
    price: "Custom",
    features: [
      "Dedicated account manager",
      "Custom integrations",
      "Enterprise-level security",
      "24/7 premium support",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function PricingPlans() {
  return (
    <section className="py-12 mt-5 mb-16">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-brand-dark)]">
            <p className="mb-2">💎</p>
            <p>Pricing & Membership Plans</p>
          </h2>
          <p className="mt-3 text-natural max-w-xl mx-auto">
            Choose the plan that fits your needs. Scale your projects and access
            premium features with Workloy.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pricingData.map((plan) => (
            <div
              key={plan.id}
              className={`border rounded-xl shadow-lg p-6 flex flex-col justify-between transition transform hover:scale-105 ${
                plan.highlight
                  ? "bg-natural-dark text-white border-[var(--color-brand-dark)]"
                  : "bg-white text-[var(--color-natural-dark)] border-[var(--color-natural-light)]"
              }`}
            >
              <div>
                <h3
                  className={`text-xl font-semibold mb-2 ${
                    plan.highlight
                      ? "text-accant"
                      : "text-accant"
                  }`}
                >
                  {plan.name}
                </h3>
                <p
                  className={`text-3xl font-bold mb-4 ${
                    plan.highlight
                      ? "text-natural-light"
                      : "text-natural"
                  }`}
                >
                  {plan.price}
                </p>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feat, idx) => (
                    <li
                      key={idx}
                      className={`flex items-center gap-2 ${
                        plan.highlight
                          ? "text-white/90"
                          : "text-[var(--color-natural)]"
                      }`}
                    >
                      <span className="text-[var(--color-accant)]">✅</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`w-full py-2 mt-auto rounded-lg font-semibold transition ${
                  plan.highlight
                    ? "bg-[var(--color-accant)] hover:bg-[var(--color-accant-dark)] text-white"
                    : "bg-natural-dark hover:bg-natural text-white"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
