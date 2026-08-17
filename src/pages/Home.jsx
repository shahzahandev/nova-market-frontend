import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ArrowRight } from "lucide-react";
import Container from "../components/Container";
import ProductCard from "../components/ProductCard";
import { useScrollReveal } from "../hooks/useScrollReveal";

const CATEGORIES = ["Audio", "Wearables", "Home", "Accessories"];

const FEATURED = [
  { _id: "1", title: "Aria Wireless Earbuds", price: 129, discountPrice: 99, images: [] },
  { _id: "2", title: "Pulse Fitness Band", price: 89, images: [] },
  { _id: "3", title: "Halo Desk Lamp", price: 59, discountPrice: 45, images: [] },
  { _id: "4", title: "Drift Travel Backpack", price: 149, images: [] },
];

export default function Home() {
  const heroRef = useRef(null);
  const categoryRef = useScrollReveal();
  const productRef = useScrollReveal({ stagger: 0.06 });

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-hero-eyebrow]", { opacity: 0, y: 14, duration: 0.5 })
        .from("[data-hero-word]", { opacity: 0, y: 40, stagger: 0.08, duration: 0.7 }, "-=0.2")
        .from("[data-hero-sub]", { opacity: 0, y: 16, duration: 0.6 }, "-=0.3")
        .from("[data-hero-cta]", { opacity: 0, y: 16, duration: 0.5 }, "-=0.4")
        .from(
          "[data-hero-badge]",
          { opacity: 0, scale: 0.85, y: 20, duration: 0.6, ease: "back.out(1.7)" },
          "-=0.5"
        );
    }, heroRef);
    return () => ctx.revert();
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

            <div
              data-hero-badge
              className="absolute -bottom-4 -left-4 rounded-2xl bg-white px-5 py-4 text-ink shadow-card"
            >
              <p className="text-[10px] font-medium uppercase tracking-wide text-ink/40">Offer ends in</p>
              <p className="font-mono text-lg font-bold text-brand-600">12:04:31</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="py-16">
        <Container>
          <div ref={categoryRef} className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat}
                to={`/products?category=${cat}`}
                data-reveal
                className="group flex aspect-[4/3] flex-col justify-end rounded-2xl bg-mist p-5 transition hover:bg-ink"
              >
                <span className="font-display text-lg font-semibold text-ink transition group-hover:text-white">
                  {cat}
                </span>
              </Link>
            ))}
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

          <div ref={productRef} className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {FEATURED.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA banner */}
      <section className="py-16">
        <Container>
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-mist px-8 py-16 text-center">
            <h2 className="max-w-xl font-display text-2xl font-bold sm:text-3xl">
              Get 10% off your first order
            </h2>
            <p className="max-w-md text-sm text-ink/60">
              Join our list for early access to drops, restocks, and members-only pricing.
            </p>
            <form className="flex w-full max-w-sm gap-2">
              <input
                type="email"
                placeholder="you@example.com"
                className="h-12 flex-1 rounded-full border border-ink/10 bg-white px-5 text-sm outline-none focus:border-brand-400"
              />
              <button className="h-12 shrink-0 rounded-full bg-ink px-6 text-sm font-semibold text-white hover:bg-ink/90">
                Subscribe
              </button>
            </form>
          </div>
        </Container>
      </section>
    </div>
  );
}
