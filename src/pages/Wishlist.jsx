import { Link } from "react-router-dom";
import { Heart, ShoppingBag, X } from "lucide-react";
import Container from "../components/Container";
import { useWishlist } from "../context/WishlistContext";
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

export default function Wishlist() {
  const { wishlistItems, removeItem, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlistItems.length === 0) {
    return (
      <Container className="flex flex-col items-center justify-center py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Your wishlist is empty</h1>
        <p className="mt-2 text-sm text-ink/60">Save items you love and find them here later.</p>
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
        <h1 className="font-display text-2xl font-bold sm:text-3xl">Your wishlist</h1>
        <button onClick={clearWishlist} className="text-sm font-medium text-red-600 hover:underline">
          Clear wishlist
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishlistItems.map((item) => {
          const finalPrice = item.discountPrice || item.price;
          const mainImage = getMainImage(item);

          return (
            <div
              key={item._id}
              className="flex flex-col gap-4 rounded-2xl border border-ink/10 p-4"
            >
              <div className="flex gap-4">
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
                      <div className="mt-1 flex items-center gap-2 font-mono text-sm">
                        <span className="text-ink">${finalPrice}</span>
                        {item.discountPrice && (
                          <span className="text-ink/40 line-through">${item.price}</span>
                        )}
                      </div>
                    </div>
                    <button onClick={() => removeItem(item._id)} className="text-ink/30 hover:text-red-600">
                      <X size={18} />
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={() => addToCart(item)}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white hover:bg-ink/90"
              >
                <ShoppingBag size={16} />
                Add to cart
              </button>
            </div>
          );
        })}
      </div>
    </Container>
  );
}

export function WishlistButton({ item, isSaved, onToggle }) {
  return (
    <button
      onClick={() => onToggle(item)}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${
        isSaved
          ? "border-red-600 bg-red-50 text-red-600"
          : "border-ink/10 text-ink/40 hover:text-red-600"
      }`}
    >
      <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
    </button>
  );
}
