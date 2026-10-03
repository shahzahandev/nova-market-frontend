import React from "react";
import Container from "../components/Container";

const deliveryOptions = [
  {
    title: "Inside Dhaka",
    price: "৳60",
    time: "Delivery within 3 days",
    text: "Orders placed for addresses inside Dhaka are delivered within 3 days.",
  },
  {
    title: "Outside Dhaka",
    price: "৳120",
    time: "Delivery within 4–5 days",
    text: "Orders placed for addresses outside Dhaka are delivered within 4–5 days.",
  },
  {
    title: "Easy Returns",
    price: "7 Days",
    time: "Return window",
    text: "Not happy with your order? You can request a return within 7 days of receiving it.",
  },
];

const Shipping = () => {
  return (
    <div className="bg-gray-100 py-10">
      <Container>
        <section className="bg-white py-8">
          <div className="px-2 sm:px-4 lg:px-6">

            {/* Heading */}
            <div className="text-start">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Shipping <span className="text-brand-500">& Returns</span>
              </h2>

              <p className="text-base leading-7 text-gray-600">
                At NovaMarket, we want your order to reach you quickly and
                safely. Here you can find our delivery charges, estimated
                delivery times, and return policy.
              </p>
            </div>

            {/* Delivery Options */}
            <div className="mt-10">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Delivery Charges & Time
              </h3>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {deliveryOptions.map((item) => (
                  <div key={item.title} className="border border-gray-200 p-5">
                    <h4 className="mb-2 text-lg font-semibold text-gray-900">
                      {item.title}
                    </h4>
                    <p className="text-2xl font-bold text-brand-500">
                      {item.price}
                    </p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {item.time}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-600">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Processing */}
            <div className="mt-10">
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                How Delivery Works
              </h3>

              <p className="text-base leading-7 text-gray-600">
                Once you place an order, we confirm it and prepare it for
                dispatch. The delivery time starts from the moment your order
                is confirmed and is counted in days, not including the time
                it takes to confirm the order.
              </p>

              <p className="mt-4 text-base leading-7 text-gray-600">
                Delivery times are estimates. In rare cases, such as bad
                weather, public holidays, or high order volume, your order
                may take a little longer to arrive.
              </p>
            </div>

            {/* Returns */}
            <div className="mt-10">
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                7-Day Return Policy
              </h3>

              <p className="text-base leading-7 text-gray-600">
                You can return a product within 7 days of receiving it. To be
                eligible for a return, the product should meet the following
                conditions:
              </p>

              <ul className="mt-4 list-disc space-y-2 pl-6 text-base leading-7 text-gray-600">
                <li>The return request is made within 7 days of delivery.</li>
                <li>The product is unused and in its original condition.</li>
                <li>The original packaging, tags, and accessories are included.</li>
                <li>
                  The product is not damaged by the customer after delivery.
                </li>
              </ul>

              <p className="mt-4 text-base leading-7 text-gray-600">
                If you receive a damaged, defective, or wrong item, please
                contact our support team as soon as possible so we can make it
                right.
              </p>
            </div>

            {/* Closing Message */}
            <div className="mt-10 border-l-4 border-brand-500 bg-gray-50 px-5 py-5">
              <p className="text-base font-medium leading-7 text-gray-700">
                Have a question about your delivery or return? Our{" "}
                <span className="font-bold">
                  Nova<span className="text-brand-500">Market</span>
                </span>{" "}
                support team is always happy to help.
              </p>
            </div>

          </div>
        </section>
      </Container>
    </div>
  );
};

export default Shipping;
