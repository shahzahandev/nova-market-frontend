import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

import AuthLayout from "../components/AuthLayout";
import {
  FormField,
  SubmitButton,
  FormMessage,
} from "../components/FormField";

export default function SignIn() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // =========================
  // FORM VALIDATION
  // =========================

  const validateForm = () => {
    const newErrors = {
      email: "",
      password: "",
    };

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password =
        "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters.";
    }

    setErrors(newErrors);

    return (
      !newErrors.email &&
      !newErrors.password
    );


  };

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ওই input-এর error remove হবে
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // API error / success message clear হবে
    setError("");
    setSuccess("");
  };

  // =========================
  // HANDLE LOGIN
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Frontend validation
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post("https://nova-market-backend-2.onrender.com/api/v1/auth/login",
        formData
      );

      console.log(
        "Login Response:",
        res.data.existingUser
      );


      localStorage.setItem(
        "account",
        JSON.stringify(res.data.existingUser)
      );

      window.dispatchEvent(
        new Event("login")
      );

      // Success message
      setSuccess(
        res?.data?.message ||
        "Login successfully completed."
      );

      // Redirect to home
      setTimeout(() => {
        navigate("/");
      }, 1000);

    } catch (err) {
      console.error(
        "Login Error:",
        err
      );

      const errorMessage =
        err?.response?.data?.message ||
        "Invalid email or password.";

      setError(errorMessage);

    } finally {
      setLoading(false);
    }

  };

  return (<AuthLayout
    eyebrow="Welcome back"
    title="Sign in"
    subtitle="Good to see you again."
  >

    {/* =========================
      REGISTRATION SUCCESS
  ========================== */}

    {location.state?.justRegistered && (
      <div className="mb-5">
        <FormMessage type="success">
          Your account has been created successfully.
          Please check your email to verify your account,
          then sign in.
        </FormMessage>
      </div>
    )}

    {/* =========================
      SIGN IN FORM
  ========================== */}

    <form
      onSubmit={handleSubmit}
      className="space-y-4"
      noValidate
    >

      {/* EMAIL */}

      <div>
        <FormField
          label="Email address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@example.com"
          autoComplete="email"
        />

        {errors.email && (
          <p className="mt-1.5 text-xs font-medium text-red-500">
            {errors.email}
          </p>
        )}
      </div>


      {/* PASSWORD */}

      <div>

        <div className="mb-1.5 flex items-center justify-between">

          <label className="text-sm font-medium text-ink/80">
            Password
          </label>

          <Link
            to="/forgot-password"
            className="text-xs font-medium text-brand-600 hover:underline"
          >
            Forgot password?
          </Link>

        </div>

        <PasswordFieldNoLabel
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          error={errors.password}
        />

      </div>


      {/* API ERROR */}

      {error && (
        <FormMessage type="error">
          {error}
        </FormMessage>
      )}


      {/* SUCCESS MESSAGE */}

      {success && (
        <FormMessage type="success">
          {success}
        </FormMessage>
      )}


      {/* SUBMIT BUTTON */}

      <SubmitButton loading={loading}>
        Sign in
      </SubmitButton>

    </form>


    {/* =========================
      SIGN UP LINK
  ========================== */}

    <p className="mt-6 text-center text-sm text-ink/60">
      Don't have an account?{" "}
      <Link
        to="/signup"
        className="font-semibold text-ink underline"
      >
        Sign up
      </Link>
    </p>
  </AuthLayout>

  );
}

// =====================================
// PASSWORD FIELD WITHOUT LABEL
// =====================================

function PasswordFieldNoLabel({
  name,
  value,
  onChange,
  placeholder,
  error,
}) {
  const [show, setShow] = useState(false);

  return (<div>
    <div className="relative">
      <input
        type={show ? "text" : "password"}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete="current-password"
        className={`h-12 w-full rounded-xl border bg-mist/40 px-4 pr-16 text-sm outline-none transition focus:bg-white focus:ring-4 ${error
            ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
            : "border-ink/10 focus:border-brand-400 focus:ring-brand-400/10"
          }`}
      />

      <button
        type="button"
        onClick={() =>
          setShow((prev) => !prev)
        }
        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-ink/40 transition hover:text-ink/70"
      >
        {show ? "Hide" : "Show"}
      </button>
    </div>

    {error && (
      <p className="mt-1.5 text-xs font-medium text-red-500">
        {error}
      </p>
    )}
  </div>
  );
}
