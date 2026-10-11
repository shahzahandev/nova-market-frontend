import React, { useEffect, useState } from "react";
import Container from "../components/Container";
import BrandName from "../components/BrandName";
import { useStoreInfo } from "../context/StoreInfoContext";

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";
const DELIVERY_URL = `${API_ORIGIN}/api/v1/delivery/settings`;

// Default (API na ashle ba load howar age)
const DEFAULT_SETTINGS = {
  insideDhakaCharge: 60,
  outsideDhakaCharge: 120,
  freeDeliveryEnabled: false,
  freeDeliveryThreshold: 0,
  freeAllEnabled: false,
  freeAllStartDate: null,
  freeAllEndDate: null,
};

const formatTaka = (value) => `৳${Number(value || 0).toLocaleString("en-US")}`;

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// Site-wide free delivery ekhon cholche kina
const isFreeAllActive = (s) => {
  if (!s.freeAllEnabled) return false;

  const now = new Date();
  const start = s.freeAllStartDate ? new Date(s.freeAllStartDate) : null;
  const end = s.freeAllEndDate ? new Date(s.freeAllEndDate) : null;

  if (start && now < start) return false;
  if (end && now > end) return false;

  return true;
};

const Shipping = () => {
  const { storeInfo } = useStoreInfo();

  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const storeName = storeInfo?.storeName || "NovaMarket";

  // Notun model: storePolicy.returnPolicy, purono document: root-e returnPolicy
  const returnPolicy = (
    storeInfo?.storePolicy?.returnPolicy ||
    storeInfo?.returnPolicy ||
    ""
  ).trim();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(DELIVERY_URL);

        let data = null;
        try {
          data = await response.json();
        } catch {
          data = null;
        }

        if (!response.ok) {
          throw new Error(data?.message || "Failed to load delivery charges.");
        }

        // Response shape jai hok handle korbe
        const result = data?.settings || data?.data || data;

        setSettings({ ...DEFAULT_SETTINGS, ...result });
      } catch (err) {
        console.error("Delivery settings fetch error:", err);
        setError("Could not load the latest delivery charges.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const freeAll = isFreeAllActive(settings);

  const deliveryOptions = [
    {
      title: "Inside Dhaka",
      price: freeAll ? "Free" : formatTaka(settings.insideDhakaCharge),
      time: "Delivery within 3 days",
      text: "Orders placed for addresses inside Dhaka are delivered within 3 days.",
    },
    {
      title: "Outside Dhaka",
      price: freeAll ? "Free" : formatTaka(settings.outsideDhakaCharge),
      time: "Delivery within 4–5 days",
      text: "Orders placed for addresses outside Dhaka are delivered within 4–5 days.",
    },
  ];

  // Free delivery card (shudhu enabled thakle)
  if (freeAll) {
    deliveryOptions.push({
      title: "Free Delivery Offer",
      price: "Free",
      time: settings.freeAllEndDate
        ? `Until ${formatDate(settings.freeAllEndDate)}`
        : "Limited time",
      text: "Enjoy free delivery on all orders during this offer period.",
    });
  } else if (
    settings.freeDeliveryEnabled &&
    Number(settings.freeDeliveryThreshold) > 0
  ) {
    deliveryOptions.push({
      title: "Free Delivery",
      price: formatTaka(settings.freeDeliveryThreshold),
      time: "Minimum order amount",
      text: `Get free delivery when your cart total is ${formatTaka(
        settings.freeDeliveryThreshold
      )} or more.`,
    });
  }

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
                At {storeName}, we want your order to reach you quickly and
                safely. Here you can find our delivery charges, estimated
                delivery times, and return policy.
              </p>
            </div>

            {/* Delivery Options */}
            <div className="mt-10">
              <h3 className="mb-4 text-2xl font-bold text-gray-900">
                Delivery Charges & Time
              </h3>

              {error && (
                <p className="mb-4 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {error}
                </p>
              )}

              {loading ? (
                <p className="text-sm text-gray-500">
                  Loading delivery charges...
                </p>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {deliveryOptions.map((item) => (
                    <div
                      key={item.title}
                      className="border border-gray-200 p-5"
                    >
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
              )}
            </div>

            {/* Return Policy (admin panel theke) */}
            {returnPolicy && (
              <div className="mt-10">
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Return Policy
                </h3>

                <p className="whitespace-pre-line text-base leading-7 text-gray-600">
                  {returnPolicy}
                </p>
              </div>
            )}

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

            {/* Closing Message */}
            <div className="mt-10 border-l-4 border-brand-500 bg-gray-50 px-5 py-5">
              <p className="text-base font-medium leading-7 text-gray-700">
                Have a question about your delivery or return? Our{" "}
                <span className="font-bold">
                  <BrandName name={storeName} />
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