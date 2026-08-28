import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import {
  PasswordField,
  SubmitButton,
  FormMessage,
} from "../components/FormField";
import axios from "axios";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // Clean Token
  // =========================
  const cleanToken = token
    ? decodeURIComponent(token).trim()
    : "";

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =========================
  // Handle Submit
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =========================
    // Token Validation
    // =========================
    if (!cleanToken) {
      setError("Invalid or missing password reset token.");
      return;
    }

    // =========================
    // Password Validation
    // =========================
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

      // =========================
      // Backend API
      // =========================
      const res = await axios.post(`http://localhost:3000/api/v1/auth/resetpassword/${token}`,
       
        
        {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }

      );
               console.log(res)


      // =========================
      // Success
      // =========================
      setSuccess(
        res.data?.message ||
          "Password updated successfully. Redirecting to sign in..."
      );

      setFormData({
        newPassword: "",
        confirmPassword: "",
      });

      // Redirect after success
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
      eyebrow="Account recovery"
      title="Set a new password"
      subtitle="Make it strong — you'll use this to sign in from now on."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* =========================
            New Password
        ========================= */}
        <PasswordField
          label="New password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          placeholder="At least 8 characters"
        />

        {/* =========================
            Confirm Password
        ========================= */}
        <PasswordField
          label="Confirm new password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Re-enter your new password"
        />

        {/* =========================
            Error
        ========================= */}
        {error && <FormMessage>{error}</FormMessage>}

        {/* =========================
            Success
        ========================= */}
        {success && (
          <FormMessage type="success">
            {success}
          </FormMessage>
        )}

        {/* =========================
            Submit
        ========================= */}
        <SubmitButton loading={loading}>
          Reset password
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}

