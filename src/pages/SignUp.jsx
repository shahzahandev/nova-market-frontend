import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { FormField, PasswordField, SubmitButton, FormMessage } from "../components/FormField";
import axios from "axios";

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
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));

    if (error) { setError(""); }
  };




  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("")

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
    // =============================
    // Email Validation Function
    // =============================
    const isValidEmail = (email) => {
      const emailRegex =
        /^[^\s@]+@[^\s@]+.[^\s@]+$/;

      return emailRegex.test(email);
    };

  if (!isValidEmail(formData.email)) {
    return setError("Please enter a valid email address.");
  }

    try {
      setLoading(true);
      await axios.post(`http://localhost:3000/api/v1/auth/register`, formData)

      setSuccess("Account created. Please check your email to verify your account. And login.")


      setTimeout(() => {
        navigate("/signin",
          {
            state: {
              justRegistered: true
            }
          }
        )
      }, 1500);

      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
      });
    } catch (error) {
      let err = error.response.data.message
      setError(err)
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSuccess(""),
          navigate("/signin")
      }, 3000);
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

        <FormMessage>
          {error && (
            <div className=" bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className=" bg-green-100 px-4 py-3 text-sm text-green-600">
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