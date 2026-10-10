import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";
import Container from "../components/Container";
import { useCart } from "../context/CartContext";

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";

function imageSrc(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
}

function getMainImage(product) {
  if (!product?.images?.length) return null;
  const mainImage = product.images.find(
    (img) => img.isMain === true || img.isMain === "true"
  );
  return mainImage || product.images[0];
}

function getUserId() {
  try {
    const account = localStorage.getItem("account");
    if (!account) return null;
    return JSON.parse(account)?._id || null;
  } catch {
    return null;
  }
}

export default function Cart() {
  const navigate = useNavigate();
  const userId = getUserId();

  const { cart, loading, totalAmount, updateQuantity, removeItem, clearCart } = useCart();





  const [busyId, setBusyId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [errors, setErrors] = useState({}); // { [cartItemId]: "error message" }

  const setItemError = (id, message) =>
    setErrors((prev) => ({ ...prev, [id]: message }));

  const clearItemError = (id) =>
    setErrors((prev) => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });

  // ---------- INCREMENT / DECREMENT ----------
  const handleQuantity = async (item, type) => {
    if (type === "minus" && item.quantity <= 1) return;

    // frontend stock check (backend o check kore)
    const stock = Number(item.product?.stock);
    if (type === "plus" && Number.isFinite(stock) && item.quantity >= stock) {
      setItemError(item._id, `Only ${stock} item(s) available in stock`);
      return;
    }

    setBusyId(item._id);
    clearItemError(item._id);
    const result = await updateQuantity(item, type);
    if (!result.ok) setItemError(item._id, result.message);
    setBusyId(null);
  };

  // ---------- DELETE ONE ----------
  const handleRemove = async (id) => {
    setBusyId(id);
    const result = await removeItem(id);
    if (result.ok) clearItemError(id);
    else setItemError(id, result.message);
    setBusyId(null);
  };

  // ---------- CLEAR ALL ----------
  const handleClear = async () => {
    if (clearing || cart.length === 0) return;
    setClearing(true);
    await clearCart();
    setErrors({});
    setClearing(false);
  };

  // ---------- CHECKOUT ----------
  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (loading) {
    return (
      <Container className="py-24 text-center">
        <p className="text-sm text-ink/60">Loading your cart...</p>
      </Container>
    );
  }

  if (!userId) {
    return (
      <Container className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Please log in</h1>
        <p className="mt-2 text-sm text-ink/60">Log in to see your cart.</p>
        <Link
          to="/signin"
          className="mt-6 flex h-12 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-ink/90"
        >
          Log in
        </Link>
      </Container>
    );
  }

  if (cart.length === 0) {
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
        <button
          onClick={handleClear}
          disabled={clearing}
          className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
        >
          {clearing ? "Clearing..." : "Clear cart"}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-4">
          {cart.map((item) => {
            const product = item.product;
            const mainImage = getMainImage(product);
            const isBusy = busyId === item._id || clearing;
            const hasDiscount = Number(product?.discountPrice) > 0;
            const unitPrice = hasDiscount ? product.discountPrice : product?.price;

            // stock logic
            const stock = Number(product?.stock);
            const hasStock = Number.isFinite(stock);
            const maxReached = hasStock && item.quantity >= stock;
            const lowStock = hasStock && stock > 0 && stock <= 5;

            return (
              <div
                key={item._id}
                className={`flex gap-4 rounded-2xl border border-ink/10 p-4 ${
                  isBusy ? "opacity-60" : ""
                }`}
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-mist">
                  {mainImage?.url ? (
                    <img
                      src={imageSrc(mainImage.url)}
                      alt={product?.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[10px] text-ink/30">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col justify-between gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{product?.title}</p>
                      <p className="mt-1 font-mono text-sm text-ink/90">
                        ৳{unitPrice}
                        {hasDiscount && (
                          <span className="ml-2 text-ink/30 line-through">
                            ৳{product.price}
                          </span>
                        )}
                      </p>
                      {lowStock && !maxReached && (
                        <p className="mt-1 text-xs text-orange-600">
                          Only <span className="font-bold">{stock}</span> left in Our Stock
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleRemove(item._id)}
                      disabled={isBusy}
                      className="text-ink/30 hover:text-red-600 disabled:cursor-not-allowed"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center rounded-full border border-ink/10">
                      <button
                        onClick={() => handleQuantity(item, "minus")}
                        disabled={isBusy || item.quantity <= 1}
                        className="p-2 hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantity(item, "plus")}
                        disabled={isBusy || maxReached}
                        title={maxReached ? "Max stock reached" : undefined}
                        className="p-2 hover:bg-mist disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* totalPrice = quantity * finalPrice (backend calculate kore) */}
                    <span className="ml-auto font-mono text-sm font-semibold">
                      ৳{Number(item.totalPrice).toFixed(2)}
                    </span>
                  </div>

                  {maxReached && !errors[item._id] && (
                    <p className="text-xs text-red-600">
                      Max stock reached ({stock} available)
                    </p>
                  )}
                  {errors[item._id] && (
                    <p className="text-xs text-red-600">{errors[item._id]}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <aside className="h-fit rounded-2xl border border-ink/10 p-6">
          <h2 className="font-display text-lg font-bold">Order summary</h2>
          <div className="mt-5 border-t border-ink/10 pt-4 text-sm">
            <Row label="Total Amount" value={`৳${totalAmount.toFixed(2)}`} bold />
          </div>
          <button
            onClick={handleCheckout}
            disabled={clearing}
            className="mt-6 h-12 w-full rounded-full bg-ink text-sm font-semibold text-white hover:bg-ink/90 disabled:opacity-50"
          >
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