import { Link } from "react-router-dom";

const API_ORIGIN = "http://localhost:3000";

function imageSrc(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
}

export default function ProductCard({ product }) {
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const mainImage = product.images?.find((i) => i.isMain) || product.images?.[0];

  return (
    <div data-reveal className="group hover:bg-gray-300">
      <div className="relative z-999">
        <Link to={`/products/${product._id}`} className="block">
          <button
            className="absolute z-30 bottom-0 right-0 flex h-full w-full items-center justify-center bg-gray-300/70 text-white opacity-0 shadow-card transition-all duration-300  group-hover:opacity-100"
            aria-label="Add to cart"
          >
            <button className="py-3 px-8 md:py-5 md:px-12 bg-black translate-y-2 group-hover:translate-y-0 transition-all duration-300 md:text-lg text-sm">View</button>
          </button>
        </Link>

        <div className="relative aspect-square overflow-hidden bg-mist z-0">
          {mainImage?.url ? (
            <img
              src={imageSrc(mainImage.url)}
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
        </div>

        <div className="mt-3 text-center">
          <p className="text-[12px] text-ink capitalize">
            {product.category}
          </p>
          <p className="line-clamp-1 text-sm font-medium text-ink">{product.title}</p>
          <div className="mt-1 flex items-center justify-center gap-2 font-mono">
            {hasDiscount ? (
              <>
                <div className="flex flex-col">
                  <span className="mb-2 text-sm font-semibold text-ink">৳{product.discountPrice}</span>
                </div>
              </>
            ) : (
              <span className="mb-2 text-sm font-semibold text-ink">৳{product.price}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
