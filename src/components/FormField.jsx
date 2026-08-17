import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function FormField({ label, ...props }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink/80">{label}</label>
      <input
        {...props}
        className="h-12 w-full rounded-xl border border-ink/10 bg-mist/40 px-4 text-sm outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-400/10"
      />
    </div>
  );
}

export function PasswordField({ label, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink/80">{label}</label>
      <div className="relative">
        <input
          {...props}
          type={show ? "text" : "password"}
          className="h-12 w-full rounded-xl border border-ink/10 bg-mist/40 px-4 pr-11 text-sm outline-none transition focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-400/10"
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink/70"
          aria-label={show ? "Hide password" : "Show password"}
        >
          {show ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

export function SubmitButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex h-12 w-full items-center justify-center rounded-xl bg-ink text-sm font-semibold text-white transition hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export function FormMessage({ type = "error", children }) {
  const styles =
    type === "error"
      ? "border-red-200 bg-red-50 text-red-600"
      : "border-emerald-200 bg-emerald-50 text-emerald-700";
  return <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>{children}</div>;
}
