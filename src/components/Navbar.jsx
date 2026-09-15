import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import gsap from "gsap";
import {
  Search,
  ShoppingBag,
  Heart,
  ArrowLeftRight,
  User,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Mail,
  LogIn,
  Plus,
} from "lucide-react";

import Container from "./Container";
import { useCart } from "../context/CartContext";

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";

function imageSrc(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
}

export default function Navbar() {
  const [open, setOpen] = useState(false); // mobile drawer
  const [mobileTab, setMobileTab] = useState("categories"); // categories | menu | more
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const [scrolled, setScrolled] = useState(false);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState("");

  const [accountInfo, setAccountInfo] = useState(null);

  // Wishlist / Compare — wire these up to your real context when ready
  const wishlistCount = 0;
  const compareCount = 0;

  const { cartItems } = useCart();
  const navigate = useNavigate();

  // =========================
  // REFS for GSAP
  // =========================
  const topBarRef = useRef(null);
  const topBarHeightRef = useRef(0);

  const categoryRowRef = useRef(null);
  const categoryRowHeightRef = useRef(0);

  const categoryScrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const mobileDefaultRef = useRef(null);
  const mobileSearchRowRef = useRef(null);

  const drawerRef = useRef(null);
  const overlayRef = useRef(null);

  // Prevents the scroll listener from re-triggering a toggle
  // while the collapse/expand animation is still mid-flight —
  // this is what stops the header from flickering open/closed.
  const scrollLockRef = useRef(false);

  // =========================
  // MEASURE COLLAPSIBLE HEIGHTS ONCE
  // =========================
  useEffect(() => {
    if (topBarRef.current) {
      topBarHeightRef.current = topBarRef.current.scrollHeight;
    }
    if (categoryRowRef.current) {
      categoryRowHeightRef.current = categoryRowRef.current.scrollHeight;
    }
  }, [categories]);

  // =========================
  // SCROLL LISTENER — hysteresis based, no flicker/loop
  // =========================
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (ticking || scrollLockRef.current) return;
      ticking = true;

      requestAnimationFrame(() => {
        const y = window.scrollY;

        setScrolled((prev) => {
          // Hysteresis: two different thresholds for collapsing vs
          // expanding, with a wide buffer between them. This stops
          // the header from flapping open/closed when scrollY hovers
          // near a single value (trackpad bounce, tiny layout shifts
          // from the header's own collapse animation, etc).
          if (prev) return y > 24; // stays collapsed until near the very top
          return y > 80; // only collapses once scrolled meaningfully down
        });

        ticking = false;
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // Lock scroll-driven toggles until this transition fully completes,
    // so a mid-animation layout shift can't immediately re-trigger it.
    scrollLockRef.current = true;

    const unlock = () => {
      scrollLockRef.current = false;
    };

    if (topBarRef.current) {
      gsap.to(topBarRef.current, {
        height: scrolled ? 0 : topBarHeightRef.current || "auto",
        opacity: scrolled ? 0 : 1,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    }

    if (categoryRowRef.current) {
      gsap.to(categoryRowRef.current, {
        height: scrolled ? 0 : categoryRowHeightRef.current || "auto",
        opacity: scrolled ? 0 : 1,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
        onComplete: unlock,
      });
    } else {
      unlock();
    }
  }, [scrolled]);

  // =========================
  // GET LOGGED IN USER
  // =========================
  useEffect(() => {
    const updateUser = () => {
      try {
        const storedUser = localStorage.getItem("account");
        if (storedUser) {
          setAccountInfo(JSON.parse(storedUser));
        } else {
          setAccountInfo(null);
        }
      } catch (error) {
        console.error("Failed to read account:", error);
        setAccountInfo(null);
      }
    };

    updateUser();

    window.addEventListener("login", updateUser);
    window.addEventListener("logout", updateUser);
    window.addEventListener("profileUpdated", updateUser);

    return () => {
      window.removeEventListener("login", updateUser);
      window.removeEventListener("logout", updateUser);
      window.removeEventListener("profileUpdated", updateUser);
    };
  }, []);

  // =========================
  // GET CATEGORIES
  // =========================
  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(`${API_ORIGIN}/api/v1/product/allCategory`);
        const data = await response.json();
        setCategories(data.allCategory || []);
      } catch (error) {
        console.log("Category fetch error:", error);
      }
    };

    getCategories();
  }, []);

  // =========================
  // GET PRODUCTS
  // =========================
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await fetch(`${API_ORIGIN}/api/v1/product/allProduct`);
        const data = await response.json();
        setProducts(data.allProduct || []);
      } catch (error) {
        console.log("Product fetch error:", error);
      }
    };

    getProducts();
  }, []);

  // =========================
  // CATEGORY ROW SCROLL ARROWS
  // =========================
  const updateScrollButtons = () => {
    const el = categoryScrollRef.current;
    if (!el) return;

    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    updateScrollButtons();

    const el = categoryScrollRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateScrollButtons, { passive: true });
    window.addEventListener("resize", updateScrollButtons);

    return () => {
      el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [categories]);

  const scrollCategories = (direction) => {
    const el = categoryScrollRef.current;
    if (!el) return;

    el.scrollBy({ left: direction * 240, behavior: "smooth" });
  };

  // =========================
  // SEARCH
  // =========================
  const submitSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
    setOpen(false);
    closeMobileSearch();
  };

  const normalizedQuery = query.trim().toLowerCase();

  const searchResults = normalizedQuery
    ? products
        .filter((product) => product.title?.toLowerCase().includes(normalizedQuery))
        .sort((a, b) => {
          const aStarts = a.title.toLowerCase().startsWith(normalizedQuery);
          const bStarts = b.title.toLowerCase().startsWith(normalizedQuery);
          if (aStarts && !bStarts) return -1;
          if (!aStarts && bStarts) return 1;
          return 0;
        })
        .slice(0, 6)
    : [];

  const closeSearch = () => setQuery("");

  // =========================
  // MOBILE SEARCH TOGGLE (GSAP)
  // =========================
  const openMobileSearch = () => {
    setMobileSearchOpen(true);

    requestAnimationFrame(() => {
      gsap.set(mobileSearchRowRef.current, { display: "flex" });

      gsap.timeline()
        .to(mobileDefaultRef.current, {
          opacity: 0,
          x: -16,
          duration: 0.2,
          ease: "power1.out",
          onComplete: () => {
            gsap.set(mobileDefaultRef.current, { display: "none" });
          },
        })
        .fromTo(
          mobileSearchRowRef.current,
          { opacity: 0, x: 16 },
          { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" }
        );
    });
  };

  const closeMobileSearch = () => {
    if (!mobileSearchOpen) return;

    gsap.timeline()
      .to(mobileSearchRowRef.current, {
        opacity: 0,
        x: 16,
        duration: 0.2,
        ease: "power1.out",
        onComplete: () => {
          gsap.set(mobileSearchRowRef.current, { display: "none" });
          setMobileSearchOpen(false);
          setQuery("");
        },
      })
      .fromTo(
        mobileDefaultRef.current,
        { opacity: 0, x: -16, display: "flex" },
        { opacity: 1, x: 0, duration: 0.25, ease: "power2.out" }
      );
  };

  // =========================
  // MOBILE DRAWER (GSAP)
  // =========================
  useEffect(() => {
    if (!drawerRef.current || !overlayRef.current) return;

    if (open) {
      gsap.set(drawerRef.current, { display: "flex" });
      gsap.set(overlayRef.current, { display: "block" });

      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: "power1.out" }
      );

      gsap.fromTo(
        drawerRef.current,
        { x: "-100%" },
        { x: "0%", duration: 0.3, ease: "power3.out" }
      );
    } else if (drawerRef.current._wasOpen) {
      gsap.to(drawerRef.current, {
        x: "-100%",
        duration: 0.25,
        ease: "power2.in",
        onComplete: () => gsap.set(drawerRef.current, { display: "none" }),
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.25,
        onComplete: () => gsap.set(overlayRef.current, { display: "none" }),
      });
    }

    if (drawerRef.current) drawerRef.current._wasOpen = open;
  }, [open]);

  const closeDrawer = () => {
    setOpen(false);
    setMobileTab("categories");
  };

  const goToCategory = (categoryName) => {
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
    closeDrawer();
  };

  const searchPopup = normalizedQuery && (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[420px] overflow-y-auto rounded-2xl border border-ink/10 bg-white shadow-2xl">
      {searchResults.length === 0 ? (
        <div className="px-4 py-6 text-center text-sm text-ink/50">
          No products found for{" "}
          <span className="font-semibold text-ink/70">"{query.trim()}"</span>
        </div>
      ) : (
        <div className="divide-y divide-ink/5">
          {searchResults.map((product) => {
            const mainImage =
              product.images?.find(
                (image) => image.isMain === true || image.isMain === "true"
              ) || product.images?.[0];

            const now = new Date();
            const hasDiscount =
              product.discountPrice &&
              product.discountPrice < product.price &&
              product.discountStartDate &&
              product.discountEndDate &&
              new Date(product.discountStartDate) <= now &&
              new Date(product.discountEndDate) >= now;

            return (
              <Link
                key={product._id}
                to={`/products/${product._id}`}
                onClick={() => {
                  closeSearch();
                  closeMobileSearch();
                }}
                className="flex items-center gap-3 px-4 py-3 transition hover:bg-mist"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-mist">
                  {mainImage?.url ? (
                    <img
                      src={imageSrc(mainImage.url)}
                      alt={product.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-ink/30">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="line-clamp-1 text-sm font-semibold text-ink">
                    {product.title}
                  </p>
                  <div className="mt-0.5">
                    {hasDiscount ? (
                      <span className="text-sm font-bold">৳{product.discountPrice}</span>
                    ) : (
                      <span className="text-sm font-bold">৳{product.price}</span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => {
              navigate(`/products?q=${encodeURIComponent(query.trim())}`);
              closeSearch();
              closeMobileSearch();
            }}
            className="w-full px-4 py-3 text-center text-sm font-semibold text-ink/70 hover:bg-mist hover:text-ink"
          >
            View all results →
          </button>
        </div>
      )}
    </div>
  );

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur">
      {/* ============ DESKTOP ============ */}
      <div className="hidden md:block">
        {/* TOP UTILITY BAR — GSAP collapses on scroll */}
        <div ref={topBarRef} className="overflow-hidden border-b border-ink/5">
          <Container className="flex h-10 items-center justify-between text-xs text-ink/60">
            <span className="font-medium">Connecting Home...</span>

            <div className="flex items-center gap-5">
              
             <a   href="mailto:support@novamarket.com"
                className="flex items-center gap-1.5 hover:text-ink"
              >
                <Mail size={13} />
                Contact
              </a>

              <Link
                to={accountInfo ? "/profile" : "/signin"}
                className="flex items-center gap-1.5 hover:text-ink"
              >
                <LogIn size={13} />
                {accountInfo ? accountInfo.name : "Login / Register"}
              </Link>
            </div>
          </Container>
        </div>

        {/* SEARCH ROW */}
        <Container className="py-4">
          <div className="flex items-center justify-between gap-6">
            <Link to="/" className="shrink-0 font-display text-2xl font-bold tracking-tight">
              Nova<span className="text-brand-500">Market</span>
            </Link>

            <div className="relative max-w-xl flex-1">
              <form
                onSubmit={submitSearch}
                className="flex items-stretch overflow-hidden rounded-lg border border-ink/10 bg-mist"
              >
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for products"
                  className="w-full bg-transparent px-5 py-2.5 text-sm outline-none placeholder:text-ink/40"
                />

                <button
                  type="submit"
                  className="flex shrink-0 items-center justify-center bg-brand-600 px-5 text-white transition hover:bg-brand-700"
                >
                  <Search size={18} />
                </button>
              </form>

              {searchPopup}
            </div>

            <div className="flex shrink-0 items-center gap-5">
              <Link to="/wishlist" className="relative text-ink/70 hover:text-ink">
                <Heart size={20} />
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                  {wishlistCount}
                </span>
              </Link>

              <Link to="/cart" className="relative text-ink/70 hover:text-ink">
                <ShoppingBag size={20} />
                {cartItems.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </Container>

        {/* CATEGORY ROW — GSAP collapses on scroll */}
        <div ref={categoryRowRef} className="overflow-hidden border-t border-ink/5">
          <Container className="flex items-center gap-4 py-1">
            <button
              type="button"
              className="flex shrink-0 items-center gap-2 bg-brand-700 px-5 py-3.5 text-sm font-semibold rounded-lg text-white bg-brand-600"
            >
              ALL CATEGORIES
            </button>

            {canScrollLeft && (
              <button
                type="button"
                onClick={() => scrollCategories(-1)}
                className="shrink-0 rounded-full border border-ink/10 p-1.5 text-ink/50 hover:text-ink"
                aria-label="Scroll categories left"
              >
                <ChevronLeft size={16} />
              </button>
            )}

            <div
              ref={categoryScrollRef}
              className="flex min-w-0 flex-1 items-center gap-7 overflow-x-auto py-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {categories.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => goToCategory(category.name)}
                  className="flex shrink-0 items-center gap-1 whitespace-nowrap text-sm font-medium capitalize text-ink/70 transition hover:text-brand-600"
                >
                  {category.name}
                  <ChevronDown size={14} />
                </button>
              ))}
            </div>

            {canScrollRight && (
              <button
                type="button"
                onClick={() => scrollCategories(1)}
                className="shrink-0 rounded-full bg-brand-600 p-1.5 text-white hover:bg-brand-700"
                aria-label="Scroll categories right"
              >
                <ChevronRight size={16} />
              </button>
            )}
          </Container>
        </div>
      </div>

      {/* ============ MOBILE ============ */}
      <div className="relative md:hidden">
        {/* DEFAULT ROW */}
        <div ref={mobileDefaultRef} className="flex h-16 items-center justify-between px-4">
          <button type="button" onClick={() => setOpen(true)} aria-label="Menu">
            <Menu size={22} />
          </button>

          <Link to="/" className="font-display text-lg font-bold tracking-tight">
            Nova<span className="text-brand-500">Market</span>
          </Link>

          <button type="button" onClick={openMobileSearch} aria-label="Search">
            <Search size={20} />
          </button>
        </div>

        {/* SEARCH ROW — hidden by default, GSAP toggles it */}
        <div
          ref={mobileSearchRowRef}
          className="absolute inset-0 hidden h-16 items-center gap-3 bg-paper px-4"
        >
          <button type="button" onClick={closeMobileSearch} aria-label="Back">
            <ArrowLeft size={20} />
          </button>

          <form onSubmit={submitSearch} className="relative flex-1">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for products"
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
              autoFocus={mobileSearchOpen}
            />

            {searchPopup}
          </form>

          <button type="submit" onClick={submitSearch} aria-label="Search">
            <Search size={20} />
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[60] hidden bg-black/40 backdrop-blur-sm"
        onClick={closeDrawer}
      />

      <div
        ref={drawerRef}
        className="fixed left-0 top-0 z-[99] hidden h-[600px] w-[85%] flex-col bg-white shadow-2xl"
      >
        <div className="flex items-center border-b border-ink/10 bg-brand-100 mt-2">
          <button
            type="button"
            onClick={() => setMobileTab("categories")}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              mobileTab === "categories" ? "bg-brand-500 text-ink rounded-lg" : "text-ink/50"
            }`}
          >
            Categories
          </button>

          <button
            type="button"
            onClick={() => setMobileTab("menu")}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              mobileTab === "menu" ? "bg-brand-500 text-ink rounded-lg" : "text-ink/50"
            }`}
          >
            Menu
          </button>

          <button
            type="button"
            onClick={() => setMobileTab("more")}
            className={`flex-1 py-2 text-sm font-semibold transition ${
              mobileTab === "more" ? "bg-brand-500 text-ink rounded-lg" : "text-ink/50"
            }`}
          >
            More
          </button>

          <button
            type="button"
            onClick={closeDrawer}
            className="p-2 text-ink/50 hover:text-ink absolute right-[-27px] top-1.3 bg-white border-[4px] border-black/40 rounded-full"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {mobileTab === "categories" && (
            <div className="flex flex-col">
              {categories.map((category) => (
                <button
                  key={category._id}
                  type="button"
                  onClick={() => goToCategory(category.name)}
                  className="flex items-center justify-between border-b border-ink/5 py-3 text-left text-sm capitalize text-ink/80 hover:text-ink"
                >
                  {category.name}
                  <ChevronRight size={16} className="text-ink/30" />
                </button>
              ))}

              <button
                type="button"
                onClick={() => {
                  navigate("/products");
                  closeDrawer();
                }}
                className="mt-3 flex items-center gap-2 text-sm font-semibold text-ink"
              >
                <Plus size={14} />
                All Categories
              </button>
            </div>
          )}

          {mobileTab === "menu" && (
            <div className="flex flex-col gap-1">
              <Link to="/about" onClick={closeDrawer} className="border-b border-ink/5 py-3 text-sm text-ink/80 hover:text-ink">
                About
              </Link>
              <Link to="/products" onClick={closeDrawer} className="border-b border-ink/5 py-3 text-sm text-ink/80 hover:text-ink">
                Shop
              </Link>
              <Link to="/blog" onClick={closeDrawer} className="border-b border-ink/5 py-3 text-sm text-ink/80 hover:text-ink">
                Blog
              </Link>
              <Link to="/contact" onClick={closeDrawer} className="py-3 text-sm text-ink/80 hover:text-ink">
                Contact
              </Link>
            </div>
          )}

          {mobileTab === "more" && (
            <div className="flex flex-col gap-6">
              <Link to="/wishlist" onClick={closeDrawer} className="flex items-center gap-2 text-sm text-ink/80 hover:text-ink">
                <Heart size={16} />
                Wishlist
                {wishlistCount > 0 && (
                  <span className="ml-auto rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link to="/cart" onClick={closeDrawer} className="flex items-center gap-2 text-sm text-ink/80 hover:text-ink">
                <ShoppingBag size={16} />
                Cart
                {cartItems.length > 0 && (
                  <span className="ml-auto rounded-full bg-brand-500 px-2 py-0.5 text-[10px] font-bold text-white">
                    {cartItems.length}
                  </span>
                )}
              </Link>

              <Link to={accountInfo ? "/profile" : "/signin"} onClick={closeDrawer} className="flex items-center gap-2 text-sm text-ink/80 hover:text-ink">
                <User size={16} />
                {accountInfo ? accountInfo.name : "Login / Register"}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}