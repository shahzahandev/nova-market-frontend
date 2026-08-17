import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";
import { FormField, PasswordField, SubmitButton, FormMessage } from "../components/FormField";
import { useAuth } from "../context/AuthContext";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      return setError("Please enter your email and password.");
    }

    try {
      setLoading(true);
      const res = await api.post("/auth/login", formData);
      login(res.data);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Sign in"
      subtitle="Good to see you again."
    >
      {location.state?.justRegistered && (
        <div className="mb-5">
          <FormMessage type="success">
            Account created. Check your email to verify, then sign in.
          </FormMessage>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-sm font-medium text-ink/80">Password</label>
            <Link to="/forgot-password" className="text-xs font-medium text-brand-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <PasswordFieldNoLabel
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
        </div>

        {error && <FormMessage>{error}</FormMessage>}

        <SubmitButton loading={loading}>Sign in</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Don't have an account?{" "}
        <Link to="/signup" className="font-semibold text-ink underline">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}

// Same as PasswordField but without its own label (label handled above, next to the "Forgot password?" link)
function PasswordFieldNoLabel(props) {
  const [show, setShow] = useState(false);
  return (
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
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>
  );
}
