import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { ShoppingBag, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import axios from "axios";
import Container from "../components/Container";
import { useCart } from "../context/CartContext";

const MAX_THUMBNAILS = 5;
// Backend origin — images come back as relative paths ("/upload/xyz.jpg"),
// so this gets prepended to build a loadable <img src>.
const API_ORIGIN = "http://localhost:3000";

function imageSrc(url) {
    if (!url) return "";

    return url.startsWith("http")
        ? url
        : `${API_ORIGIN}${url}`;
}

export default function ProductDetails() {
    const { id } = useParams();
    const location = useLocation();
    const { addToCart } = useCart();

    const [product, setProduct] = useState(location.state?.product || null);
    const [activeImage, setActiveImage] = useState(0);
    const [added, setAdded] = useState(false);

    useEffect(() => {
        if (product) return;
        async function getProduct() {
            try {
                let res = await axios.post(`http://localhost:3000/api/v1/product/singleProduct/${id}`);
                setProduct(res.data.data);
            } catch (error) {
                console.log(error);
            }
        }
        getProduct();
    }, [id, product]);




    // Set isMain image as active image
    useEffect(() => {
        if (!product?.images?.length) {
            setActiveImage(0);
            return;
        }

        const mainIndex = product.images.findIndex(
            (img) => img.isMain === true || img.isMain === "true"
        );

        setActiveImage(mainIndex >= 0 ? mainIndex : 0);
    }, [product]);


    if (!product) {
        return <p className="py-20 text-center text-sm text-ink/40">Loading...</p>;
    }

    const hasDiscount = product.discountPrice && product.discountPrice < product.price;
    const discountPercent =
        hasDiscount && product.price
            ? Math.round(100 - (product.discountPrice / product.price) * 100)
            : 0;

    const images = product.images?.length
        ? product.images
        : [];

    const visibleImages = images.slice(0, MAX_THUMBNAILS);

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1800);
    };

    return (
        <Container className="py-6 sm:py-8 md:py-10">
            <div className="grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12">

                <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-5">

                    {visibleImages.length > 1 && (
                        <div
                            className="order-2 flex w-full gap-3 overflow-x-auto pb-1 md:order-1 md:w-20 md:flex-col overflow-hidden md:pb-0"
                        >
                            {visibleImages.map((img, i) => (
                                <button
                                    key={img._id || i}
                                    type="button"
                                    onClick={() => setActiveImage(i)}
                                    aria-label={`View image ${i + 1}`}
                                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200 sm:h-18 sm:w-18 md:h-18 md:w-18
                                      ${activeImage === i ? "border-brand-400 scale-[1.02]"
                                            : "border-transparent hover:border-ink/15"
                                        }
                                      `}
                                >
                                    {img.url ? (
                                        <img
                                            src={imageSrc(img.url)}
                                            alt={`${product.title} ${i + 1}`}
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
                                    src={imageSrc(images[activeImage].url)}
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

                {/* Details */}
                <div>
                    <h1 className="mt-3 font-display text-3xl font-bold">
                        {product.title}: {product.shortDescription}
                    </h1>

                    <div className="mt-3 flex flex-wrap items-center gap-2">
                        {product.category && (
                            <span className="text-lg font-semibold capitalize text-ink/70">
                                {product.category?.name || product.category}
                            </span>
                        )}

                        {product.brand && (
                            <span className="text-lg font-semibold capitalize text-ink/70">
                                {product.brand}
                            </span>
                        )}
                    </div>

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
                                    ({product.reviewCount.toLocaleString()} reviews)
                                </span>
                            )}
                        </div>
                    )}

                    {product.shortDescription && (
                        <p className="mt-2 text-sm text-ink/60">
                            {product.shortDescription}
                        </p>
                    )}

                    <div className="mt-6 flex gap-3">
                        <button
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                            className="flex py-5 flex-1 items-center justify-center gap-2 bg-ink text-lg font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <ShoppingBag size={20} />
                            {added ? "Added to cart" : "Add to cart"}
                        </button>
                    </div>

                    {product.description && (
                        <div className="mt-6">
                            <h2 className="text-sm font-semibold">Description</h2>
                            <p className="mt-2 text-sm leading-relaxed text-ink/60">{product.description}</p>
                        </div>
                    )}

                    {product.additionalInfo && (
                        <div className="mt-6">
                            <h2 className="text-sm font-semibold">Additional Information</h2>
                            <p className="mt-2 text-sm leading-relaxed text-ink/60">{product.additionalInfo}</p>
                        </div>
                    )}

                    {/* Specifications */}
                    {product.specifications?.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-lg font-semibold">
                                Product Specifications
                            </h2>

                            <div className="mt-3 overflow-hidden rounded-xl border border-ink/10">
                                {product.specifications.map((spec, index) => (
                                    <div
                                        key={spec._id || index}
                                        className="grid grid-cols-2 border-b border-ink/10 last:border-b-0"
                                    >
                                        <div className="bg-mist px-4 py-3 text-sm font-semibold">
                                            {spec.name}
                                        </div>

                                        <div className="px-4 py-3 text-sm text-ink/60">
                                            {spec.value}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* About this item */}
                    {product.features?.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-lg font-semibold">About this item</h2>

                            <ul className="mt-3 space-y-2">
                                {product.features.map((feature, index) => (
                                    <li
                                        key={index}
                                        className="flex gap-2 text-sm leading-relaxed text-ink/60"
                                    >
                                        <span className="mt-1">•</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <div className="mt-8 grid grid-cols-3 gap-3 border-y border-ink/10 py-6 text-center text-xs text-ink/60">
                        <Feature icon={Truck} label="Fast delivery" />
                        <Feature icon={ShieldCheck} label="Secure payment" />
                        <Feature icon={RotateCcw} label="7-day returns" />
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
