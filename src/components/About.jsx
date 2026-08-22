import React from "react";
import Container from "./Container";
import { SendHorizontal } from "lucide-react";

const About = () => {
  return (
    <>
    <div  className="bg-gray-100 py-10">
    <Container>
    <section className=" bg-white py-5">
      <div className="px-2 sm:px-4 lg:px-6">

        {/* About Section */}
        <div className="text-start">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            About Nova<span className="text-brand-500">Market</span>.com
          </h2>

          <p className="text-base leading-7 text-gray-600">
            NoveMarket is a modern and user-friendly online shopping platform
            designed to make your shopping experience simple, convenient, and
            enjoyable. From discovering new
            products to placing an order, eMart is built to provide a seamless
            experience for every customer. We continuously work to improve our
            services and bring better products, offers, and shopping experiences
            to our community.
          </p>
        </div>
        
   

        {/* Join Our Community */}
        <div className="mt-16 max-w-2xl text-start">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Join Our Community
          </h2>

          <p className="mb-8 text-gray-600">
            Stay connected with the latest news, exclusive offers, new
            products, and exciting updates from <span className="font-bold">Nova</span><span className="text-brand-500">Market</span>.
          </p>

          <form className="flex max-w-lg flex-col sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border border-gray-300 bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-gray-900"
            />

            <button
              type="submit"
              className=" bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700"
            >
              <SendHorizontal />
            </button>
          </form>
        </div>

      </div>
    </section>
    </Container>
    </div>

    </>

  );
};

export default About;