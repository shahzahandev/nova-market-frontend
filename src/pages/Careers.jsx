import React from "react";
import Container from "../components/Container";

const values = [
  {
    title: "Customer First",
    text: "Every decision we make starts with how it will improve the customer's shopping experience.",
  },
  {
    title: "Keep Learning",
    text: "We encourage curiosity and give our team room to grow new skills and try new ideas.",
  },
  {
    title: "Own It",
    text: "We take responsibility for our work and care about doing it well from start to finish.",
  },
  {
    title: "Work Together",
    text: "We are a team. We share knowledge, support each other, and celebrate wins together.",
  },
];

const areas = [
  "Customer Support",
  "Delivery & Logistics",
  "Marketing & Content",
  "Product & Catalog Management",
  "Web Development & Design",
];

// TODO: replace with your real careers email
const CAREERS_EMAIL = "novamarket@gmail.com";

const Careers = () => {
  return (
    <div className="bg-gray-100 py-10">
      <Container>
        <section className="bg-white py-8">
          <div className="px-2 sm:px-4 lg:px-6">

            {/* Heading */}
            <div className="text-start">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Careers at Nova<span className="text-brand-500">Market</span>
              </h2>

              <p className="text-base leading-7 text-gray-600">
                We are building a shopping platform that makes online
                shopping simple and enjoyable. If you like solving problems
                and want to grow with a young, growing team, we would love to
                hear from you.
              </p>
            </div>

            {/* Why Join Us */}
            <div className="mt-10">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                What We Value
              </h3>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((item) => (
                  <div key={item.title} className="border border-gray-200 p-5">
                    <h4 className="mb-2 text-lg font-semibold text-gray-900">
                      {item.title}
                    </h4>
                    <p className="text-sm leading-6 text-gray-600">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Areas */}
            <div className="mt-10">
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Where You Could Fit In
              </h3>

              <p className="text-base leading-7 text-gray-600">
                As we grow, we look for talented people in areas like:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-gray-600">
                {areas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>

            {/* Open Positions */}
            <div className="mt-10">
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Open Positions
              </h3>

              <div className="border border-gray-200 p-5">
                <p className="text-base font-semibold text-gray-900">
                  No open positions right now
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  We do not have any openings at the moment, but we are always
                  happy to meet great people. Send us your CV and a short
                  note about yourself, and we will keep it for future
                  opportunities.
                </p>
              </div>
            </div>

            {/* Closing Message */}
            <div className="mt-10 border-l-4 border-brand-500 bg-gray-50 px-5 py-5">
              <p className="text-base font-medium leading-7 text-gray-700">
                Interested in joining{" "}
                <span className="font-bold">
                  Nova<span className="text-brand-500">Market</span>
                </span>
                ? Send your CV to{" "}
                <a
                  href={`mailto:${CAREERS_EMAIL}`}
                  className="font-bold text-brand-500 hover:underline"
                >
                  {CAREERS_EMAIL}
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

export default Careers;
