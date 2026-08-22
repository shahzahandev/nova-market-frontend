import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Container from "../components/Container";
import ProductCard from "../components/ProductCard";
import { useScrollReveal } from "../hooks/useScrollReveal";
import axios from "axios";
import About from "../components/About";


const CATEGORY_IMAGES = {
  laptop: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&q=80",
  watch: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=400&q=80",
  earbuds: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&q=80",
  mobile: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80",
};
const FALLBACK_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1526406915894-7bcd65f60845?w=400&q=80";

function getCategoryImage(name) {
  const key = name?.toLowerCase().trim();
  return CATEGORY_IMAGES[key] || FALLBACK_CATEGORY_IMAGE;
}

export default function Home() {
  const [product, setProduct] = useState([]);
  const [categories, setCategories] = useState([]);
  const heroRef = useRef(null);
  const categoryRef = useScrollReveal();
  const productRef = useScrollReveal({ stagger: 0.06 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-eyebrow]", { opacity: 0, y: 14, duration: 0.5 })
        .from("[data-hero-word]", { opacity: 0, y: 40, stagger: 0.08, duration: 0.7 }, "-=0.2")
        .from("[data-hero-sub]", { opacity: 0, y: 16, duration: 0.6 }, "-=0.3")
        .from("[data-hero-cta]", { opacity: 0, y: 16, duration: 0.5 }, "-=0.4");
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // product
  useEffect(() => {
    try {
      async function getProduct() {
        let data = await axios.get(`http://localhost:3000/api/v1/product/allProduct`);
        setProduct(data.data.allProduct);
      }
      getProduct();
    } catch (error) {
      console.log(error);
    }
  }, []);

  // categories
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/product/allCategory"
        );
        const list = (response.data.allCategory || []).map(
          (category) => category.name
        );
        setCategories(list);
      } catch (error) {
        console.log(error);
      }
    };

    getCategories();
  }, []);

  return (
    <div>
      {/* Hero */}
      <section ref={heroRef} className="relative overflow-hidden bg-ink text-white">
        <Container className="grid items-center gap-10 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <p data-hero-eyebrow className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">
              New season, new drops
            </p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
              <span className="block overflow-hidden">
                <span data-hero-word className="block">Everyday gear,</span>
              </span>
              <span className="block overflow-hidden">
                <span data-hero-word className="block text-brand-400">designed with intent.</span>
              </span>
            </h1>
            <p data-hero-sub className="mt-6 max-w-md text-white/60">
              Curated tech and lifestyle products from makers who obsess over the details, so you don't have to.
            </p>
            <div data-hero-cta className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/products"
                className="flex h-12 items-center gap-2 rounded-full bg-brand-400 px-6 text-sm font-semibold text-ink transition hover:bg-brand-300"
              >
                Shop the collection <ArrowRight size={16} />
              </Link>
              <Link
                to="/products"
                className="flex h-12 items-center rounded-full border border-white/20 px-6 text-sm font-semibold text-white hover:bg-white/5"
              >
                Explore categories
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="relative aspect-square w-full max-w-sm rounded-3xl bg-gradient-to-br from-brand-500/30 to-transparent p-1">
              <div className="flex h-full w-full items-center justify-center rounded-[22px] bg-white/5">
                <span className="font-display text-sm text-white/30">Product shot</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Featured products */}
      <section className="py-16">
        <Container>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-600">Handpicked</p>
              <h2 className="mt-2 font-display text-2xl font-bold sm:text-3xl">Featured products</h2>
            </div>
            <Link to="/products" className="hidden text-sm font-semibold text-ink/70 hover:text-ink sm:block">
              View all →
            </Link>
          </div>

          <div ref={productRef} className="grid grid-cols-2 gap-0 sm:grid-cols-3 lg:grid-cols-4">
            {product.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </Container>
      </section>

    {/* categories */}
      <section className="py-16">
        <Container>
          <div
            ref={categoryRef}
            className="grid grid-cols-1 gap-6 sm:grid-cols-4"
          >
            {categories.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                data-reveal
                className="group overflow-hidden rounded-2xl bg-white shadow-sm"
              >
                {/* Category Name + View All */}
                <div className="flex flex-col items-center justify-center px-4 py-4 transition-colors duration-500 group-hover:bg-black/10">
                  <h3 className="font-display text-4xl font-bold capitalize text-gray-900 transition-colors duration-500">
                    {cat}
                  </h3>

                  <span className="mt-4 text-lg font-medium text-gray-600 transition-colors duration-500">
                    View All
                  </span>
                </div>

                {/* Category Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={getCategoryImage(cat)}
                    alt={cat}
                    className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-90"
                  />

                  {/* Red Overlay */}
                  <div className="absolute inset-0 bg-transparent transition-colors duration-500 group-hover:bg-black/10"></div>
                </div>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <About></About>
    </div>
  );
}

