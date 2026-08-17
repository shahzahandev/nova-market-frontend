import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const mainImage = product.images?.find((i) => i.isMain) || product.images?.[0];

  return (
    <div data-reveal className="group">
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-mist">
          {mainImage ? (
            <img
              src={mainImage.url}
              alt={product.title}
              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-ink/20">No image</div>
          )}

          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-ink">
              -{Math.round(100 - (product.discountPrice / product.price) * 100)}%
            </span>
          )}

          <button
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-2 items-center justify-center rounded-full bg-ink text-white opacity-0 shadow-card transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            aria-label="Add to cart"
          >
            <ShoppingBag size={16} />
          </button>
        </div>

        <div className="mt-3">
          <p className="line-clamp-1 text-sm font-medium text-ink">{product.title}</p>
          <div className="mt-1 flex items-center gap-2 font-mono">
            {hasDiscount ? (
              <>
                <span className="text-sm font-semibold text-ink">${product.discountPrice}</span>
                <span className="text-xs text-ink/40 line-through">${product.price}</span>
              </>
            ) : (
              <span className="text-sm font-semibold text-ink">${product.price}</span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
