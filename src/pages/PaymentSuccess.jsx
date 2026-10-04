import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import Container from "../components/Container";
import { useCart } from "../context/CartContext";

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const tranId = params.get("tranId");
  const cart = useCart();

  // Backend cart clear kore dey, ekhane shudhu UI refresh
  useEffect(() => {
    if (typeof cart.refreshCart === "function") cart.refreshCart();
    else if (typeof cart.clearCart === "function") cart.clearCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container className="flex flex-col items-center justify-center py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1cee5f] text-white">
        <Check size={26} />
      </span>

      <h1 className="mt-5 font-display text-2xl font-bold">Payment successful</h1>

      <p className="mt-2 text-sm text-ink/60">
        Thank you! Your payment was received and your order is confirmed.
      </p>

      {tranId && (
        <p className="mt-3 font-mono text-sm text-ink/60">Order ID: {tranId}</p>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/profile"
          className="flex h-12 items-center rounded-full border border-ink/10 px-6 text-sm font-semibold hover:bg-mist"
        >
          View my orders
        </Link>
        <Link
          to="/products"
          className="flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-ink/90"
        >
          Continue shopping
        </Link>
      </div>
    </Container>
  );
}