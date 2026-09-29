import { useState } from "react";
import { Link } from "react-router-dom";
import { Banknote, Check, CreditCard } from "lucide-react";
import Container from "../components/Container";
import { useCart } from "../context/CartContext";

// =====================================================
// API  (route gulo tomar backend onujayi thik kore nio)
// =====================================================

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";
const ORDER_BASE = `${API_ORIGIN}/auth/v1/order`;

const ONLINE_PAYMENT_URL = `${ORDER_BASE}/payment`; // paymentController
const COD_ORDER_URL = `${ORDER_BASE}/cod`; // Cash on Delivery (backend e banate hobe)

// =====================================================
// Config
// =====================================================

const CURRENCY = "$"; // Cart page er moto. BDT dekhate chaile "৳"
const DELIVERY_FEE = 60; // Cart page er delivery fee er sathe mil rakho
const MOBILE_REGEX = /^(?:\+?88)?01[3-9]\d{8}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Backend e userId pathate hoy (cart ta user diye khuje). Login add-to-cart er
// somoy-i hoye jay, tai ekhane login check kora hoy na. Tomar auth setup
// onujayi id ta jekhane rakho, shekhan theke nao (jemon useAuth() hook).
function getUserId() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    return user?._id || user?.id || null;
  } catch {
    return null;
  }
}

const inputClass = (hasError) =>
  `w-full rounded-xl border px-4 text-base outline-none transition focus:border-ink sm:text-sm ${
    hasError ? "border-red-400" : "border-ink/10"
  }`;

// =====================================================
// Checkout Page
// =====================================================

export default function Checkout() {
  const { cartItems, subtotal, clearCart } = useCart();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    city: "",
    postcode: "",
    address: "",
  });
  const [payment, setPayment] = useState("cod");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);

  const delivery = cartItems.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + delivery;

  const setField = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }));
    if (errors[key]) setErrors((current) => ({ ...current, [key]: "" }));
  };

  // ===================================================
  // Validation
  // ===================================================

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

  // ===================================================
  // Confirm Order
  // ===================================================

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError("");

    if (!validate()) return;

    const userId = getUserId();

    setSubmitting(true);

    try {
      const payload = {
        userId,
        cus_name: form.name.trim(),
        cus_email: form.email.trim(),
        cus_add1: form.address.trim(),
        cus_add2: form.address.trim(),
        cus_city: form.city.trim(),
        cus_state: form.city.trim(),
        cus_postcode: form.postcode.trim(),
        cus_phone: form.mobile.trim(),
        paymentMethod: payment,
        deliveryFee: delivery,
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
        throw new Error(data?.message || "Order place kora jayni.");
      }

      // Online payment: gateway page e pathiye dao
      if (payment === "online") {
        const paymentUrl = data?.paymentLink?.payment_url;
        if (!paymentUrl) throw new Error("Payment link paoa jayni.");

        window.location.href = paymentUrl;
        return;
      }

      // Cash on Delivery: order done
      clearCart();
      setPlacedOrder({ tranId: data?.tranId || data?.order?.tranId || "" });
    } catch (err) {
      console.error("Checkout error:", err);
      setServerError(err.message || "Kichu ekta vul hoyeche. Abar chesta koro.");
    } finally {
      setSubmitting(false);
    }
  };

  // ===================================================
  // Order placed
  // ===================================================

  if (placedOrder) {
    return (
      <Container className="flex flex-col items-center justify-center py-24 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-ink text-white">
          <Check size={26} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-bold">Order confirmed</h1>
        <p className="mt-2 text-sm text-ink/60">
          Thank you! Delivery er somoy taka pay korle-i hobe.
        </p>
        {placedOrder.tranId && (
          <p className="mt-3 font-mono text-sm text-ink/60">
            Order ID: {placedOrder.tranId}
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

  // ===================================================
  // Empty cart
  // ===================================================

  if (cartItems.length === 0) {
    return (
      <Container className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-ink/60">
          Checkout korar age kichu product add koro.
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

  // ===================================================
  // Render
  // ===================================================

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
                <Field
                  label="Email"
                  error={errors.email}
                  optional={payment !== "online"}
                >
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
                    placeholder="House, road, area"
                    autoComplete="street-address"
                    rows={3}
                    className={`min-h-[96px] resize-none py-3 ${inputClass(errors.address)}`}
                  />
                </Field>
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
                desc="Advance pay. Secure payment gateway. "
              />
            </div>
          </section>
        </div>

        {/* ================= Right: 3. Order summary ================= */}
        <aside className="h-fit rounded-2xl border border-ink/10 p-5 sm:p-6 lg:sticky lg:top-24">
          <SectionTitle number="3" title="Order summary" />

          <ul className="mt-5 max-h-56 divide-y divide-ink/10 overflow-y-auto pr-1">
            {cartItems.map((item) => {
              const finalPrice = item.discountPrice || item.price;

              return (
                <li key={item._id} className="flex items-start justify-between gap-3 py-2.5 text-sm">
                  <span className="min-w-0 break-words">
                    {item.title}
                    <span className="ml-1 text-ink/50">× {item.quantity}</span>
                  </span>
                  <span className="shrink-0 font-mono">
                    {CURRENCY}
                    {(finalPrice * item.quantity).toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-4 space-y-3 border-t border-ink/10 pt-4 text-sm">
            <Row label="Subtotal" value={`${CURRENCY}${subtotal.toFixed(2)}`} />
            <Row label="Delivery fee" value={`${CURRENCY}${delivery.toFixed(2)}`} />
            <div className="border-t border-ink/10 pt-3">
              <Row label="Total" value={`${CURRENCY}${total.toFixed(2)}`} bold />
            </div>
          </div>

          {serverError && (
            <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {serverError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 h-12 w-full rounded-full bg-ink text-sm font-semibold text-white hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Placing order..." : "Confirm Order"}
          </button>
        </aside>
      </form>
    </Container>
  );
}

// =====================================================
// Small parts
// =====================================================

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

function Row({ label, value, bold }) {
  return (
    <div className="flex justify-between">
      <span className={bold ? "font-semibold text-ink" : "text-ink/60"}>{label}</span>
      <span className={`font-mono ${bold ? "text-base font-bold" : ""}`}>{value}</span>
    </div>
  );
}
