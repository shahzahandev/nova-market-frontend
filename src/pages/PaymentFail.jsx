import { Link, useSearchParams } from "react-router-dom";
import { XCircle } from "lucide-react";
import Container from "../components/Container";

export default function PaymentFail() {
  const [params] = useSearchParams();
  const tranId = params.get("tranId");

  return (
    <Container className="flex flex-col items-center justify-center py-24 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-red-600 text-white">
        <XCircle size={26} />
      </span>

      <h1 className="mt-5 font-display text-2xl font-bold">Payment failed</h1>

      <p className="mt-2 text-sm text-ink/60">
        Something went wrong with your payment. Please try again.
      </p>

      {tranId && (
        <p className="mt-3 font-mono text-sm text-ink/60">Order ID: {tranId}</p>
      )}

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link
          to="/checkout"
          className="flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-ink/90"
        >
          Try again
        </Link>
        <Link
          to="/products"
          className="flex h-12 items-center rounded-full border border-ink/10 px-6 text-sm font-semibold hover:bg-mist"
        >
          Continue shopping
        </Link>
      </div>
    </Container>
  );
}