import React, { useState } from "react";
import { SendHorizontal } from "lucide-react";
import Container from "../components/Container";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    comment: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Remove error while typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^(?:\+8801|01)[3-9]\d{8}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid Bangladesh phone number.";
    }

    // Comment validation
    if (!formData.comment.trim()) {
      newErrors.comment = "Comment is required.";
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = "Comment must be at least 10 characters.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Form is valid
    console.log("Form submitted:", formData);

    alert("Your message has been submitted successfully!");

    // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      comment: "",
    });

    setErrors({});
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
                  <span className="font-bold">Nova</span>
                  <span className="text-brand-500">Market</span> will get
                  back to you as soon as possible.
                </p>
              </div>

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
                      className={`w-full border ${
                        errors.name
                          ? "border-red-500"
                          : "border-gray-300"
                      } bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-brand-500 rounded-lg`}
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
                      className={`w-full border ${
                        errors.email
                          ? "border-red-500"
                          : "border-gray-300"
                      } bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-brand-500 rounded-lg`}
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
                      className={`w-full border ${
                        errors.phone
                          ? "border-red-500"
                          : "border-gray-300"
                      } bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-brand-500 rounded-lg`}
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
                      className={`w-full resize-none border ${
                        errors.comment
                          ? "border-red-500"
                          : "border-gray-300"
                      } bg-white px-4 py-3 text-gray-700 outline-none transition focus:border-brand-500 rounded-lg`}
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
                    className="flex w-fit items-center gap-2 bg-gray-900 px-6 py-3 font-medium text-white transition hover:bg-gray-700"
                  >
                    Submit
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