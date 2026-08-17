import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";
import { FormField, PasswordField, SubmitButton, FormMessage } from "../components/FormField";

export default function SignUp() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      return setError("Please fill in all fields.");
    }
    if (formData.password.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    if (formData.password !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }
    if (!formData.terms) {
      return setError("Please accept the Terms & Conditions.");
    }

    try {
      setLoading(true);
      await api.post("/auth/register", formData);
      navigate("/signin", { state: { justRegistered: true } });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Join Nova Market"
      title="Create your account"
      subtitle="Start shopping in under a minute."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Full name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Jordan Lee"
        />
        <FormField
          label="Email address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
        />
        <PasswordField
          label="Password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="At least 8 characters"
        />
        <PasswordField
          label="Confirm password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your password"
        />

        <label className="flex items-start gap-2.5 text-sm text-ink/60">
          <input
            type="checkbox"
            name="terms"
            checked={formData.terms}
            onChange={handleChange}
            className="mt-0.5 h-4 w-4 rounded border-ink/20 text-brand-500 focus:ring-brand-400"
          />
          I agree to the <a href="#" className="font-medium text-ink underline">Terms</a> and{" "}
          <a href="#" className="font-medium text-ink underline">Privacy Policy</a>.
        </label>

        {error && <FormMessage>{error}</FormMessage>}

        <SubmitButton loading={loading}>Create account</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Already have an account?{" "}
        <Link to="/signin" className="font-semibold text-ink underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
