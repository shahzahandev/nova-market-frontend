import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Package, LogOut, Heart, ShoppingBag, X } from "lucide-react";
import Container from "../components/Container";
import {
  FormField,
  SubmitButton,
  FormMessage,
} from "../components/FormField";
import { useAuth } from "../context/AuthContext";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import axios from "axios";

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";

function imageSrc(url) {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_ORIGIN}${url}`;
}

function getMainImage(item) {
  if (!item?.images?.length) return null;

  const mainImage = item.images.find(
    (img) => img.isMain === true || img.isMain === "true"
  );

  return mainImage || item.images[0];
}

const NAV = [
  { key: "profile", label: "Profile", icon: User },
  { key: "wishlist", label: "Wishlist", icon: Heart },
  { key: "orders", label: "Orders", icon: Package },
  { key: "logout", label: "Logout", icon: LogOut },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
};

const EMPTY_ERRORS = {
  name: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
};

const BD_PHONE_REGEX = /^(?:\+880|880|0)1[3-9]\d{8}$/;

// Bangladesh postal code = 4 digits
const POSTAL_CODE_REGEX = /^\d{4}$/;

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { wishlistItems, removeItem: removeWishlistItem } = useWishlist();
  const { addToCart } = useCart();

  const [active, setActive] = useState("profile");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [accountInfo, setAccountInfo] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);

  const [errors, setErrors] = useState(EMPTY_ERRORS);

  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // =========================
  // Validate Single Field
  // =========================
  const validateField = (name, value) => {
    const trimmedValue = value.trim();

    switch (name) {
      case "name":
        if (!trimmedValue) {
          return "Full name is required.";
        }

        if (trimmedValue.length < 2) {
          return "Full name must be at least 2 characters.";
        }

        if (trimmedValue.length > 50) {
          return "Full name must be less than 50 characters.";
        }

        // Allows letters, spaces, dot, apostrophe and hyphen
        if (!/^[A-Za-zÀ-ÿ\u0980-\u09FF\s.'-]+$/.test(trimmedValue)) {
          return "Please enter a valid name.";
        }

        return "";

      case "phone":
        if (!trimmedValue) {
          return "Phone number is required.";
        }

        // Remove spaces and hyphens before checking
        const normalizedPhone = trimmedValue.replace(/[\s-]/g, "");

        if (!BD_PHONE_REGEX.test(normalizedPhone)) {
          return "Enter a valid Bangladesh mobile number, e.g. 01712345678.";
        }

        return "";

      case "city":
        if (!trimmedValue) {
          return "City is required.";
        }

        if (trimmedValue.length < 2) {
          return "City must be at least 2 characters.";
        }

        if (trimmedValue.length > 50) {
          return "City must be less than 50 characters.";
        }

        return "";

      case "postalCode":
        if (!trimmedValue) {
          return "Postal code is required.";
        }

        if (!POSTAL_CODE_REGEX.test(trimmedValue)) {
          return "Postal code must be exactly 4 digits.";
        }

        return "";

      case "address":
        if (!trimmedValue) {
          return "Address is required.";
        }

        if (trimmedValue.length < 5) {
          return "Address must be at least 5 characters.";
        }

        if (trimmedValue.length > 250) {
          return "Address must be less than 250 characters.";
        }

        return "";

      default:
        return "";
    }
  };

  // =========================
  // Validate Entire Form
  // =========================
  const validateForm = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      phone: validateField("phone", formData.phone),
      city: validateField("city", formData.city),
      postalCode: validateField("postalCode", formData.postalCode),
      address: validateField("address", formData.address),
    };

    setErrors(newErrors);

    return !Object.values(newErrors).some((message) => message);
  };

  // =========================
  // Handle Input Change
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    let newValue = value;

    // Phone:
    // Only allow numbers, spaces, hyphens and +
    if (name === "phone") {
      newValue = value.replace(/[^\d+\s-]/g, "");
    }

    // Postal code:
    // Only allow digits
    if (name === "postalCode") {
      newValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear general error when user starts typing
    setError("");
    setSuccess("");

    // Validate field while typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validateField(name, newValue),
      }));
    }
  };

  // =========================
  // Get Account From LocalStorage
  // =========================
  useEffect(() => {
    try {
      const storedAccount = JSON.parse(localStorage.getItem("account"));

      setAccountInfo(storedAccount);

      if (!storedAccount?._id) {
        setLoadingProfile(false);
      }
    } catch (error) {
      console.error("Local account error:", error);

      setAccountInfo(null);
      setLoadingProfile(false);
    }
  }, []);

  // =========================
  // Fetch User Profile
  // =========================
  useEffect(() => {
    if (!accountInfo?._id) return;

    const getProfile = async () => {
      try {
        setLoadingProfile(true);
        setError("");

        const res = await axios.get(
          `https://nova-market-backend-2.onrender.com/api/v1/user/singleUser/${accountInfo._id}`
        );

        const user =
          res.data.user ||
          res.data.singleUserData ||
          res.data.data ||
          {};

        setFormData({
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          city: user.city || "",
          postalCode: user.postalCode || "",
        });

        setErrors(EMPTY_ERRORS);
      } catch (err) {
        console.error("Profile fetch error:", err);

        setError(
          err.response?.data?.message ||
            "Could not load your profile."
        );
      } finally {
        setLoadingProfile(false);
      }
    };

    getProfile();
  }, [accountInfo?._id]);

  // =========================
  // Update Profile
  // =========================
  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Validate before API request
    const isValid = validateForm();

    if (!isValid) {
      setError("Please fix the errors before saving.");
      return;
    }

    if (!accountInfo?._id) {
      setError("You're not signed in. Please log in again.");
      return;
    }

    try {
      setSaving(true);

      // Normalize phone before sending to backend
      const normalizedPhone = formData.phone
        .trim()
        .replace(/[\s-]/g, "");

      const payload = {
        name: formData.name.trim(),
        phone: normalizedPhone,
        city: formData.city.trim(),
        postalCode: formData.postalCode.trim(),
        address: formData.address.trim(),
      };

      const res = await axios.post(
        `https://nova-market-backend-2.onrender.com/api/v1/user/updateUser/${accountInfo._id}`,
        payload
      );

      const updatedUser =
        res.data.user ||
        res.data.updatedUser ||
        res.data.singleUserData ||
        res.data.data;

      if (!updatedUser) {
        throw new Error(
          "Updated user data not found in API response."
        );
      }

      // =========================
      // Update Form
      // =========================
      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || formData.email || "",
        phone: updatedUser.phone || "",
        city: updatedUser.city || "",
        postalCode: updatedUser.postalCode || "",
        address: updatedUser.address || "",
      });

      // Clear validation errors
      setErrors(EMPTY_ERRORS);

      // =========================
      // Update LocalStorage
      // =========================
      const updatedAccountInfo = {
        ...accountInfo,
        name: updatedUser.name,
        phone: updatedUser.phone,
        city: updatedUser.city,
        postalCode: updatedUser.postalCode,
        address: updatedUser.address,
      };

      localStorage.setItem(
        "account",
        JSON.stringify(updatedAccountInfo)
      );

      setAccountInfo(updatedAccountInfo);

      // Navbar sync
      window.dispatchEvent(new Event("profileUpdated"));

      setSuccess("Profile updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 2000);
    } catch (err) {
      console.error("Profile update error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Could not save changes."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // Navigation
  // =========================
  const handleNavClick = (key) => {
    if (key === "logout") {
      setShowLogoutConfirm(true);
      return;
    }

    setActive(key);
  };

  // =========================
  // Logout
  // =========================
  const confirmLogout = () => {
    logout();

    localStorage.removeItem("account");

    window.dispatchEvent(new Event("logout"));

    navigate("/");
  };

  return (
    <Container className="py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">

        {/* =========================
            Sidebar
        ========================= */}
        <aside className="h-fit rounded-2xl border border-ink/10 p-3">
          <nav className="grid md:flex grid-cols-2 gap-2 overflow-x-auto md:flex-col">
            {NAV.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleNavClick(key)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  key === "logout"
                    ? "text-red-600 hover:bg-red-100 bg-red-50"
                    : active === key
                    ? "bg-brand-400 text-white"
                    : "text-ink/70 hover:bg-mist"
                }`}
              >
                <Icon size={18} />
                {label}
                {key === "wishlist" && wishlistItems.length > 0 && (
                  <span
                    className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      active === key
                        ? "bg-white/20 text-white"
                        : "bg-brand-500 text-white"
                    }`}
                  >
                    {wishlistItems.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </aside>

        {/* =========================
            Main Section
        ========================= */}
        <section className="rounded-2xl border border-ink/10 p-6 sm:p-8">

          {/* =========================
              Profile
          ========================= */}
          {active === "profile" && (
            <>
              <h1 className="font-display text-xl font-bold">
                Your profile
              </h1>

              <p className="mt-1 text-sm text-ink/60">
                Update your personal information.
              </p>

              {loadingProfile ? (
                <p className="mt-6 text-sm text-ink/40">
                  Loading your profile...
                </p>
              ) : (
                <form
                  onSubmit={handleSave}
                  className="mt-6 space-y-5"
                  noValidate
                >
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                    {/* Name */}
                    <div>
                      <FormField
                        label="Full name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />

                      {errors.name && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <FormField
                        label="Email"
                        name="email"
                        value={formData.email}
                        disabled
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <FormField
                        label="Phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        type="tel"
                        placeholder="01712345678"
                      />

                      {errors.phone && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* City */}
                    <div>
                      <FormField
                        label="City"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                      />

                      {errors.city && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    {/* Postal Code */}
                    <div>
                      <FormField
                        label="Postal code"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        required
                        type="text"
                        inputMode="numeric"
                        maxLength={4}
                        placeholder="1205"
                      />

                      {errors.postalCode && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.postalCode}
                        </p>
                      )}
                    </div>

                    {/* Address */}
                    <div className="sm:col-span-2">
                      <FormField
                        label="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        placeholder="House, Road, Area"
                      />

                      {errors.address && (
                        <p className="mt-1 text-xs text-red-600">
                          {errors.address}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* General Error */}
                  {error && (
                    <FormMessage>
                      {error}
                    </FormMessage>
                  )}

                  {/* Success */}
                  {success && (
                    <FormMessage type="success">
                      <div className="px-2 py-2">
                        {success}
                      </div>
                    </FormMessage>
                  )}

                  {/* Submit */}
                  <div className="sm:w-48">
                    <SubmitButton loading={saving}>
                      Save changes
                    </SubmitButton>
                  </div>
                </form>
              )}
            </>
          )}

          {/* =========================
              Wishlist
          ========================= */}
          {active === "wishlist" && (
            <>
              <h1 className="font-display text-xl font-bold">
                Your wishlist
              </h1>

              <p className="mt-1 text-sm text-ink/60">
                Products you've saved for later.
              </p>

              {wishlistItems.length === 0 ? (
                <div className="mt-6 rounded-xl border border-dashed border-ink/15 p-10 text-center text-sm text-ink/40">
                  No items in your wishlist yet.
                </div>
              ) : (
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {wishlistItems.map((item) => {
                    const finalPrice = item.discountPrice || item.price;
                    const mainImage = getMainImage(item);

                    return (
                      <div
                        key={item._id}
                        className="flex flex-col gap-4 rounded-2xl border border-ink/10 p-4"
                      >
                        <div className="flex gap-4">
                          <Link
                            to={`/products/${item._id}`}
                            className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-mist"
                          >
                            {mainImage?.url ? (
                              <img
                                src={imageSrc(mainImage.url)}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-[10px] text-ink/30">
                                No image
                              </div>
                            )}
                          </Link>

                          <div className="flex flex-1 flex-col justify-between">
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <Link
                                  to={`/products/${item._id}`}
                                  className="line-clamp-1 font-medium hover:underline"
                                >
                                  {item.title}
                                </Link>
                                <div className="mt-1 flex items-center gap-2 font-mono text-sm">
                                  <span className="text-ink">
                                    ৳{finalPrice}
                                  </span>
                                  {item.discountPrice && (
                                    <span className="text-ink/40 line-through">
                                      ৳{item.price}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <button
                                onClick={() => removeWishlistItem(item._id)}
                                className="text-ink/30 hover:text-red-600"
                                aria-label="Remove from wishlist"
                              >
                                <X size={18} />
                              </button>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => addToCart(item)}
                          className="flex h-10 w-full items-center justify-center gap-2 rounded-full bg-ink text-sm font-semibold text-white hover:bg-ink/90"
                        >
                          <ShoppingBag size={15} />
                          Add to cart
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* =========================
              Orders
          ========================= */}
          {active === "orders" && (
            <>
              <h1 className="font-display text-xl font-bold">
                Your orders
              </h1>

              <p className="mt-1 text-sm text-ink/60">
                Your order history will appear here.
              </p>

              <div className="mt-6 rounded-xl border border-dashed border-ink/15 p-10 text-center text-sm text-ink/40">
                No orders to show yet.
              </div>
            </>
          )}
        </section>
      </div>

      {/* =========================
          Logout Confirmation
      ========================= */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">

            <h3 className="font-display text-lg font-bold">
              Log out?
            </h3>

            <p className="mt-2 text-sm text-ink/60">
              You'll need to sign in again to access your account.
            </p>

            <div className="mt-6 flex gap-3">

              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="h-11 flex-1 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-mist"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmLogout}
                className="h-11 flex-1 rounded-xl bg-red-600 text-sm font-semibold text-white hover:bg-red-700"
              >
                Log out
              </button>

            </div>
          </div>
        </div>
      )}
    </Container>
  );
}
