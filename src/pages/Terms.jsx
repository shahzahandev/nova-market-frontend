import React from "react";
import Container from "../components/Container";

// TODO: replace with your real support email
const SUPPORT_EMAIL = "novamarket@gmail.com";

const sections = [
  {
    title: "Using Our Website",
    text: "By using NovaMarket, you agree to follow these terms. You must provide accurate information when creating an account or placing an order, and you are responsible for keeping your account details safe. Please do not use our website for any unlawful or harmful purpose.",
  },
  {
    title: "Products & Pricing",
    text: "We try to show accurate product descriptions, images, and prices. However, mistakes can happen. If we find an error in the price or availability of a product you ordered, we may contact you to confirm, change, or cancel the order. Prices and offers may change without prior notice.",
  },
  {
    title: "Orders",
    text: "Placing an order is an offer to buy a product. Your order is confirmed only after we accept it. We may cancel or refuse an order in cases such as limited stock, pricing errors, incorrect delivery details, or suspected fraud.",
  },
  {
    title: "Delivery",
    text: "Delivery charges and estimated delivery times depend on your location, as shown on our Shipping page. Delivery times are estimates and may be affected by situations outside our control.",
  },
  {
    title: "Returns",
    text: "You can request a return within 7 days of receiving your order, as long as the product is unused and in its original condition and packaging. For full details, please see our Shipping & Returns page.",
  },
  {
    title: "Account Responsibility",
    text: "You are responsible for all activity under your account. If you think someone has used your account without permission, please contact us right away. We may suspend or restrict accounts that break these terms or misuse our platform.",
  },
  {
    title: "Intellectual Property",
    text: "All content on NovaMarket, including the logo, text, images, and design, belongs to NovaMarket or its content owners. Please do not copy, reuse, or distribute it without our written permission.",
  },
  {
    title: "Limitation of Liability",
    text: "We do our best to keep NovaMarket running smoothly, but we cannot guarantee that the website will always be available or free from errors. To the extent allowed by law, NovaMarket is not liable for any indirect or consequential losses from using our website or products.",
  },
  {
    title: "Changes to These Terms",
    text: "We may update these terms from time to time. By continuing to use NovaMarket after changes are posted, you agree to the updated terms.",
  },
];

const Terms = () => {
  return (
    <div className="bg-gray-100 py-10">
      <Container>
        <section className="bg-white py-8">
          <div className="px-2 sm:px-4 lg:px-6">

            {/* Heading */}
            <div className="text-start">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Terms <span className="text-brand-500">& Conditions</span>
              </h2>

              <p className="text-sm text-gray-500">Last updated: October 2026</p>

              <p className="mt-4 text-base leading-7 text-gray-600">
                Welcome to NovaMarket. Please read these terms carefully
                before using our website or placing an order.
              </p>
            </div>

            {/* Sections */}
            {sections.map((section) => (
              <div key={section.title} className="mt-10">
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  {section.title}
                </h3>

                <p className="text-base leading-7 text-gray-600">
                  {section.text}
                </p>
              </div>
            ))}

            {/* Closing Message */}
            <div className="mt-10 border-l-4 border-brand-500 bg-gray-50 px-5 py-5">
              <p className="text-base font-medium leading-7 text-gray-700">
                Questions about these terms? Contact us at{" "}
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="font-bold text-brand-500 hover:underline"
                >
                  {SUPPORT_EMAIL}
                </a>
                .
              </p>
            </div>

          </div>
        </section>
      </Container>
    </div>
  );
};

export default Terms;
