import { Link } from "react-router-dom";
import { useState } from "react";

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";

function imageSrc(url) {
  if (!url) return "";

  return url.startsWith("http")
    ? url
    : `${API_ORIGIN}${url}`;
}

// =====================================================
// Date Only Helper
// =====================================================

function getDateOnly(dateValue) {
  if (!dateValue) return null;

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  // Local date only
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );
}

export default function ProductCard({ product }) {
  // =====================================================
  // Image Load State
  // =====================================================

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // =====================================================
  // Main Image
  // =====================================================

  const mainImage =
    product.images?.find(
      (image) => image.isMain
    ) || product.images?.[0];

  // =====================================================
  // Today's Date
  // =====================================================

  const today = getDateOnly(
    new Date()
  );

  // =====================================================
  // Discount Dates
  // =====================================================

  const startDate = getDateOnly(
    product.discountStartDate
  );

  const endDate = getDateOnly(
    product.discountEndDate
  );

  // =====================================================
  // Discount Date Validation
  // =====================================================

  const discountStarted =
    startDate &&
    today &&
    today >= startDate;

  const discountNotExpired =
    endDate &&
    today &&
    today <= endDate;

  // =====================================================
  // Final Discount Check
  // =====================================================

  const hasDiscount =
    Number(product.discountPrice) <
      Number(product.price) &&
    discountStarted &&
    discountNotExpired;

  // =====================================================
  // Discount Percentage
  // =====================================================

  const discountPercentage = hasDiscount
    ? Math.round(
        100 -
          (Number(product.discountPrice) /
            Number(product.price)) *
            100
      )
    : 0;

  return (
    <div
      data-reveal
      className="group hover:bg-gray-300"
    >
      <div className="relative z-999">

        {/* =================================================
            View Product
        ================================================= */}

        <Link
          to={`/products/${product._id}`}
          className="block"
        >
          <div
            className="absolute bottom-0 right-0 z-30 flex h-full w-full items-center justify-center bg-gray-300/70 text-white opacity-0 shadow-card transition-all duration-300 group-hover:opacity-100"
            aria-label="View product"
          >
            <span className="translate-y-2 bg-black px-8 py-3 text-sm transition-all duration-300 group-hover:translate-y-0 md:px-12 md:py-5 md:text-lg">
              View
            </span>
          </div>
        </Link>

        {/* =================================================
            Product Image
        ================================================= */}

        <div className="relative z-0 aspect-square overflow-hidden bg-mist">

          {mainImage?.url && !imageError ? (
            <>
              {/* Skeleton shown until image finishes loading */}
              {!imageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-mist">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-ink/10 border-t-ink/40" />
                </div>
              )}

              <img
                src={imageSrc(mainImage.url)}
                alt={product.title}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
                className={`h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-105 ${
                  imageLoaded ? "opacity-100" : "opacity-0"
                }`}
              />
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-ink/20">
              No image
            </div>
          )}

          {/* =================================================
              Discount Percentage Badge
          ================================================= */}

          {hasDiscount && (
            <span className="absolute left-3 top-3 rounded-full bg-amber-400 px-2.5 py-1 text-xs font-bold text-ink">
              -{discountPercentage}%
            </span>
          )}
        </div>

        {/* =================================================
            Product Information
        ================================================= */}

        <div className="mt-3 text-center">

          {/* Category */}

          <p className="text-[12px] text-ink capitalize">
            {product.category}
          </p>

          {/* Product Title */}

          <p className="line-clamp-1 text-sm font-medium text-ink">
            {product.title}
          </p>

          {/* =================================================
              Price
          ================================================= */}

          <div className="flex items-center justify-center gap-1">

            {hasDiscount ? (
              <>
                {/* Discount Price */}

                <span className="text-[12px] font-bold text-black">
                  ৳{product.discountPrice}
                </span>

                {/* Original Price */}

                <span className="text-[10px] text-slate-600 line-through">
                  ৳{product.price}
                </span>
              </>
            ) : (
              /* Normal Price */

              <span className="text-sm font-bold text-slate-500">
                ৳{product.price}
              </span>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
