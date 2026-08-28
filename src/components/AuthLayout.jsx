import { Link } from "react-router-dom";

export default function AuthLayout({ eyebrow, title, subtitle, children }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden flex-col justify-between overflow-hidden bg-ink p-12 text-white lg:flex">
        {/* <Link to="/" className="font-display text-xl font-bold">
          Nova<span className="text-brand-400">Market</span>
        </Link> */}

        <div className="max-w-md">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-brand-300">
            {eyebrow}
          </p>
          <h2 className="mt-4 font-display text-3xl font-semibold leading-tight">
            Shop smarter. Ship faster. Shipped by people who care.
          </h2>
        </div>

        <p className="text-xs text-white/40">© {new Date().getFullYear()} Nova Market</p>

        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
      </div>

      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Link to="/" className="font-display text-xl font-bold">
              Nova<span className="text-brand-500">Market</span>
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
