import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "../components/Container";
import axios from "axios";

const MAX_THUMBNAILS = 5;

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";

function imageSrc(url) {
    if (!url) return "";

    return url.startsWith("http")
        ? url
        : `${API_ORIGIN}${url}`;
}

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

export default function SingleProduct() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [activeImage, setActiveImage] = useState(0);


    useEffect(() => {
        async function getProduct() {
            try {
                const res = await axios.post(
                    `${API_ORIGIN}/api/v1/product/singleProduct/${id}`
                );

                setProduct(res.data.data);
            } catch (error) {
                console.log(
                    "Product fetch error:",
                    error
                );
            }
        }

        getProduct();
    }, [id]);

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

    if (!product) {
        return (
            <p className="py-20 text-center text-sm text-ink/40">
                Loading...
            </p>
        );
    }


    const images = product.images?.length
        ? product.images
        : [];

    const visibleImages = images.slice(
        0,
        MAX_THUMBNAILS
    );

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

 
    const discountPercent = hasDiscount
        ? Math.round(
              100 -
                  (Number(product.discountPrice) /
                      Number(product.price)) *
                      100
          )
        : 0;

    return (
        <Container className="py-6 sm:py-8 md:py-10">

            <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-5">
                    {visibleImages.length > 1 && (
                        <div className="order-2 flex w-full gap-3 overflow-x-auto pb-1 md:order-1 md:w-20 md:flex-col md:overflow-hidden md:pb-0">
                            {visibleImages.map(
                                (img, i) => (
                                    <button
                                        key={
                                            img._id || i
                                        }
                                        type="button"
                                        onClick={() =>
                                            setActiveImage(
                                                i
                                            )
                                        }
                                        aria-label={`View image ${
                                            i + 1
                                        }`}
                                        className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 sm:h-18 sm:w-18 md:h-18 md:w-18 ${
                                            activeImage ===
                                            i
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
                                )
                            )}

                        </div>
                    )}

                    <div className="order-1 flex-1">

                        <div className="aspect-square w-full overflow-hidden rounded-2xl bg-mist sm:rounded-3xl">

                            {images[activeImage]?.url ? (
                                <img
                                    src={imageSrc(
                                        images[
                                            activeImage
                                        ].url
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
                <div className="flex flex-col">

                    <div className="text-center md:text-start">

                        {/* Brand */}

                        {product.brand && (
                            <p className="font-mono text-sm uppercase tracking-[0.15em] text-brand-600 sm:text-base md:text-lg">
                                {product.brand}
                            </p>
                        )}

                        {/* Title */}

                        <h1 className="mt-2 font-display text-2xl font-bold leading-tight sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
                            {product.title}
                        </h1>

                        {/* Rating */}

                        {product.rating > 0 && (
                            <div className="mt-3 flex items-center justify-center gap-2 md:justify-start">

                                <span className="text-sm font-semibold sm:text-base">
                                    {product.rating}
                                </span>

                                <span className="text-sm tracking-wide text-amber-500 sm:text-base">
                                    ★★★★★
                                </span>

                                {product.reviewCount >
                                    0 && (
                                    <span className="text-xs text-ink/50 sm:text-sm">
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

                        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 font-mono md:justify-start">

                            {hasDiscount ? (
                                <>
                                    {/* Discount Price */}

                                    <span className="text-2xl font-bold text-brand-600 sm:text-3xl">
                                        ৳
                                        {
                                            product.discountPrice
                                        }
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

                    </div>

                    {/* =================================================
                        Get It Button
                    ================================================= */}

                    <div className="mt-6 flex gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/productDetails/${product._id}`,
                                    {
                                        state: {
                                            product,
                                        },
                                    }
                                )
                            }
                            disabled={
                                product.stock === 0
                            }
                            className="flex min-h-14 flex-1 items-center justify-center bg-ink px-4 py-4 text-lg font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-16 sm:text-xl md:py-6 md:text-2xl lg:py-7"
                        >
                            {product.stock === 0
                                ? "Out of Stock"
                                : "Get it"}
                        </button>

                    </div>

                    {/* Description */}

                    {product.description && (
                        <div className="mt-8 sm:mt-10">

                            <h2 className="text-base font-semibold sm:text-lg">
                                Description
                            </h2>

                            <p className="mt-2 text-sm leading-relaxed text-ink/60 sm:text-base">
                                {product.description}
                            </p>

                        </div>
                    )}

                </div>
            </div>
        </Container>
    );
}