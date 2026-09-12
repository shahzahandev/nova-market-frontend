import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

import Container from "./Container";
import { useCart } from "../context/CartContext";

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";

function imageSrc(url) {
  if (!url) return "";

  return url.startsWith("http")
    ? url
    : `${API_ORIGIN}${url}`;
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] =
    useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [categories, setCategories] =
    useState([]);

  const [products, setProducts] =
    useState([]);

  const [query, setQuery] = useState("");

  // Logged in user
  const [accountInfo, setAccountInfo] =
    useState(null);

  const { cartItems } = useCart();
  const navigate = useNavigate();

  // =========================
  // GET LOGGED IN USER
  // =========================

  useEffect(() => {
    const updateUser = () => {
      try {
        const storedUser =
          localStorage.getItem("account");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);

          setAccountInfo(parsedUser);
        } else {
          setAccountInfo(null);
        }
      } catch (error) {
        console.error(
          "Failed to read account:",
          error
        );

        setAccountInfo(null);
      }
    };

    // Load user on first render
    updateUser();

    // Listen for login
    window.addEventListener(
      "login",
      updateUser
    );

    // Listen for logout
    window.addEventListener(
      "logout",
      updateUser
    );

    // Listen for profile update
    window.addEventListener(
      "profileUpdated",
      updateUser
    );



    return () => {
      window.removeEventListener(
        "login",
        updateUser
      );

      window.removeEventListener(
        "logout",
        updateUser
      );

      window.removeEventListener(
        "profileUpdated",
        updateUser
      );
    };


  }, []);

  // =========================
  // GET CATEGORIES
  // =========================

  useEffect(() => {
    const getCategories = async () => {
      try {
        const response = await fetch(
          `${API_ORIGIN}/api/v1/product/allCategory`
        );

        const data =
          await response.json();

        setCategories(
          data.allCategory || []
        );
      } catch (error) {
        console.log(
          "Category fetch error:",
          error
        );
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
        const response = await fetch(
          `${API_ORIGIN}/api/v1/product/allProduct`
        );


        const data = await response.json();
        setProducts(
          data.allProduct || []
        );
      } catch (error) {
        console.log(
          "Product fetch error:",
          error
        );
      }
    };

    getProducts();


  }, []);

  // =========================
  // SEARCH
  // =========================

  const submitSearch = (e) => {
    e.preventDefault();

    if (!query.trim()) return;

    navigate(
      `/products?q=${encodeURIComponent(
        query.trim()
      )}`
    );

    setQuery("");
    setOpen(false);


  };

  // =========================
  // LIVE SEARCH RESULTS
  // title er sathe match kore filter, query khali thakle result thakbe na
  // =========================

  const normalizedQuery = query.trim().toLowerCase();

  const searchResults = normalizedQuery
    ? products
      .filter((product) =>
        product.title
          ?.toLowerCase()
          .includes(normalizedQuery)
      )
      .sort((a, b) => {
        // title er suru theke match kora product age dekhabe
        const aStarts = a.title
          .toLowerCase()
          .startsWith(normalizedQuery);

        const bStarts = b.title
          .toLowerCase()
          .startsWith(normalizedQuery);

        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;

        return 0;
      })
      .slice(0, 6)
    : [];

  const closeSearch = () => {
    setQuery("");
  };

  // =========================
  // CATEGORY CLICK
  // =========================

  const handleCategoryClick = (
    categoryName
  ) => {
    setSelectedCategory(categoryName);
  };

  // =========================
  // CLOSE CATEGORY MENU
  // =========================

  const closeCategoryMenu = () => {
    setCategoryOpen(false);
    setSelectedCategory("");
  };

  // =========================
  // CATEGORY PRODUCTS
  // =========================

  const categoryProducts =
    products.filter((product) => {
      if (!selectedCategory) {
        return false;
      }


      return (
        product.category
          ?.toLowerCase()
          .trim() ===
        selectedCategory
          .toLowerCase()
          .trim()
      );
    });


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

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-paper/90 backdrop-blur">

      {/* MAIN NAVBAR */}

      <Container className="flex h-20 items-center justify-between gap-6">

        {/* LOGO */}

        <Link
          to="/"
          className="shrink-0 font-display text-xl font-bold tracking-tight"
        >
          Nova
          <span className="text-brand-500">
            Market
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}

        <nav className="hidden items-center gap-8 lg:flex">

          {/* SHOP */}

          <Link
            to="/products"
            className="text-sm font-medium text-ink/70 transition hover:text-ink"
          >
            Shop
          </Link>

          {/* CATEGORIES */}

          <div className="relative">

            <button
              type="button"
              onClick={() => {
                setCategoryOpen(
                  (prev) => !prev
                );

                if (categoryOpen) {
                  setSelectedCategory("");
                }
              }}
              className="flex items-center gap-1 text-sm font-medium text-ink/70 transition hover:text-ink"
            >
              Categories

              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${categoryOpen
                    ? "rotate-180"
                    : ""
                  }`}
              />
            </button>

            {/* CATEGORY POPUP */}

            {categoryOpen && (
              <div
                className="
              absolute
              left-[220px]
              top-full
              z-50
              mt-5
              w-[850px]
              max-w-[calc(100vw-32px)]
              -translate-x-1/2
              overflow-hidden
              rounded-2xl
              border
              border-ink/10
              bg-white
              shadow-2xl
            "
              >
                <div className="flex min-h-[400px]">

                  {/* CATEGORY LIST */}

                  <div className="w-48 shrink-0 border-r border-ink/10 bg-gray-50 p-5">

                    <h3 className="mb-5 font-display text-xl font-bold">
                      Categories
                    </h3>

                    <div className="space-y-1">

                      {categories.map(
                        (category) => {
                          const categoryName =
                            category.name;

                          return (
                            <button
                              key={category._id}
                              type="button"
                              onClick={() =>
                                handleCategoryClick(
                                  categoryName
                                )
                              }
                              className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm capitalize transition ${selectedCategory
                                  .toLowerCase() ===
                                  categoryName
                                    .toLowerCase()
                                  ? "bg-black text-white"
                                  : "text-ink/70 hover:bg-white hover:text-ink"
                                }`}
                            >
                              <span>
                                {categoryName}
                              </span>

                              <span>›</span>
                            </button>
                          );
                        }
                      )}

                    </div>
                  </div>

                  {/* PRODUCTS AREA */}

                  <div className="flex-1 p-6">

                    {!selectedCategory ? (
                      <div className="flex h-full items-center justify-center">

                        <div className="text-center">

                          <h3 className="font-display text-2xl font-bold">
                            Choose a category
                          </h3>

                          <p className="mt-2 text-sm text-ink/50">
                            Select a category to see
                            products
                          </p>

                        </div>
                      </div>

                    ) : categoryProducts.length === 0 ? (

                      <div className="flex h-full items-center justify-center">

                        <div className="text-center">

                          <h3 className="font-display text-xl font-bold">
                            No products found
                          </h3>

                          <p className="mt-2 text-sm text-ink/50">
                            No products available in{" "}

                            <span className="font-semibold capitalize">
                              {selectedCategory}
                            </span>
                          </p>

                        </div>
                      </div>

                    ) : (

                      <div>

                        {/* CATEGORY HEADER */}

                        <div className="mb-5 flex items-center justify-between">

                          <div>

                            <p className="text-xs uppercase tracking-[0.2em] text-brand-600">
                              Category
                            </p>

                            <h3 className="mt-1 font-display text-2xl font-bold capitalize">
                              {selectedCategory}
                            </h3>

                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              navigate(
                                `/products?category=${encodeURIComponent(
                                  selectedCategory
                                )}`
                              );

                              closeCategoryMenu();
                            }}
                            className="text-sm font-semibold text-ink/60 hover:text-ink"
                          >
                            View all →
                          </button>

                        </div>

                        {/* PRODUCT GRID */}

                        <div className="grid grid-cols-4 gap-4">

                          {categoryProducts
                            .slice(0, 4)
                            .map((product) => {

                              const mainImage =
                                product.images?.find(
                                  (image) =>
                                    image.isMain ===
                                    true ||
                                    image.isMain ===
                                    "true"
                                ) ||
                                product.images?.[0];


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

                              return (
                                <Link
                                  key={product._id}
                                  to={`/products/${product._id}`}
                                  onClick={
                                    closeCategoryMenu
                                  }
                                  className="group overflow-hidden border border-ink/10 bg-white transition duration-300"
                                >

                                  {/* IMAGE */}

                                  <div className="relative aspect-square overflow-hidden bg-mist">

                                    {mainImage?.url ? (
                                      <img
                                        src={imageSrc(
                                          mainImage.url
                                        )}
                                        alt={
                                          product.title
                                        }
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                      />
                                    ) : (
                                      <div className="flex h-full items-center justify-center text-xs text-ink/30">
                                        No image
                                      </div>
                                    )}

                                    {/* DISCOUNT */}

                                    {hasDiscount && (
                                      <span className="absolute left-2 top-2 rounded-full bg-amber-400 px-2 py-1 text-[10px] font-bold text-ink">
                                        -
                                        {
                                          discountPercent
                                        }
                                        %
                                      </span>
                                    )}

                                  </div>

                                  {/* PRODUCT INFO */}

                                  <div className="p-3">

                                    <h4 className="mt-1 line-clamp-1 text-sm font-semibold">
                                      {product.title}
                                    </h4>

                                    <div className="mt-1">

                                      {hasDiscount ? (
                                        <span className="text-sm font-bold">
                                          ৳
                                          {
                                            product.discountPrice
                                          }
                                        </span>
                                      ) : (
                                        <span className="text-sm font-bold">
                                          ৳
                                          {product.price}
                                        </span>
                                      )}

                                    </div>
                                  </div>

                                </Link>
                              );
                            })}

                        </div>

                        {/* MORE PRODUCTS */}

                        {categoryProducts.length >
                          4 && (
                            <button
                              type="button"
                              onClick={() => {
                                navigate(
                                  `/products?category=${encodeURIComponent(
                                    selectedCategory
                                  )}`
                                );

                                closeCategoryMenu();
                              }}
                              className="mt-5 w-full rounded-lg border border-ink/10 py-2.5 text-sm font-semibold transition hover:bg-mist"
                            >
                              View all{" "}
                              {
                                categoryProducts.length
                              }{" "}
                              products →
                            </button>
                          )}

                      </div>
                    )}

                  </div>
                </div>
              </div>
            )}

          </div>
        </nav>

        {/* SEARCH */}

        <div className="relative hidden max-w-sm flex-1 md:block">

          <form
            onSubmit={submitSearch}
            className="flex items-center gap-2 rounded-full border border-ink/10 bg-mist px-4 py-2.5"
          >

            <Search
              size={16}
              className="shrink-0 text-ink/40"
            />

            <input
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              placeholder="Search products..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
            />

          </form>

          {/* LIVE SEARCH POPUP — query thakle dekhabe, khali korle nijei chole jabe */}

          {normalizedQuery && (
            <div
              className="
            absolute
            left-0
            right-0
            top-full
            z-50
            mt-2
            max-h-[420px]
            overflow-y-auto
            rounded-2xl
            border
            border-ink/10
            bg-white
            shadow-2xl
          "
            >
              {searchResults.length === 0 ? (

                <div className="px-4 py-6 text-center text-sm text-ink/50">
                  No products found for{" "}
                  <span className="font-semibold text-ink/70">
                    "{query.trim()}"
                  </span>
                </div>

              ) : (

                <div className="divide-y divide-ink/5">

                  {searchResults.map((product) => {

                    const mainImage =
                      product.images?.find(
                        (image) =>
                          image.isMain === true ||
                          image.isMain === "true"
                      ) || product.images?.[0];

                    const now = new Date();

                    const hasDiscount =
                      product.discountPrice &&
                      product.discountPrice <
                      product.price &&
                      product.discountStartDate &&
                      product.discountEndDate &&
                      new Date(
                        product.discountStartDate
                      ) <= now &&
                      new Date(
                        product.discountEndDate
                      ) >= now;

                    return (
                      <Link
                        key={product._id}
                        to={`/products/${product._id}`}
                        onClick={closeSearch}
                        className="flex items-center gap-3 px-4 py-3 transition hover:bg-mist"
                      >

                        {/* IMAGE */}

                        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-mist">

                          {mainImage?.url ? (
                            <img
                              src={imageSrc(
                                mainImage.url
                              )}
                              alt={product.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-[10px] text-ink/30">
                              No image
                            </div>
                          )}

                        </div>

                        {/* INFO */}

                        <div className="min-w-0 flex-1">

                          <p className="line-clamp-1 text-sm font-semibold text-ink">
                            {product.title}
                          </p>

                          <div className="mt-0.5">

                            {hasDiscount ? (
                              <span className="text-sm font-bold">
                                ৳{product.discountPrice}
                              </span>
                            ) : (
                              <span className="text-sm font-bold">
                                ৳{product.price}
                              </span>
                            )}

                          </div>
                        </div>

                      </Link>
                    );
                  })}

                  {/* VIEW ALL RESULTS */}

                  <button
                    type="button"
                    onClick={() => {
                      navigate(
                        `/products?q=${encodeURIComponent(
                          query.trim()
                        )}`
                      );

                      closeSearch();
                    }}
                    className="w-full px-4 py-3 text-center text-sm font-semibold text-ink/70 hover:bg-mist hover:text-ink"
                  >
                    View all results →
                  </button>

                </div>
              )}
            </div>
          )}

        </div>

        {/* RIGHT SIDE */}

        <div className="flex items-center gap-4">

          {/* USER */}

          <Link
            to={
              accountInfo
                ? "/profile"
                : "/signin"
            }
            className="hidden items-center gap-2 text-sm font-medium text-ink/80 hover:text-ink sm:flex"
          >
            <User size={18} />

            <span>
              {accountInfo?.name ||
                "Sign in"}
            </span>
          </Link>

          {/* CART */}

          <Link
            to="/cart"
            className="relative"
          >
            <ShoppingBag size={20} />

            {cartItems.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* MOBILE MENU */}

          <button
            type="button"
            className="lg:hidden"
            onClick={() =>
              setOpen((prev) => !prev)
            }
            aria-label="Menu"
          >
            {open ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>

        </div>
      </Container>

      {/* MOBILE MENU */}

      {open && (
        <div className="border-t border-ink/5 bg-paper px-4 py-4 lg:hidden">

          <div className="flex flex-col gap-4">

            {/* SHOP */}

            <Link
              to="/products"
              onClick={() =>
                setOpen(false)
              }
              className="text-sm font-medium"
            >
              Shop
            </Link>

            {/* CATEGORIES */}

            <div>

              <button
                type="button"
                onClick={() =>
                  setCategoryOpen(
                    (prev) => !prev
                  )
                }
                className="flex w-full items-center justify-between text-left text-sm font-medium"
              >
                Categories

                <ChevronDown
                  size={16}
                  className={`transition-transform ${categoryOpen
                      ? "rotate-180"
                      : ""
                    }`}
                />
              </button>

              {categoryOpen && (
                <div className="mt-3 rounded-xl bg-mist p-3">
                  <div className="flex flex-col gap-1">
                    {categories.map(
                      (category) => (
                        <button
                          key={category._id}
                          type="button"
                          onClick={() => {
                            navigate(
                              `/products?category=${encodeURIComponent(
                                category.name
                              )}`
                            );

                            setOpen(false);
                            setCategoryOpen(false);
                          }}
                          className="rounded-lg px-3 py-2 text-left text-sm capitalize text-ink/70 transition hover:bg-white hover:text-ink"
                        >
                          {category.name}
                        </button>
                      )
                    )}

                  </div>
                </div>
              )}

            </div>

            {/* ACCOUNT */}

            <Link
              to={
                accountInfo
                  ? "/profile"
                  : "/signin"
              }
              onClick={() =>
                setOpen(false)
              }
              className="text-sm font-medium"
            >
              {accountInfo
                ? <div className="font-extrabold flex gap-1">
                  <User size={18} />
                  {accountInfo.name}
                </div>
                : "Sign in"}
            </Link>

          </div>
        </div>
      )}

    </header>
  );
}
