import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ArrowRight, ChevronsRight } from "lucide-react";
import Container from "../components/Container";
import ProductCard from "../components/ProductCard";
import HeroSlider from "../components/HeroSlider";
import { useScrollReveal } from "../hooks/useScrollReveal";
import axios from "axios";
import About from "../components/About";
import Contact from "../components/Contact";
import NoticeBoard from "../components/NoticeBoard";

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";

const GET_HERO_SLIDER_URL = `${API_ORIGIN}/api/v1/banner/getHeroSlider`;

export default function Home() {
  const [product, setProduct] = useState([]);
  const [newPro, setNewPro] = useState([]);
  const [deals, setDeals] = useState([]);
  const [feature, setFeature] = useState([]);
  const [categories, setCategories] = useState([]);
  const heroRef = useRef(null);
  const categoryRef = useScrollReveal();
  const productRef = useScrollReveal({ stagger: 0.06, });

  // Banner images
  const [bannerImages, setBannerImages] = useState([]);

  // Fetch Banner
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const response = await axios.get(
          GET_HERO_SLIDER_URL
        );

        const images =
          response.data?.data?.images || [];

        const imageUrls = images
          .map((image) => {
            if (
              typeof image === "object" &&
              image?.url
            ) {
              return image.url;
            }

            // Legacy support
            if (
              typeof image === "string" &&
              image.startsWith("http")
            ) {
              return image;
            }

            // Legacy local image support
            if (typeof image === "string") {
              return `${API_ORIGIN}/upload/${image}`;
            }

            return null;
          })
          .filter(Boolean);

        setBannerImages(imageUrls);
      } catch (error) {
        console.error(
          "Banner fetch error:",
          error
        );

        setBannerImages([]);
      }
    };

    fetchBanner();
  }, []);

  // Hero GSAP animation
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: {
          ease: "power3.out",
        },
      });

      tl.from("[data-hero-eyebrow]", {
        opacity: 0,
        y: 14,
        duration: 0.5,
      })
        .from(
          "[data-hero-word]",
          {
            opacity: 0,
            y: 40,
            stagger: 0.08,
            duration: 0.7,
          },
          "-=0.2"
        )
        .from(
          "[data-hero-sub]",
          {
            opacity: 0,
            y: 16,
            duration: 0.6,
          },
          "-=0.3"
        )
        .from(
          "[data-hero-cta]",
          {
            opacity: 0,
            y: 16,
            duration: 0.5,
          },
          "-=0.4"
        );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  // Get Products
  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `${API_ORIGIN}/api/v1/product/allActiveProduct`
        );

        setProduct(
          response.data?.products || []
        );
      } catch (error) {
        console.error(
          "Product fetch error:",
          error
        );

        setProduct([]);
      }
    };

    getProduct();
  }, []);

  // Get new Products
  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `${API_ORIGIN}/api/v1/product/newProduct`
        );

        setNewPro(
          response.data?.products || []
        );
      } catch (error) {
        console.error(
          "Product fetch error:",
          error
        );

        setProduct([]);
      }
    };

    getProduct();
  }, []);

  // Get deals Products
  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `${API_ORIGIN}/api/v1/product/dealsProduct`
        );

        setDeals(
          response.data?.products || []
        );
      } catch (error) {
        console.error(
          "Product fetch error:",
          error
        );

        setProduct([]);
      }
    };

    getProduct();
  }, []);

  // Get feature Products
  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `${API_ORIGIN}/api/v1/product/featureProduct`
        );

        setFeature(
          response.data?.products || []
        );
      } catch (error) {
        console.error(
          "Product fetch error:",
          error
        );

        setProduct([]);
      }
    };

    getProduct();
  }, []);


  // Get Categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(
          `${API_ORIGIN}/api/v1/product/allCategory`
        );

        const list = (
          response.data?.allCategory || []
        )
          .map((category) => category.name)
          .filter(Boolean);

        setCategories(list);
      } catch (error) {
        console.error(
          "Category fetch error:",
          error
        );

        setCategories([]);
      }
    };

    getCategories();
  }, []);


  return (
    <div>
      {/* ======= HERO ========== */}
      <section
        ref={heroRef}
        className="relative overflow-hidden bg-ink text-white"
      >
        <Container className="grid items-center gap-8 py-6 sm:py-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-12 lg:py-6">
          <div>
            <p
              data-hero-eyebrow
              className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300"
            >
              New season, new drops
            </p>

            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              <span className="block overflow-hidden">
                <span data-hero-word className="block">
                  Everyday gear,
                </span>
              </span>

              <span className="block overflow-hidden">
                <span data-hero-word className="block text-brand-400">
                  designed with intent.
                </span>
              </span>
            </h1>

            <p data-hero-sub className="mt-6 max-w-md text-white/60">
              Curated tech and lifestyle products from makers who obsess over the
              details, so you don't have to.
            </p>

            <div data-hero-cta className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="flex h-12 items-center gap-2 rounded-full bg-brand-400 px-6 text-sm font-semibold text-ink transition hover:bg-brand-300"
              >
                Shop the collection
                <ArrowRight size={16} />
              </Link>

              <Link
                to="/products"
                className="flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white hover:bg-white/5"
              >
                Explore categories
              </Link>
            </div>
          </div>

          {/* ================= HERO SLIDER ================= */}
          <div className="flex w-full justify-center lg:justify-end">
            {bannerImages.length > 0 ? (
              <HeroSlider images={bannerImages} />
            ) : (
              <div className="flex aspect-video w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <p className="text-sm text-white/50">No banner images available</p>
              </div>
            )}
          </div>
        </Container>
      </section>
      
      {/* new */}
      <section className="py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600">
                Latest
              </p>

              <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                New Arrival Products
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden text-sm font-semibold text-ink/70 hover:text-ink sm:block"
            >
              View all →
            </Link>
          </div>

          {newPro && newPro.length > 0 ? (
            <div
              ref={productRef}
              className="grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-4"
            >
              {newPro.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-40 items-center justify-center rounded-lg ">
              <p className="text-sm font-medium text-gray-500 sm:text-base">
                No Available Product
              </p>
            </div>
          )}
        </Container>
      </section>
      {/* deals */}
      <section className="py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600">
                Deals
              </p>

              <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                Deals You’ll Love
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden text-sm font-semibold text-ink/70 hover:text-ink sm:block"
            >
              View all →
            </Link>
          </div>

          {deals && deals.length > 0 ? (
            <div
              ref={productRef}
              className="grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-4"
            >
              {deals.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-40 items-center justify-center rounded-lg">
              <p className="text-sm font-medium text-gray-500 sm:text-base">
                No Product Available
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* feature */}
      <section className="py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600">
                feature
              </p>

              <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                Everything You Need
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden text-sm font-semibold text-ink/70 hover:text-ink sm:block"
            >
              View all →
            </Link>
          </div>

          {feature && feature.length > 0 ? (
            <div
              ref={productRef}
              className="grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-4"
            >
              {feature.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-40 items-center justify-center rounded-lg">
              <p className="text-sm font-medium text-gray-500 sm:text-base">
                No Product Available
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* ========= All PRODUCTS ============= */}
      <section className="py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600">
                Handpicked
              </p>

              <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
                Our All Products
              </h2>
            </div>

            <Link
              to="/products"
              className="hidden text-sm font-semibold text-ink/70 hover:text-ink sm:block"
            >
              View all →
            </Link>
          </div>

          {product && product.length > 0 ? (
            <div
              ref={productRef}
              className="grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-4"
            >
              {product.map((p) => (
                <ProductCard
                  key={p._id}
                  product={p}
                />
              ))}
            </div>
          ) : (
            <div className="flex min-h-40 items-center justify-center">
              <p className="text-sm font-medium text-gray-500 sm:text-base">
                No Product Available
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* ========== CATEGORIES ============== */}
      <section className="py-16">
        <Container>
          <div className="mb-10">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600">
              Search by
            </p>

            <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">
              Categories products
            </h2>
          </div>
          <div
            ref={categoryRef}
            className="grid grid-cols-3 gap-2 sm:grid-cols-4"
          >
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                data-reveal
                className="group overflow-hidden rounded-lg bg-gray-100 shadow-sm"
              >
                <div className="flex flex-col items-center justify-center px-4 py-2 transition-colors duration-500 group-hover:bg-black/10">
                  <h3 className="font-display font-bold capitalize text-gray-900 transition-colors duration-500 text-[12px] md:text-lg">
                    {cat}
                  </h3>
                  <div className="group flex items-center text-slate-400 cursor-pointer">
                    <span className="text-[8px] md:text-sm font-medium text-gray-600 transition-colors duration-500">
                      View All
                    </span>

                    <ChevronsRight
                      size={10}
                      className="ml-1 transition-transform duration-300 group-hover:translate-x-1 md:ml-2 md:size-4"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* ============  ABOUT ================ */}
      <About />
      <Contact />

    </div>
  );
}