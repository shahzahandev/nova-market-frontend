import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BrandName from "./BrandName";
import { useStoreInfo } from "../context/StoreInfoContext";

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  const { storeInfo } = useStoreInfo();
  const storeName = storeInfo?.storeName || "Nova Market";

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left dark panel (shudhu desktop-e) */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex">
        <div className="max-w-md">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">
            {eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight">
            Shop smarter. Ship faster. Shipped by people who care.
          </h2>
        </div>
        <p className="text-xs text-white/40">
          © {new Date().getFullYear()} {storeName}
        </p>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      {/* Right form side */}
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center justify-between gap-3">
            <Link
              to="/"
              className="truncate font-display text-xl font-bold"
            >
              <BrandName name={storeName} />
            </Link>

            <Link
              to="/"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink/70 transition hover:border-ink/30 hover:text-ink"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to home
            </Link>
          </div>
          <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
          {subtitle && <p className="mt-2 text-sm text-ink/60">{subtitle}</p>}
          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}