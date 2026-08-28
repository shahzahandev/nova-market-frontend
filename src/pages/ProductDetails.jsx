import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import {
    ShoppingBag,
    Truck,
    ShieldCheck,
    RotateCcw,
} from "lucide-react";
import axios from "axios";
import Container from "../components/Container";
import { useCart } from "../context/CartContext";

const MAX_THUMBNAILS = 5;

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";

function imageSrc(url) {
    if (!url) return "";

    return url.startsWith("http")
        ? url
        : `${API_ORIGIN}${url}`;
}

// =====================================================
// Convert date to local date only
// Time will be ignored
// =====================================================

function getDateOnly(dateValue) {
    if (!dateValue) return null;

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
        return null;
    }

    return new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    );
}

export default function ProductDetails() {
    const { id } = useParams();
    const location = useLocation();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(
        location.state?.product || null
    );

    const [activeImage, setActiveImage] = useState(0);
    const [added, setAdded] = useState(false);

    // =====================================================
    // Fetch Product
    // =====================================================

    useEffect(() => {
        if (product) return;

        async function getProduct() {
            try {
                const res = await axios.post(
                    `${API_ORIGIN}/api/v1/product/singleProduct/${id}`
                );

                setProduct(res.data.data);
            } catch (error) {
                console.log("Product fetch error:", error);
            }
        }

        getProduct();
    }, [id, product]);

    // =====================================================
    // Set Main Image
    // =====================================================

    useEffect(() => {
        if (!product?.images?.length) {
            setActiveImage(0);
            return;
        }

        const mainIndex = product.images.findIndex(
            (img) =>
                img.isMain === true ||
                img.isMain === "true"
        );

        setActiveImage(
            mainIndex >= 0 ? mainIndex : 0
        );
    }, [product]);

    // =====================================================
    // Loading
    // =====================================================

    if (!product) {
        return (
            <p className="py-20 text-center text-sm text-ink/40">
                Loading...
            </p>
        );
    }

    // =====================================================
    // Discount Date Logic
    // =====================================================

    const today = getDateOnly(new Date());

    const startDate = getDateOnly(
        product.discountStartDate
    );

    const endDate = getDateOnly(
        product.discountEndDate
    );

    const discountStarted =
        startDate &&
        today &&
        today >= startDate;

    const discountNotExpired =
        endDate &&
        today &&
        today <= endDate;

    // =====================================================
    // Active Discount
    // =====================================================

    const hasDiscount =
        Number(product.discountPrice) <
            Number(product.price) &&
        discountStarted &&
        discountNotExpired;

    // =====================================================
    // Discount Percentage
    // =====================================================

    const discountPercent = hasDiscount
        ? Math.round(
              100 -
                  (Number(product.discountPrice) /
                      Number(product.price)) *
                      100
          )
        : 0;

    // =====================================================
    // Images
    // =====================================================

    const images = product.images?.length
        ? product.images
        : [];

    const visibleImages = images.slice(
        0,
        MAX_THUMBNAILS
    );

    // =====================================================
    // Add To Cart
    // =====================================================

    const handleAddToCart = () => {
        addToCart(product);

        setAdded(true);

        setTimeout(() => {
            setAdded(false);
        }, 1800);
    };

    return (
        <Container className="py-6 sm:py-8 md:py-10">

            <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">

                {/* =================================================
                    Product Images
                ================================================= */}

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-5">

                    {visibleImages.length > 1 && (
                        <div className="order-2 flex w-full gap-3 overflow-x-auto pb-1 md:order-1 md:w-20 md:flex-col md:overflow-hidden md:pb-0">

                            {visibleImages.map((img, i) => (
                                <button
                                    key={img._id || i}
                                    type="button"
                                    onClick={() =>
                                        setActiveImage(i)
                                    }
                                    aria-label={`View image ${
                                        i + 1
                                    }`}
                                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 sm:h-18 sm:w-18 md:h-18 md:w-18 ${
                                        activeImage === i
                                            ? "scale-[1.02] border-brand-400"
                                            : "border-transparent hover:border-ink/15"
                                    }`}
                                >
                                    {img.url ? (
                                        <img
                                            src={imageSrc(
                                                img.url
                                            )}
                                            alt={`${product.title} ${
                                                i + 1
                                            }`}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <div className="h-full w-full bg-mist" />
                                    )}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="order-1 flex-1">

                        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-mist sm:rounded-3xl">

                            {images[activeImage]?.url ? (
                                <img
                                    src={imageSrc(
                                        images[activeImage].url
                                    )}
                                    alt={product.title}
                                    className="h-full w-full object-cover transition duration-300"
                                />
                            ) : (
                                <div className="flex h-full items-center justify-center text-sm text-ink/20">
                                    Product image
                                </div>
                            )}

                        </div>

                    </div>
                </div>

                {/* =================================================
                    Product Details
                ================================================= */}

                <div>

                    <h1 className="mt-3 font-display text-3xl font-semibold">
                        <span className="text-4xl font-extrabold">
                            {product.title}
                        </span>
                        : {product.shortDescription}
                    </h1>

                    {/* Rating */}

                    {product.rating > 0 && (
                        <div className="mt-3 flex items-center gap-2">

                            <span className="font-semibold">
                                {product.rating}
                            </span>

                            <span className="text-amber-500">
                                ★★★★★
                            </span>

                            {product.reviewCount > 0 && (
                                <span className="text-sm text-ink/50">
                                    (
                                    {product.reviewCount.toLocaleString()}
                                    reviews)
                                </span>
                            )}

                        </div>
                    )}

                    {/* =================================================
                        Price
                    ================================================= */}

                    <div className="mt-5 flex items-center gap-5">

                        {hasDiscount ? (
                            <>
                                {/* Discount Price */}

                                <span className="text-2xl font-bold text-brand-600 sm:text-3xl">
                                    ৳{product.discountPrice}
                                </span>

                                {/* Original Price */}

                                <span className="text-lg text-slate-400 line-through sm:text-xl md:text-2xl">
                                    ৳{product.price}
                                </span>

                                {/* Discount Percentage */}

                                <span className="rounded-full bg-amber-400/20 px-2.5 py-1 text-xs font-bold text-amber-600">
                                    -{discountPercent}%
                                </span>
                            </>
                        ) : (
                            <span className="text-2xl font-bold text-slate-500 sm:text-3xl">
                                ৳{product.price}
                            </span>
                        )}

                    </div>

                    {/* Stock */}

                    <p className="mt-3 text-xs font-medium text-emerald-600">
                        {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of stock"}
                    </p>

                    {/* Add To Cart */}

                    <div className="mt-6 flex gap-3">

                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="flex flex-1 items-center justify-center gap-2 bg-ink py-5 text-lg font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ShoppingBag size={20} />

                            {added
                                ? "Added to cart"
                                : "Add to cart"}
                        </button>

                    </div>

                    {/* Category / Brand / Tags */}

                    <div className="mt-3 flex flex-col flex-wrap gap-3">

                        {product.category && (
                            <span className="text-lg font-semibold capitalize text-ink/60">
                                <span className="text-black">
                                    Category :
                                </span>{" "}
                                {product.category?.name ||
                                    product.category}
                            </span>
                        )}

                        {product.brand && (
                            <span className="text-lg font-semibold capitalize text-ink/60">
                                <span className="text-black">
                                    Brand :
                                </span>{" "}
                                {product.brand}
                            </span>
                        )}

                        {product.tag?.length > 0 && (
                            <span className="text-lg font-semibold capitalize text-ink/60">
                                <span className="text-black">
                                    Tags :
                                </span>{" "}
                                {product.tag.join(",  ")}
                            </span>
                        )}

                    </div>

                    {/* Description */}

                    {product.description && (
                        <div className="mt-6">

                            <h2 className="text-xl font-semibold">
                                Description
                            </h2>

                            <p className="mt-2 text-lg leading-relaxed text-ink/60">
                                {product.description}
                            </p>

                        </div>
                    )}

                    {/* Additional Information */}

                    {product.additionalInfo && (
                        <div className="mt-6">

                            <h2 className="text-xl font-semibold">
                                Additional Information
                            </h2>

                            <p className="mt-2 text-lg leading-relaxed text-ink/60">
                                {product.additionalInfo}
                            </p>

                        </div>
                    )}

                    {/* Specifications */}

                    {product.specifications?.length > 0 && (
                        <div className="mt-8">

                            <h2 className="text-xl font-semibold">
                                Product Specifications
                            </h2>

                            <div className="mt-3 overflow-hidden rounded-xl border border-ink/10">

                                {product.specifications.map(
                                    (spec, index) => (
                                        <div
                                            key={
                                                spec._id ||
                                                index
                                            }
                                            className="grid grid-cols-2 border-b border-ink/10 last:border-b-0"
                                        >
                                            <div className="bg-mist px-4 py-3 text-sm font-semibold">
                                                {spec.name}
                                            </div>

                                            <div className="px-4 py-3 text-sm text-ink/60">
                                                {spec.value}
                                            </div>
                                        </div>
                                    )
                                )}

                            </div>
                        </div>
                    )}

                    {/* Features */}

                    {product.features?.length > 0 && (
                        <div className="mt-8">

                            <h2 className="text-xl font-semibold">
                                About this item
                            </h2>

                            <ul className="mt-3 space-y-2">

                                {product.features.map(
                                    (feature, index) => (
                                        <li
                                            key={index}
                                            className="flex gap-2 text-sm leading-relaxed text-ink/60"
                                        >
                                            <span className="mt-1">
                                                •
                                            </span>

                                            <span>
                                                {feature}
                                            </span>
                                        </li>
                                    )
                                )}

                            </ul>

                        </div>
                    )}

                    {/* Features Bottom */}

                    <div className="mt-8 grid grid-cols-3 gap-3 border-y border-ink/10 py-6 text-center text-xs text-ink/60">

                        <Feature
                            icon={Truck}
                            label="Fast delivery"
                        />

                        <Feature
                            icon={ShieldCheck}
                            label="Secure payment"
                        />

                        <Feature
                            icon={RotateCcw}
                            label="7-day returns"
                        />

                    </div>

                </div>
            </div>
        </Container>
    );
}

function Feature({ icon: Icon, label }) {
    return (
        <div className="flex flex-col items-center gap-1.5">
            <Icon size={18} />
            {label}
        </div>
    );
}