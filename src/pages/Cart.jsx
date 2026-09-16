import { Link } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import Container from "../components/Container";
import { useCart } from "../context/CartContext";

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";

function imageSrc(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
}

function getMainImage(item) {
  if (!item?.images?.length) return null;

  const mainImage = item.images.find(
    (img) => img.isMain === true || img.isMain === "true"
  );

  return mainImage || item.images[0];
}

export default function Cart() {
  const { cartItems, increaseQuantity, decreaseQuantity, removeItem, subtotal, clearCart } = useCart();
  const delivery = cartItems.length > 0 ? 60 : 0;
  const total = subtotal + delivery;

  if (cartItems.length === 0) {
    return (
      <Container className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-sm text-ink/60">Looks like you haven't added anything yet.</p>
        <Link
          to="/products"
          className="mt-6 flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-ink/90"
        >
          Start shopping
        </Link>
      </Container>
    );
  }

  return (
    <Container className="py-10">
      <div className="mb-8 flex items-end justify-between">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Your cart</h1>
        <button onClick={clearCart} className="text-sm font-medium text-red-600 hover:underline">
          Clear cart
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {cartItems.map((item) => {
            const finalPrice = item.discountPrice || item.price;
            const mainImage = getMainImage(item);

            return (
              <div
                key={item._id}
                className="flex gap-4 rounded-2xl border border-ink/10 p-4"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-mist">
                  {mainImage?.url ? (
                    <img
                      src={imageSrc(mainImage.url)}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-ink/30">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="mt-1 font-mono text-sm text-ink/60">${finalPrice}</p>
                    </div>
                    <button onClick={() => removeItem(item._id)} className="text-ink/30 hover:text-red-600">
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-ink/10">
                      <button onClick={() => decreaseQuantity(item._id)} className="p-2 hover:bg-mist">
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">{item.quantity}</span>
                      <button onClick={() => increaseQuantity(item._id)} className="p-2 hover:bg-mist">
                        <Plus size={14} />
                      </button>
                    </div>
                    <span className="ml-auto font-mono text-sm font-semibold">
                      ${(finalPrice * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl border border-ink/10 p-6">
          <h2 className="font-display text-lg font-bold">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
            <Row label="Delivery" value={`$${delivery.toFixed(2)}`} />
            <div className="border-t border-ink/10 pt-3">
              <Row label="Total" value={`$${total.toFixed(2)}`} bold />
            </div>
          </div>
          <button className="mt-6 h-12 w-full rounded-full bg-ink text-sm font-semibold text-white hover:bg-ink/90">
            Checkout
          </button>
        </aside>
      </div>
    </Container>
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
