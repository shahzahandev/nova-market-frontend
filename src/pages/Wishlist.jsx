import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, X } from "lucide-react";
import Container from "../components/Container";
import { useWishlist } from "../context/WishlistContext";

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
  const {
    wishlistItems,
    removeItem,
    clearWishlist,
    isLoggedIn,
    loading,
    error,
    refreshWishlist,
  } = useWishlist();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/signin");
    }
  }, [isLoggedIn, navigate]);

  if (!isLoggedIn) {
    return null; // redirecting
  }

  if (loading) {
    return (
      <Container className="py-24 text-center text-sm text-ink/40">
        Loading your wishlist...
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-sm text-red-600">{error}</p>
        <button
          type="button"
          onClick={refreshWishlist}
          className="mt-4 flex h-11 items-center rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-ink/90"
        >
          Try again
        </button>
      </Container>
    );
  }

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

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {wishlistItems.map((item) => {
          const mainImage = getMainImage(item);

          return (
            <div
              key={item._id}
              className="group relative flex flex-col gap-3 rounded-2xl border border-ink/10 p-3"
            >
              <button
                type="button"
                onClick={() => removeItem(item._id)}
                aria-label="Remove from wishlist"
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-ink/40 backdrop-blur hover:text-red-600"
              >
                <X size={16} />
              </button>
              <Link to={`/products/${item._id}`} className="flex flex-col gap-3">
                <div className="aspect-square w-full overflow-hidden rounded-xl bg-mist">
                  {mainImage?.url ? (
                    <img
                      src={imageSrc(mainImage.url)}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-200 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-ink/30">
                      No image
                    </div>
                  )}
                </div>

                <p className="line-clamp-2 text-sm font-medium text-ink">
                  {item.title}
                </p>
              </Link>
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
