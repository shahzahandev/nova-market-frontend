import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";
import { FormField, SubmitButton, FormMessage } from "../components/FormField";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) return setError("Please enter your email address.");

    try {
      setLoading(true);
      const res = await axios.post("https://nova-market-backend-2.onrender.com/api/v1/auth/forgotPassword", { email });
      setSuccess(res.data.message);
      
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Forgot your password?"
      subtitle="Enter your email and we'll send you a reset link."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Email address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
        />

        {error && <FormMessage>{error}</FormMessage>}
        {success && <FormMessage type="success">{success}</FormMessage>}

        <SubmitButton loading={loading}>Send reset link</SubmitButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink/60">
        Remembered it?{" "}
        <Link to="/signin" className="font-semibold text-ink underline">
          Back to sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
