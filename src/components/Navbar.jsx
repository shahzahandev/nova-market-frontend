import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";
import Container from "./Container";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const LINKS = [
  { label: "Shop", to: "/products" },
  { label: "Categories", to: "/products" }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { userInfo } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/products?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-paper/90 backdrop-blur">
      <Container className="flex h-20 items-center justify-between gap-6">
        <Link to="/" className="shrink-0 font-display text-xl font-bold tracking-tight">
          Nova<span className="text-brand-500">Market</span>
        </Link>

        <nav className="hidden items-center gap-8 lg:flex">
          {LINKS.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              className="text-sm font-medium text-ink/70 transition hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={submitSearch}
          className="hidden max-w-sm flex-1 items-center gap-2 rounded-full border border-ink/10 bg-mist px-4 py-2.5 md:flex"
        >
          <Search size={16} className="shrink-0 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full bg-transparent text-sm outline-none placeholder:text-ink/40"
          />
        </form>

        <div className="flex items-center gap-4">
          <Link
            to={userInfo ? "/profile" : "/signin"}
            className="hidden items-center gap-2 text-sm font-medium text-ink/80 hover:text-ink sm:flex"
          >
            <User size={18} />
            {userInfo ? userInfo.name?.split(" ")[0] : "Sign in"}
          </Link>

          <Link to="/cart" className="relative">
            <ShoppingBag size={20} />
            {cartItems.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white">
                {cartItems.length}
              </span>
            )}
          </Link>

          <button className="lg:hidden" onClick={() => setOpen((v) => !v)} aria-label="Menu">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-ink/5 bg-paper px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {LINKS.map((l) => (
              <Link key={l.label} to={l.to} onClick={() => setOpen(false)} className="text-sm font-medium">
                {l.label}
              </Link>
            ))}
            <Link to={userInfo ? "/profile" : "/signin"} onClick={() => setOpen(false)} className="text-sm font-medium">
              {userInfo ? "My Account" : "Sign in"}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
