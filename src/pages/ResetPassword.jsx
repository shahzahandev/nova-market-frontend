import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import AuthLayout from "../components/AuthLayout";
import { PasswordField, SubmitButton, FormMessage } from "../components/FormField";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ newPassword: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.newPassword || !formData.confirmPassword) {
      return setError("Please fill in both fields.");
    }
    if (formData.newPassword.length < 8) {
      return setError("Password must be at least 8 characters.");
    }
    if (formData.newPassword !== formData.confirmPassword) {
      return setError("Passwords do not match.");
    }

    try {
      setLoading(true);
      const res = await api.post(`/auth/reset-password/${token}`, formData);
      setSuccess(res.data?.message || "Password updated. Redirecting to sign in...");
      setFormData({ newPassword: "", confirmPassword: "" });
      setTimeout(() => navigate("/signin"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "This reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Set a new password"
      subtitle="Make it strong — you'll use this to sign in from now on."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordField
          label="New password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="At least 8 characters"
        />
        <PasswordField
          label="Confirm new password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your new password"
        />

        {error && <FormMessage>{error}</FormMessage>}
        {success && <FormMessage type="success">{success}</FormMessage>}

        <SubmitButton loading={loading}>Reset password</SubmitButton>
      </form>
    </AuthLayout>
  );
}
