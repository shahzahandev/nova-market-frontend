import { useState } from "react";
import axios from "axios";
import { ImagePlus, X, Star, Plus, Trash2 } from "lucide-react";

const ADD_PRODUCT_URL = "http://localhost:3000/api/v1/product/createProduct";

const MAX_IMAGES = 5;

export default function AddProduct() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    shortDescription: "",
    price: "",
    stock: "",
    brand: "",
    category: "",
    subCategory: "",
    tag: "",
    features: "",
    status: "active",
    additionalInfo: "",
  });

  const [specifications, setSpecifications] = useState([
    {
      name: "",
      value: "",
    },
  ]);

  // =========================
  // Images
  // =========================
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [mainIndex, setMainIndex] = useState(null);
  const [imageError, setImageError] = useState("");

  // =========================
  // Discount
  // =========================
  const [discountType, setDiscountType] = useState("none");
  const [discountValue, setDiscountValue] = useState("");
  const [discountStartDate, setDiscountStartDate] = useState("");
  const [discountEndDate, setDiscountEndDate] = useState("");

  // =========================
  // Submit State
  // =========================
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // Specifications
  // =========================
  const updateSpec = (index, field, value) => {
    setSpecifications((prev) =>
      prev.map((spec, i) =>
        i === index
          ? {
              ...spec,
              [field]: value,
            }
          : spec
      )
    );
  };

  const addSpecRow = () => {
    setSpecifications((prev) => [
      ...prev,
      {
        name: "",
        value: "",
      },
    ]);
  };

  const removeSpecRow = (index) => {
    setSpecifications((prev) =>
      prev.filter((_, i) => i !== index)
    );
  };

  // =========================
  // Images
  // =========================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setImageError("");

    const remainingSlots = MAX_IMAGES - images.length;

    if (remainingSlots <= 0) {
      setImageError(
        `You can upload a maximum of ${MAX_IMAGES} images.`
      );

      e.target.value = "";
      return;
    }

    if (files.length > remainingSlots) {
      setImageError(
        `You can upload a maximum of ${MAX_IMAGES} images. Only the first ${remainingSlots} of your selection were added.`
      );
    }

    const filesToAdd = files.slice(0, remainingSlots);

    setImages((prev) => {
      const updated = [...prev, ...filesToAdd];

      setMainIndex((current) =>
        current === null ? 0 : current
      );

      return updated;
    });

    setPreviews((prev) => [
      ...prev,
      ...filesToAdd.map((file) =>
        URL.createObjectURL(file)
      ),
    ]);

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setPreviews((prev) =>
      prev.filter((_, i) => i !== index)
    );

    setImageError("");

    setMainIndex((current) => {
      if (current === null) return null;

      const remaining = images.length - 1;

      if (remaining <= 0) return null;

      if (index === current) return 0;

      if (index < current) return current - 1;

      return current;
    });
  };

  // =========================
  // Discount / Sale Price
  // =========================
  const numericPrice = Number(formData.price) || 0;
  const numericDiscount = Number(discountValue) || 0;

  let salePrice = numericPrice;

  if (discountType === "flat") {
    salePrice = Math.max(
      numericPrice - numericDiscount,
      0
    );
  }

  if (discountType === "percentage") {
    salePrice = Math.max(
      numericPrice -
        (numericPrice * numericDiscount) / 100,
      0
    );
  }

  // =========================
  // Submit Product
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =========================
    // Required Field Validation
    // =========================
    if (
      !formData.title.trim() ||
      !formData.price ||
      !formData.category.trim() ||
      !formData.stock
    ) {
      setError(
        "Title, Price, Category, and Stock are required."
      );
      return;
    }

    // =========================
    // Price Validation
    // =========================
    if (numericPrice <= 0) {
      setError("Product price must be greater than 0.");
      return;
    }

    if (Number(formData.stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    // =========================
    // Discount Date Validation
    // =========================
    if (
      discountType !== "none" &&
      discountStartDate &&
      discountEndDate &&
      discountStartDate > discountEndDate
    ) {
      setError(
        "Discount start date cannot be after the end date."
      );
      return;
    }

    // =========================
    // Discount Validation
    // =========================
    if (
      discountType === "flat" &&
      numericDiscount >= numericPrice
    ) {
      setError(
        "Discount amount cannot be greater than or equal to the product price."
      );
      return;
    }

    if (
      discountType === "percentage" &&
      numericDiscount > 100
    ) {
      setError(
        "Percentage discount cannot be greater than 100%."
      );
      return;
    }

    try {
      setSubmitting(true);

      // =========================
      // FormData
      // =========================
      const payload = new FormData();

      // Basic fields
      payload.append("title", formData.title.trim());
      payload.append("description",formData.description.trim());
      payload.append("shortDescription", formData.shortDescription.trim());
      payload.append("price", numericPrice);
      payload.append("stock", Number(formData.stock));
      payload.append("brand", formData.brand.trim());
      payload.append("category", formData.category.trim());
      payload.append("subCategory",formData.subCategory.trim());
      payload.append("status", formData.status);
      payload.append("additionalInfo",formData.additionalInfo.trim());
      const cleanTags = formData.tag.split(",").map((tag) => tag.trim()).filter(Boolean);
      payload.append("tag", JSON.stringify(cleanTags));

      const cleanFeatures = formData.features
        .split(",")
        .map((feature) => feature.trim())
        .filter(Boolean);

      payload.append( "features",JSON.stringify(cleanFeatures));
      payload.append("discountType", discountType);

      if (discountType !== "none") {
        payload.append("discountPrice", discountValue);

        if (discountStartDate) {
          payload.append("discountStartDate", discountStartDate);
        }

        if (discountEndDate) {
          payload.append("discountEndDate",discountEndDate);
        }
      } else {
        payload.append("discountPrice", 0);
      }

      // =========================
      // Specifications
      // =========================
      const cleanSpecs = specifications
        .map((spec) => ({
          name: spec.name.trim(),
          value: spec.value.trim(),
        }))
        .filter(
          (spec) => spec.name && spec.value
        );

      payload.append(
        "specifications",
        JSON.stringify(cleanSpecs)
      );

      // =========================
      // Images
      // =========================
      images.forEach((file) => {
        payload.append("photos", file);
      });

      // Main image index
      payload.append(
        "isMain",
        mainIndex !== null ? mainIndex : 0
      );

      // =========================
      // API Request
      // =========================
      const res = await axios.post(
        ADD_PRODUCT_URL,
        payload,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // =========================
      // Success
      // =========================
      setSuccess(
        res.data?.message ||
          "Product added successfully."
      );

      // =========================
      // Reset Form
      // =========================
      setFormData({
        title: "",
        description: "",
        shortDescription: "",
        price: "",
        stock: "",
        brand: "",
        category: "",
        subCategory: "",
        tag: "",
        features: "",
        status: "active",
        additionalInfo: "",
      });

      setSpecifications([
        {
          name: "",
          value: "",
        },
      ]);

      setImages([]);
      setPreviews([]);
      setMainIndex(null);

      setDiscountType("none");
      setDiscountValue("");
      setDiscountStartDate("");
      setDiscountEndDate("");

    } catch (err) {
      console.log("Create product error:", err);

      setError(
        err.response?.data?.message ||
          "Failed to add product."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">

      {/* =========================
          Header
      ========================= */}
      <h2 className="text-3xl font-bold">
        Add Product
      </h2>

      <p className="mt-1 text-slate-500">
        Create a new product listing.
      </p>

      {/* =========================
          Form
      ========================= */}
      <form
        onSubmit={handleSubmit}
        className="mt-6 rounded-2xl border border-black/10 bg-white p-6 sm:p-8"
      >

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          {/* =========================
              Title
          ========================= */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-black">
              Title{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Product title"
              className="h-12 w-full rounded-lg border border-black/20 px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* =========================
              Description
          ========================= */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-black">
              Description
            </label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Full product description"
              className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* =========================
              Short Description
          ========================= */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-black">
              Short Description
            </label>

            <textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              rows={2}
              placeholder="One or two lines summary"
              className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* =========================
              Price
          ========================= */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Price{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="h-12 w-full rounded-lg border border-black/20 px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* =========================
              Stock
          ========================= */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Stock{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="h-12 w-full rounded-lg border border-black/20 px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* =========================
              Brand
          ========================= */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Brand
            </label>

            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Brand name"
              className="h-12 w-full rounded-lg border border-black/20 px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* =========================
              Category
          ========================= */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Category{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Electronics"
              className="h-12 w-full rounded-lg border border-black/20 px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* =========================
              Sub Category
          ========================= */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Sub Category
            </label>

            <input
              type="text"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              placeholder="Smart Watch"
              className="h-12 w-full rounded-lg border border-black/20 px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* =========================
              Tags
          ========================= */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Tags{" "}
              <span className="text-black/40">
                (comma separated)
              </span>
            </label>

            <input
              type="text"
              name="tag"
              value={formData.tag}
              onChange={handleChange}
              placeholder="smartwatch, sony, android"
              className="h-12 w-full rounded-lg border border-black/20 px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* =========================
              Status
          ========================= */}
          <div>
            <label className="mb-2 block text-sm font-medium text-black">
              Status
            </label>

            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="h-12 w-full rounded-lg border border-black/20 px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            >
              <option value="pending">
                pending
              </option>

              <option value="active">
                active
              </option>

              <option value="inactive">
                inactive
              </option>
            </select>
          </div>

          {/* =========================
              Features
          ========================= */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-black">
              Features{" "}
              <span className="text-black/40">
                (comma separated)
              </span>
            </label>

            <input
              type="text"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="GPS, Bluetooth, Voice Commands, IP68"
              className="h-12 w-full rounded-lg border border-black/20 px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* =========================
              Additional Information
          ========================= */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-medium text-black">
              Additional Information
            </label>

            <textarea
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              rows={3}
              placeholder="Box contents, warranty, notes..."
              className="w-full rounded-lg border border-black/20 px-4 py-3 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
            />
          </div>

          {/* =================================================
              SPECIFICATIONS
          ================================================= */}
          <div className="rounded-xl border border-black/10 p-5 sm:col-span-2">

            <div className="mb-4 flex items-center justify-between">

              <h3 className="text-base font-semibold text-black">
                Specifications
              </h3>

              <button
                type="button"
                onClick={addSpecRow}
                className="flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-700"
              >
                <Plus size={16} />
                Add row
              </button>

            </div>

            <div className="flex flex-col gap-3">

              {specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-3 sm:flex-row"
                >

                  <input
                    type="text"
                    value={spec.name}
                    onChange={(e) =>
                      updateSpec(
                        index,
                        "name",
                        e.target.value
                      )
                    }
                    placeholder="Battery Life"
                    className="h-11 flex-1 rounded-lg border border-black/20 px-3 py-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />

                  <input
                    type="text"
                    value={spec.value}
                    onChange={(e) =>
                      updateSpec(
                        index,
                        "value",
                        e.target.value
                      )
                    }
                    placeholder="Up to 2 days"
                    className="h-11 flex-1 rounded-lg border border-black/20 px-3 py-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      removeSpecRow(index)
                    }
                    disabled={
                      specifications.length === 1
                    }
                    aria-label="Remove specification"
                    className="flex h-11 w-full items-center justify-center rounded-lg border border-black/10 text-black/40 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 sm:w-11"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              ))}

            </div>
          </div>

          {/* =================================================
              DISCOUNT
          ================================================= */}
          <div className="rounded-xl border border-black/10 p-5 sm:col-span-2">

            <h3 className="mb-4 text-base font-semibold text-black">
              Discount
            </h3>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

              {/* Discount Type */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Discount Type
                </label>

                <select
                  value={discountType}
                  onChange={(e) =>
                    setDiscountType(e.target.value)
                  }
                  className="h-12 w-full rounded-lg border border-black/20 px-4 text-sm outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                >
                  <option value="none">
                    None
                  </option>

                  <option value="flat">
                    Flat
                  </option>

                  <option value="percentage">
                    Percentage
                  </option>
                </select>
              </div>

              {/* Discount Value */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Discount{" "}
                  {discountType === "percentage"
                    ? "(%)"
                    : "(৳)"}
                </label>

                <input
                  type="number"
                  min="0"
                  value={discountValue}
                  onChange={(e) =>
                    setDiscountValue(e.target.value)
                  }
                  disabled={
                    discountType === "none"
                  }
                  placeholder="0"
                  className="h-12 w-full rounded-lg border border-black/20 px-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-black/5 disabled:text-black/40"
                />
              </div>

              {/* Sale Price */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Sale Price Preview
                </label>

                <div className="flex h-12 items-center rounded-lg bg-black/5 px-4 text-sm font-semibold text-black">
                  ৳{salePrice.toLocaleString("en-US")}
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Discount Start Date
                </label>

                <input
                  type="date"
                  value={discountStartDate}
                  onChange={(e) =>
                    setDiscountStartDate(
                      e.target.value
                    )
                  }
                  disabled={
                    discountType === "none"
                  }
                  className="h-12 w-full rounded-lg border border-black/20 px-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-black/5 disabled:text-black/40"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Discount End Date
                </label>

                <input
                  type="date"
                  value={discountEndDate}
                  onChange={(e) =>
                    setDiscountEndDate(
                      e.target.value
                    )
                  }
                  disabled={
                    discountType === "none"
                  }
                  className="h-12 w-full rounded-lg border border-black/20 px-4 text-sm outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100 disabled:bg-black/5 disabled:text-black/40"
                />
              </div>

            </div>
          </div>

          {/* =================================================
              PRODUCT IMAGES
          ================================================= */}
          <div className="sm:col-span-2">

            <div className="mb-2 flex items-center justify-between">

              <label className="block text-sm font-medium text-black">
                Product Photos
              </label>

              <span className="text-xs text-black/50">
                {images.length}/{MAX_IMAGES}
              </span>

            </div>

            <label
              className={`flex h-32 w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed text-black/50 transition ${
                images.length >= MAX_IMAGES
                  ? "cursor-not-allowed border-black/10 opacity-50"
                  : "cursor-pointer border-black/20 hover:border-sky-400 hover:text-sky-500"
              }`}
            >

              <ImagePlus size={24} />

              <span className="text-sm">
                {images.length >= MAX_IMAGES
                  ? "Maximum photos reached"
                  : "Click to upload photos"}
              </span>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={
                  images.length >= MAX_IMAGES
                }
                className="hidden"
              />

            </label>

            {imageError && (
              <p className="mt-2 text-sm text-red-600">
                {imageError}
              </p>
            )}

            {/* Image Preview */}
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">

                {previews.map((src, index) => (
                  <div
                    key={src}
                    className={`group relative aspect-square overflow-hidden rounded-lg border-2 ${
                      mainIndex === index
                        ? "border-sky-400"
                        : "border-black/10"
                    }`}
                  >

                    <img
                      src={src}
                      alt={`preview ${index + 1}`}
                      className="h-full w-full object-cover"
                    />

                    {/* Main Button */}
                    <button
                      type="button"
                      onClick={() =>
                        setMainIndex(index)
                      }
                      aria-label="Set as main image"
                      className={`absolute left-1 top-1 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold transition ${
                        mainIndex === index
                          ? "bg-sky-400 text-black"
                          : "bg-black/60 text-white opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <Star
                        size={10}
                        fill={
                          mainIndex === index
                            ? "currentColor"
                            : "none"
                        }
                      />

                      {mainIndex === index ? "Main" : "Set main"}
                    </button>
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={() =>
                        removeImage(index)
                      }
                      aria-label="Remove image"
                      className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/70 text-white opacity-0 transition group-hover:opacity-100"
                    >
                      <X size={14} />
                    </button>

                  </div>
                ))}

              </div>
            )}

          </div>

        </div>

        {/* =========================
            Error
        ========================= */}
        {error && (
          <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* =========================
            Success
        ========================= */}
        {success && (
          <div className="mt-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* =========================
            Submit
        ========================= */}
        <button
          type="submit"
          disabled={submitting}
          className="mt-6 h-12 w-full rounded-lg bg-sky-400 text-sm font-semibold text-black transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:px-10"
        >
          {submitting
            ? "Submitting..."
            : "Submit"}
        </button>

      </form>
    </div>
  );
}