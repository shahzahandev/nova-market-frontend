import React from "react";
import Container from "../components/Container";
import { useStoreInfo } from "../context/StoreInfoContext";

const getSections = (storeName) => [
  {
    title: "Information We Collect",
    text: `When you use ${storeName}, we may collect the following information:`,
    list: [
      "Personal details such as your name, email address, phone number, and delivery address.",
      "Order details such as the products you buy, order history, and wishlist items.",
      "Payment status information related to your orders. We do not store your full card or mobile banking credentials.",
      "Technical information such as your browser type, device, and how you use our website.",
    ],
  },
  {
    title: "How We Use Your Information",
    text: "We use your information to:",
    list: [
      "Create and manage your account.",
      "Process, deliver, and support your orders.",
      "Contact you about your orders, returns, or support requests.",
      "Improve our website, products, and customer experience.",
      "Keep our platform secure and prevent fraud or misuse.",
    ],
  },
  {
    title: "Sharing Your Information",
    text: "We do not sell your personal information. We only share it when needed to run our service, for example with delivery partners to deliver your order, with payment providers to process payments, or when required by law.",
  },
  {
    title: "Cookies",
    text: "We use cookies and similar technologies to keep you signed in, remember your cart, and understand how our website is used. You can control cookies from your browser settings, but some parts of the website may not work properly without them.",
  },
  {
    title: "Data Security",
    text: "We take reasonable steps to protect your information from unauthorized access, loss, or misuse. However, no online service can be completely secure, so we cannot guarantee absolute security.",
  },
  {
    title: "Your Rights",
    text: "You can view and update your account information at any time. You can also ask us to correct or delete your personal data, subject to any legal or order-related requirements we must follow.",
  },
  {
    title: "Changes to This Policy",
    text: "We may update this Privacy Policy from time to time. When we do, we will update the date at the top of this page. Please check back occasionally to stay informed.",
  },
];

const PrivacyPolicy = () => {
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
                Privacy <span className="text-brand-500">Policy</span>
              </h2>
              <p className="mt-4 text-base leading-7 text-gray-600">
                Your privacy matters to us. This policy explains what
                information {storeName} collects, how we use it, and the
                choices you have.
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

                {section.list && (
                  <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-gray-600">
                    {section.list.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}

            {/* Closing Message */}
            {supportEmail && (
              <div className="mt-10 border-l-4 border-brand-500 bg-gray-50 px-5 py-5">
                <p className="text-base font-medium leading-7 text-gray-700">
                  Questions about this policy? Contact us at{" "}
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

export default PrivacyPolicy;