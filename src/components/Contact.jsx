
import React, { useState } from "react";
import axios from "axios";
import { SendHorizontal } from "lucide-react";
import Container from "../components/Container";
import { useStoreInfo } from "../context/StoreInfoContext";
import BrandName from "./BrandName";

const API_URL = "https://nova-market-backend-2.onrender.com/api/v1/message/createMessage";

const Contact = () => {
  const { storeInfo } = useStoreInfo();
  const storeName = storeInfo?.storeName || "";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    setSuccessMessage("");
    setServerError("");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    } else if (formData.name.trim().length > 100) {
      newErrors.name = "Name cannot exceed 100 characters.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Please enter a valid email address.";
    } else if (formData.email.trim().length > 254) {
      newErrors.email = "Email is too long.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (
      !/^(?:\+8801|01)[3-9]\d{8}$/.test(formData.phone.trim())
    ) {
      newErrors.phone = "Please enter a valid Bangladesh phone number.";
    }

    if (!formData.comment.trim()) {
      newErrors.comment = "Comment is required.";
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = "Comment must be at least 10 characters.";
    } else if (formData.comment.trim().length > 2000) {
      newErrors.comment = "Comment cannot exceed 2000 characters.";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setSuccessMessage("");
    setServerError("");

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post(
        API_URL,
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          comment: formData.comment.trim(),
        },
        {
          headers: {"Content-Type": "application/json"},
          timeout: 20000,
        }
      );

      if (response.data?.success === false) {
        throw new Error(response.data.message || "Failed to submit your message.");
      }

      setSuccessMessage(response.data?.message || "Your message has been submitted successfully!");

      setFormData({
        name: "",
        email: "",
        phone: "",
        comment: "",
      });

      setErrors({});
    } catch (error) {
      console.error("Contact form submission error:", error.response?.data || error.message);

      setServerError(error.response?.data?.message ||
          (error.code === "ECONNABORTED"
            ? "Request timed out. Please try again."
            : !error.response
              ? "Unable to connect to the server. Please try again."
              : "Failed to submit your message. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-gray-100 py-10">
        <Container>
          <section className="bg-white py-5">
            <div className="px-2 sm:px-4 lg:px-6">
              {/* Contact Heading */}
              <div className="text-start">
                <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                  Contact <span className="text-brand-500">Us</span>
                </h2>

                <p className="text-base leading-7 text-gray-600">
                  Have a question, feedback, or need help with an order? Fill
                  out the form below and our team at{" "}
                  <span className="font-bold">
                    <BrandName name={storeName} />
                  </span>{" "}
                  will get back to you as soon as possible.
                </p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div
                  role="status"
                  className="mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
                >
                  {successMessage}
                </div>
              )}

              {/* Server Error */}
              {serverError && (
                <div
                  role="alert"
                  className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
                >
                  {serverError}
                </div>
              )}

              {/* Contact Form */}
              <div className="mt-16 w-full text-start">
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                >
                  {/* Name */}
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Name"
                      maxLength={100}
                      disabled={loading}
                      autoComplete="name"
                      className={`w-full rounded-lg border ${
                        errors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      } bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-brand-500`}
                    />

                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email"
                      maxLength={254}
                      disabled={loading}
                      autoComplete="email"
                      className={`w-full rounded-lg border ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      } bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-brand-500`}
                    />

                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      maxLength={14}
                      disabled={loading}
                      autoComplete="tel"
                      className={`w-full rounded-lg border ${
                        errors.phone
                          ? "border-red-500"
                          : "border-gray-300"
                      } bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-brand-500`}
                    />

                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  {/* Comment */}
                  <div>
                    <textarea
                      name="comment"
                      value={formData.comment}
                      onChange={handleChange}
                      placeholder="Comment"
                      rows={5}
                      maxLength={2000}
                      disabled={loading}
                      className={`w-full resize-none rounded-lg border ${
                        errors.comment
                          ? "border-red-500"
                          : "border-gray-300"
                      } bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-brand-500`}
                    />

                    {errors.comment && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.comment}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex w-fit items-center gap-2 rounded-lg bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Submitting..." : "Submit"}

                    <SendHorizontal className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          </section>
        </Container>
      </div>
    </>
  );
};

export default Contact;