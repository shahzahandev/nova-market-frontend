import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Banknote, Check, CreditCard } from "lucide-react";
import Container from "../components/Container";
import { useCart } from "../context/CartContext";

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";
const ORDER_BASE = `${API_ORIGIN}/api/v1/order`;
const DELIVERY_SETTINGS_URL = `${API_ORIGIN}/api/v1/delivery/settings`;

const ONLINE_PAYMENT_URL = `${ORDER_BASE}/payment`;
const COD_ORDER_URL = `${ORDER_BASE}/cod`;

const CURRENCY = "৳";
const MOBILE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getUserId() {
  try {
    const account = localStorage.getItem("account");
    if (!account) return null;
    return JSON.parse(account)?._id || null;
  } catch {
    return null;
  }
}

const inputClass = (hasError) =>
  `w-full rounded-xl border px-4 text-base outline-none transition focus:border-ink sm:text-sm ${
    hasError ? "border-red-400" : "border-ink/10"
  }`;

export default function Checkout() {
  const { cart, loading, totalAmount, fetchCart } = useCart();
  const userId = getUserId();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    postcode: "",
    address: "",
  });
  const [payment, setPayment] = useState("cod");
  const [deliveryArea, setDeliveryArea] = useState("inside"); // "inside" | "outside"
  const [settings, setSettings] = useState(null);
  const [settingsError, setSettingsError] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  // ---------- Delivery settings ----------
  useEffect(() => {
    let cancelled = false;

    async function loadSettings() {
      try {
        const res = await fetch(DELIVERY_SETTINGS_URL);
        const data = await res.json();
        if (!res.ok || !data?.settings) throw new Error("Failed");
        if (!cancelled) setSettings(data.settings);
      } catch (error) {
        console.error("Delivery settings error:", error);
        if (!cancelled) setSettingsError(true);
      }
    }

    loadSettings();
    return () => {
      cancelled = true;
    };
  }, []);

  // ---------- Delivery charge (shudhu dekhanor jonno, asol hishab backend e) ----------
  const subTotal = totalAmount;

  const freeByPromo = Boolean(settings?.freeAllActive);
  const freeByThreshold = Boolean(
    settings?.freeDeliveryEnabled && subTotal >= settings.freeDeliveryThreshold
  );
  const isFree = freeByPromo || freeByThreshold;

  const chargeFor = (area) => {
    if (!settings) return 0;
    if (isFree) return 0;
    return area === "inside"
      ? Number(settings.insideDhakaCharge)
      : Number(settings.outsideDhakaCharge);
  };

  const delivery = chargeFor(deliveryArea);
  const total = subTotal + delivery;

  const amountLeftForFree =
    settings?.freeDeliveryEnabled && !isFree
      ? Math.max(0, Number(settings.freeDeliveryThreshold) - subTotal)
      : 0;

  const setField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: "" }));
  };

  // ---------- Validation ----------
  const validate = () => {
    const next = {};

    if (!form.name.trim()) next.name = "Name is required.";

    if (!form.mobile.trim()) next.mobile = "Mobile number required.";
    else if (!MOBILE_REGEX.test(form.mobile.trim()))
      next.mobile = "Valid mobile number required";

    if (!form.city.trim()) next.city = "City required.";
    if (!form.address.trim()) next.address = "Delivery address required.";

    // Online payment e email lage, COD te optional
    if (payment === "online" && !form.email.trim())
      next.email = "Need email for Online payment.";
    else if (form.email.trim() && !EMAIL_REGEX.test(form.email.trim()))
      next.email = "Valid email required.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  // ---------- Confirm Order ----------
  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    if (!validate()) return;

    if (!userId) {
      setServerError("Please log in first.");
      return;
    }

    if (!settings) {
      setServerError("Delivery charge could not be loaded. Please refresh the page.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        userId,
        deliveryArea, // charge na, shudhu area pathai. Charge backend hishab kore
        cus_name: form.name.trim(),
        cus_email: form.email.trim(),
        cus_add1: form.address.trim(),
        cus_add2: form.address.trim(),
        cus_city: form.city.trim(),
        cus_state: form.city.trim(),
        cus_postcode: form.postcode.trim(),
        cus_phone: form.mobile.trim(),
        paymentMethod: payment,
      };

      const response = await fetch(
        payment === "online" ? ONLINE_PAYMENT_URL : COD_ORDER_URL,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok || data?.success === false) {
        throw new Error(data?.message || "Could not place the order.");
      }

      // Online payment: gateway page e pathiye dao
      if (payment === "online") {
        const paymentUrl = data?.paymentLink?.payment_url;
        if (!paymentUrl) throw new Error("Payment link not found.");

        window.location.href = paymentUrl;
        return;
      }

      // Cash on Delivery: backend cart clear kore, ekhane abar fetch
      await fetchCart();
      setPlacedOrder({
        tranId: data?.tranId || data?.order?.tranId || "",
        grandTotal: data?.grandTotal,
      });
    } catch (err) {
      console.error("Checkout error:", err);
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Order placed ----------
  if (placedOrder) {
    return (
      <Container className="flex flex-col items-center justify-center py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white">
          <Check size={26} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">Order confirmed</h1>
        <p className="mt-2 text-sm text-ink/60">
          Thank you! Please pay when your order is delivered.
        </p>
        {placedOrder.tranId && (
          <p className="mt-3 font-mono text-sm text-ink/60">
            Order ID: {placedOrder.tranId}
          </p>
        )}
        {placedOrder.grandTotal !== undefined && (
          <p className="mt-1 font-mono text-sm font-semibold">
            Total: {CURRENCY}
            {Number(placedOrder.grandTotal).toFixed(2)}
          </p>
        )}
        <Link
          to="/products"
          className="mt-6 flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-ink/90"
        >
          Continue shopping
        </Link>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container className="py-24 text-center">
        <p className="text-sm text-ink/60">Loading...</p>
      </Container>
    );
  }

  if (!userId) {
    return <Navigate to="/signin" replace />;
  }

  // ---------- Empty cart ----------
  if (cart.length === 0) {
    return (
      <Container className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-ink/60">
          Add some products before checkout.
        </p>
        <Link
          to="/products"
          className="mt-6 flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-ink/90"
        >
          Start shopping
        </Link>
      </Container>
    );
  }

  // ---------- Render ----------
  return (
    <Container className="py-10">
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Checkout</h1>
        <Link to="/cart" className="mt-1 inline-block text-sm text-ink/60 hover:underline">
          ← Back to cart
        </Link>
      </div>

      <form
        onSubmit={handleSubmit}
        noValidate
        className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]"
      >
        {/* ================= Left ================= */}
        <div className="flex min-w-0 flex-col gap-8">
          {/* 1. Delivery details */}
          <section className="rounded-2xl border border-ink/10 p-5 sm:p-6">
            <SectionTitle number="1" title="Delivery details" />

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Full name" error={errors.name}>
                <input
                  type="text"
                  value={form.name}
                  onChange={setField("name")}
                  placeholder="Your name"
                  autoComplete="name"
                  className={`h-12 ${inputClass(errors.name)}`}
                />
              </Field>

              <Field label="Mobile number" error={errors.mobile}>
                <input
                  type="tel"
                  inputMode="tel"
                  value={form.mobile}
                  onChange={setField("mobile")}
                  placeholder="01XXXXXXXXX"
                  autoComplete="tel"
                  className={`h-12 ${inputClass(errors.mobile)}`}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Email" error={errors.email} optional={payment !== "online"}>
                  <input
                    type="email"
                    value={form.email}
                    onChange={setField("email")}
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={`h-12 ${inputClass(errors.email)}`}
                  />
                </Field>
              </div>

              <Field label="City" error={errors.city}>
                <input
                  type="text"
                  value={form.city}
                  onChange={setField("city")}
                  placeholder="Dhaka"
                  autoComplete="address-level2"
                  className={`h-12 ${inputClass(errors.city)}`}
                />
              </Field>

              <Field label="Postcode" error={errors.postcode} optional>
                <input
                  type="text"
                  inputMode="numeric"
                  value={form.postcode}
                  onChange={setField("postcode")}
                  placeholder="1212"
                  autoComplete="postal-code"
                  className={`h-12 ${inputClass(errors.postcode)}`}
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Delivery address" error={errors.address}>
                  <textarea
                    value={form.address}
                    onChange={setField("address")}
                    placeholder="House, Road, Block, Area"
                    autoComplete="street-address"
                    rows={3}
                    className={`min-h-[96px] resize-none py-3 ${inputClass(errors.address)}`}
                  />
                </Field>
              </div>

              {/* Delivery area */}
              <div className="sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium">Delivery area</span>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <AreaOption
                    value="inside"
                    selected={deliveryArea === "inside"}
                    onChange={setDeliveryArea}
                    title="Inside Dhaka"
                    charge={settings ? chargeFor("inside") : null}
                  />
                  <AreaOption
                    value="outside"
                    selected={deliveryArea === "outside"}
                    onChange={setDeliveryArea}
                    title="Outside Dhaka"
                    charge={settings ? chargeFor("outside") : null}
                  />
                </div>

                {settingsError && (
                  <p className="mt-2 text-xs text-red-600">
                    Could not load delivery charge. Please refresh the page.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* 2. Payment method */}
          <section className="rounded-2xl border border-ink/10 p-5 sm:p-6">
            <SectionTitle number="2" title="Payment method" />

            <div className="mt-5 flex flex-col gap-3">
              <PaymentOption
                value="cod"
                selected={payment === "cod"}
                onChange={setPayment}
                icon={Banknote}
                title="Cash on Delivery"
                desc="Make payment after get order on hand."
              />
              <PaymentOption
                value="online"
                selected={payment === "online"}
                onChange={setPayment}
                icon={CreditCard}
                title="Online Payment"
                desc="Advance pay. Secure payment gateway."
              />
            </div>
          </section>
        </div>

        {/* ===== Right: 3. Order summary ===== */}
        <aside className="h-fit rounded-2xl border border-ink/10 p-5 sm:p-6 lg:sticky lg:top-24">
          <SectionTitle number="3" title="Order summary" />

          <ul className="mt-5 max-h-56 divide-y divide-ink/10 overflow-y-auto pr-1">
            {cart.map((item) => (
              <li
                key={item._id}
                className="flex items-start justify-between gap-3 py-2.5 text-sm"
              >
                <span className="min-w-0 break-words">
                  {item.product?.title}
                  <span className="ml-1 text-ink/50">× {item.quantity}</span>
                </span>
                <span className="shrink-0 font-mono">
                  {CURRENCY}
                  {Number(item.totalPrice).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-3 border-t border-ink/10 pt-4 text-sm">
            <Row label="Subtotal" value={`${CURRENCY}${subTotal.toFixed(2)}`} />
            <Row
              label="Delivery charge"
              value={
                !settings
                  ? "..."
                  : isFree
                  ? "Free"
                  : `${CURRENCY}${delivery.toFixed(2)}`
              }
              highlight={Boolean(settings) && isFree}
            />

            {freeByPromo && (
              <p className="text-xs text-emerald-600">
                Free delivery offer is running on all products!
              </p>
            )}
            {amountLeftForFree > 0 && (
              <p className="text-xs text-ink/50">
                Add {CURRENCY}
                {amountLeftForFree.toFixed(2)} more to get free delivery.
              </p>
            )}

            <div className="border-t border-ink/10 pt-3">
              <Row
                label="Total"
                value={`${CURRENCY}${total.toFixed(2)}`}
                bold
              />
            </div>
          </div>

          {serverError && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !settings}
            className="mt-6 h-12 w-full rounded-full bg-ink text-sm font-semibold text-white hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Placing order..." : "Confirm Order"}
          </button>
        </aside>
      </form>
    </Container>
  );
}

function SectionTitle({ number, title }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink text-xs font-semibold text-white">
        {number}
      </span>
      <h2 className="font-display text-lg font-bold">{title}</h2>
    </div>
  );
}

function Field({ label, error, optional, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-sm font-medium">
        {label}
        {optional && <span className="text-xs font-normal text-ink/40">(optional)</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function AreaOption({ value, selected, onChange, title, charge }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition focus-within:ring-2 focus-within:ring-ink/20 ${
        selected ? "border-ink bg-mist" : "border-ink/10 hover:border-ink/30"
      }`}
    >
      <input
        type="radio"
        name="deliveryArea"
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="sr-only"
      />

      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
          selected ? "border-ink bg-ink text-white" : "border-ink/20"
        }`}
      >
        {selected && <Check size={12} />}
      </span>

      <span className="min-w-0 flex-1 text-sm font-semibold">{title}</span>

      <span className="shrink-0 font-mono text-sm text-ink/70">
        {charge === null ? "..." : charge === 0 ? "Free" : `${CURRENCY}${charge}`}
      </span>
    </label>
  );
}

function PaymentOption({ value, selected, onChange, icon: Icon, title, desc }) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-4 rounded-2xl border p-4 transition focus-within:ring-2 focus-within:ring-ink/20 ${
        selected ? "border-ink bg-mist" : "border-ink/10 hover:border-ink/30"
      }`}
    >
      <input
        type="radio"
        name="payment"
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="sr-only"
      />

      <span
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
          selected ? "bg-ink text-white" : "bg-mist text-ink/60"
        }`}
      >
        <Icon size={18} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold">{title}</span>
        <span className="block text-xs text-ink/60">{desc}</span>
      </span>

      <span
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-ink bg-ink text-white" : "border-ink/20"
        }`}
      >
        {selected && <Check size={12} />}
      </span>
    </label>
  );
}

function Row({ label, value, bold, highlight }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-semibold text-ink" : "text-ink/60"}>{label}</span>
      <span
        className={`font-mono ${bold ? "text-base font-bold" : ""} ${
          highlight ? "font-semibold text-emerald-600" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}