import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../components/AuthLayout";
import { FormField, PasswordField, SubmitButton, FormMessage } from "../components/FormField";
import { useStoreInfo } from "../context/StoreInfoContext";

const REGISTER_URL = "https://nova-market-backend-2.onrender.com/api/v1/auth/register";
const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export default function SignUp() {
  const navigate = useNavigate();
  const { storeInfo } = useStoreInfo();
  const storeName = storeInfo?.storeName || "Nova Market";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      return setError("Please fill in all fields.");
    }

    if (!isValidEmail(formData.email.trim())) {
      return setError("Please enter a valid email address.");
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
      await axios.post(REGISTER_URL, formData);
      setSuccess("Account created. Please check your email to verify your account. And login.");

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
      });

      setTimeout(() => {
        navigate("/signin", { state: { justRegistered: true } });
      }, 1500);
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow={`Join ${storeName}`}
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
          <span>
            I agree to the{" "}
            <Link
              to="/terms"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              to="/privacyPolicy"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-ink underline"
            >
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <FormMessage>
          {error && (
            <div className="bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 px-4 py-3 text-sm text-green-600">
              {success}
            </div>
          )}
        </FormMessage>
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