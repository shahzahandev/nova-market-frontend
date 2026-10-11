import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import AuthLayout from "../components/AuthLayout";
import {
  PasswordField,
  SubmitButton,
  FormMessage,
} from "../components/FormField";
import { useStoreInfo } from "../context/StoreInfoContext";

const RESET_URL =
  "https://nova-market-backend-2.onrender.com/api/v1/auth/resetpassword";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { storeInfo } = useStoreInfo();

  const storeName = storeInfo?.storeName || "Nova Market";

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Clean Token
  const cleanToken = token ? decodeURIComponent(token).trim() : "";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!cleanToken) {
      setError("Invalid or missing password reset token.");
      return;
    }

    if (!formData.newPassword || !formData.confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${RESET_URL}/${token}`, {
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      setSuccess(
        res.data?.message ||
          "Password updated successfully. Redirecting to sign in..."
      );

      setFormData({
        newPassword: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/signin");
      }, 2000);
    } catch (err) {
      console.error("Reset password error:", err);

      setError(
        err.response?.data?.message ||
          "This reset link is invalid or has expired."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      eyebrow={`${storeName} account recovery`}
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