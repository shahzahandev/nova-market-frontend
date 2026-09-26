import React from "react";
import Container from "./Container";

const About = () => {
  return (
    <div className="bg-gray-100 py-10">
      <Container>
        <section className="bg-white py-8">
          <div className="px-2 sm:px-4 lg:px-6">

            {/* About Heading */}
            <div className="text-start">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                About Nova<span className="text-brand-500">Market</span>
              </h2>

              <p className=" text-base leading-7 text-gray-600">
                NovaMarket is a modern and user-friendly online shopping
                platform designed to make your shopping experience simple,
                convenient, and enjoyable. From discovering products to
                placing an order, we aim to provide a smooth and reliable
                experience for every customer.
              </p>
            </div>

            {/* Our Story */}
            <div className="mt-10">
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Our Story
              </h3>

              <p className="text-base leading-7 text-gray-600">
                NovaMarket was created with a simple goal — to make online
                shopping easier and more accessible. We believe customers
                should be able to discover quality products, compare their
                options, and complete their purchases without unnecessary
                complications.
              </p>

              <p className="mt-4 text-base leading-7 text-gray-600">
                As we continue to grow, we are focused on building a shopping
                platform where customers can find useful products, attractive
                deals, and a dependable service experience in one place.
              </p>
            </div>

            {/* What We Offer */}
            <div className="mt-10">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                What We Offer
              </h3>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="border border-gray-200 p-5">
                  <h4 className="mb-2 text-lg font-semibold text-gray-900">
                    Quality Products
                  </h4>
                  <p className="text-sm leading-6 text-gray-600">
                    We focus on offering reliable and useful products that
                    provide value to our customers.
                  </p>
                </div>

                <div className="border border-gray-200 p-5">
                  <h4 className="mb-2 text-lg font-semibold text-gray-900">
                    Great Deals
                  </h4>
                  <p className="text-sm leading-6 text-gray-600">
                    Discover attractive offers and special deals designed to
                    help you shop at better prices.
                  </p>
                </div>

                <div className="border border-gray-200 p-5">
                  <h4 className="mb-2 text-lg font-semibold text-gray-900">
                    Easy Shopping
                  </h4>
                  <p className="text-sm leading-6 text-gray-600">
                    Our platform is designed to make browsing, ordering, and
                    managing your purchases simple.
                  </p>
                </div>

                <div className="border border-gray-200 p-5">
                  <h4 className="mb-2 text-lg font-semibold text-gray-900">
                    Customer Support
                  </h4>
                  <p className="text-sm leading-6 text-gray-600">
                    We are committed to providing helpful support whenever our
                    customers need assistance.
                  </p>
                </div>
              </div>
            </div>

            {/* Our Mission */}
            <div className="mt-10">
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Our Mission
              </h3>

              <p className="text-base leading-7 text-gray-600">
                Our mission is to create a trustworthy and convenient
                e-commerce experience where customers can shop with confidence.
                We continuously work to improve our products, services,
                technology, and overall customer experience.
              </p>
            </div>

            {/* Customer Experience */}
            <div className="mt-10">
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                Customer First
              </h3>

              <p className="text-base leading-7 text-gray-600">
                Our customers are at the heart of everything we do. From a
                simple and intuitive interface to a smooth checkout process,
                every part of NovaMarket is designed with customer convenience
                in mind.
              </p>

              <p className="mt-4 text-base leading-7 text-gray-600">
                We value customer feedback and use it to continuously improve
                our platform and services.
              </p>
            </div>

            {/* Closing Message */}
            <div className="mt-10 border-l-4 border-brand-500 bg-gray-50 px-5 py-5">
              <p className="text-base font-medium leading-7 text-gray-700">
                Thank you for choosing{" "}
                <span className="font-bold">
                  Nova<span className="text-brand-500">Market</span>
                </span>
                . We look forward to making your online shopping experience
                better, easier, and more enjoyable.
              </p>
            </div>

          </div>
        </section>
      </Container>
    </div>
  );
};

export default About;