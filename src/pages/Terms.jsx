import React from "react";
import Container from "../components/Container";
import { useStoreInfo } from "../context/StoreInfoContext";

const getSections = (storeName) => [
  {
    title: "Using Our Website",
    text: `By using ${storeName}, you agree to follow these terms. You must provide accurate information when creating an account or placing an order, and you are responsible for keeping your account details safe. Please do not use our website for any unlawful or harmful purpose.`,
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
    title: "Account Responsibility",
    text: "You are responsible for all activity under your account. If you think someone has used your account without permission, please contact us right away. We may suspend or restrict accounts that break these terms or misuse our platform.",
  },
  {
    title: "Intellectual Property",
    text: `All content on ${storeName}, including the logo, text, images, and design, belongs to ${storeName} or its content owners. Please do not copy, reuse, or distribute it without our written permission.`,
  },
  {
    title: "Limitation of Liability",
    text: `We do our best to keep ${storeName} running smoothly, but we cannot guarantee that the website will always be available or free from errors. To the extent allowed by law, ${storeName} is not liable for any indirect or consequential losses from using our website or products.`,
  },
  {
    title: "Changes to These Terms",
    text: `We may update these terms from time to time. By continuing to use ${storeName} after changes are posted, you agree to the updated terms.`,
  },
];

const Terms = () => {
  const { storeInfo } = useStoreInfo();

  const storeName = storeInfo?.storeName || "NovaMarket";
  const supportEmail = storeInfo?.storeEmail || "";
  const sections = getSections(storeName);

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
              <p className="mt-4 text-base leading-7 text-gray-600">
                Welcome to {storeName}. Please read these terms carefully
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
            {supportEmail && (
              <div className="mt-10 border-l-4 border-brand-500 bg-gray-50 px-5 py-5">
                <p className="text-base font-medium leading-7 text-gray-700">
                  Questions about these terms? Contact us at{" "}
                  <a
                    href={`mailto:${supportEmail}`}
                    className="font-bold text-brand-500 hover:underline"
                  >
                    {supportEmail}
                  </a>
                  .
                </p>
              </div>
            )}
          </div>
        </section>
      </Container>
    </div>
  );
};

export default Terms;