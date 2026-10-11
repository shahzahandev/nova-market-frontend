import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import BrandName from "./BrandName";
import { useStoreInfo } from "../context/StoreInfoContext";

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  const { storeInfo } = useStoreInfo();
  const storeName = storeInfo?.storeName || "Nova Market";

  return (
    <div className="">
      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          {/* Logo + Back to home */}
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="font-display text-xl font-bold">
              <BrandName name={storeName} />
            </Link>
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink/10 px-3 py-1.5 text-xs font-medium text-ink/70 transition hover:border-ink/30 hover:text-ink"
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