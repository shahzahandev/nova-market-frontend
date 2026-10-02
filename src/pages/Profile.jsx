import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Package, LogOut } from "lucide-react";
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

// =========================
// Helpers
// =========================

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

const formatPrice = (price) =>
  `৳${Number(price || 0).toLocaleString("en-BD")}`;

const STATUS_STYLES = {
  pending: "bg-yellow-50 text-yellow-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-indigo-50 text-indigo-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-600",
};

const NAV = [
  { key: "profile", label: "Profile", icon: User },
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
const POSTAL_CODE_REGEX = /^\d{4}$/;

export default function Profile() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const {
    wishlistItems,
    loading: wishlistLoading,
    error: wishlistError,
    refreshWishlist,
  } = useWishlist();

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
  // Orders State
  // =========================

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState("");

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

        if (!/^[A-Za-zÀ-ÿ\u0980-\u09FF\s.'-]+$/.test(trimmedValue)) {
          return "Please enter a valid name.";
        }

        return "";

      case "phone": {
        if (!trimmedValue) {
          return "Phone number is required.";
        }

        const normalizedPhone = trimmedValue.replace(/[\s-]/g, "");

        if (!BD_PHONE_REGEX.test(normalizedPhone)) {
          return "Enter a valid Bangladesh mobile number, e.g. 01712345678.";
        }

        return "";
      }

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

    if (name === "phone") {
      newValue = value.replace(/[^\d+\s-]/g, "");
    }

    if (name === "postalCode") {
      newValue = value.replace(/\D/g, "").slice(0, 4);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setError("");
    setSuccess("");

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
      const storedAccount = JSON.parse(
        localStorage.getItem("account")
      );

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
          `${API_ORIGIN}/api/v1/user/singleUser/${accountInfo._id}`
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
  // Fetch User Orders
  // =========================

  useEffect(() => {
    if (active !== "orders" || !accountInfo?._id) return;

    let cancelled = false;

    const getOrders = async () => {
      try {
        setOrdersLoading(true);
        setOrdersError("");

        const res = await axios.get(
          `${API_ORIGIN}/api/v1/order/getSingleUserOrders/${accountInfo._id}`
        );

        // Your backend response:
        // {
        //   success: true,
        //   orders: [...]
        // }

        const userOrders = Array.isArray(res.data.orders)
          ? res.data.orders
          : [];

        if (!cancelled) {
          setOrders(userOrders);
        }
      } catch (err) {
        console.error("Orders fetch error:", err);

        if (cancelled) return;

        if (err.response?.status === 404) {
          setOrders([]);
          setOrdersError("");
        } else {
          setOrdersError(
            err.response?.data?.message ||
              "Could not load your orders."
          );
        }
      } finally {
        if (!cancelled) {
          setOrdersLoading(false);
        }
      }
    };

    getOrders();

    return () => {
      cancelled = true;
    };
  }, [active, accountInfo?._id]);

  // =========================
  // Update Profile
  // =========================

  const handleSave = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

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
        `${API_ORIGIN}/api/v1/user/updateUser/${accountInfo._id}`,
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

      setFormData({
        name: updatedUser.name || "",
        email: updatedUser.email || formData.email || "",
        phone: updatedUser.phone || "",
        city: updatedUser.city || "",
        postalCode: updatedUser.postalCode || "",
        address: updatedUser.address || "",
      });

      setErrors(EMPTY_ERRORS);

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
    navigate("/");
  };

  return (
    <Container className="py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">

        {/* =========================
            Sidebar
        ========================= */}

        <aside className="h-fit rounded-2xl border border-ink/10 p-3">
          <nav className="grid grid-cols-2 gap-2 overflow-x-auto md:flex md:flex-col">
            {NAV.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleNavClick(key)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  key === "logout"
                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                    : active === key
                    ? "bg-brand-400 text-white"
                    : "text-ink/70 hover:bg-mist"
                }`}
              >
                <Icon size={18} />
                {label}
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

                  {error && (
                    <FormMessage type="error">
                      {error}
                    </FormMessage>
                  )}

                  {success && (
                    <FormMessage type="success">
                      <div className="px-2 py-2">
                        {success}
                      </div>
                    </FormMessage>
                  )}

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
              Orders
          ========================= */}

          {active === "orders" && (
            <>
              <h1 className="font-display text-xl font-bold">
                Your orders
              </h1>

              <p className="mt-1 text-sm text-ink/60">
                Here you can see all your orders.
              </p>

              {/* Loading */}
              {ordersLoading && (
                <div className="mt-6 rounded-xl border border-ink/10 p-8 text-center">
                  <p className="text-sm text-ink/50">
                    Loading your orders...
                  </p>
                </div>
              )}

              {/* Error */}
              {!ordersLoading && ordersError && (
                <div className="mt-6">
                  <FormMessage type="error">
                    {ordersError}
                  </FormMessage>
                </div>
              )}

              {/* Empty */}
              {!ordersLoading &&
                !ordersError &&
                orders.length === 0 && (
                  <div className="mt-6 rounded-xl border border-dashed border-ink/15 p-10 text-center">
                    <Package
                      size={40}
                      className="mx-auto text-ink/20"
                    />

                    <p className="mt-3 text-sm font-medium text-ink/60">
                      No orders found
                    </p>

                    <p className="mt-1 text-xs text-ink/40">
                      Your order history will appear here.
                    </p>
                  </div>
                )}

              {/* Orders */}
              {!ordersLoading &&
                !ordersError &&
                orders.length > 0 && (
                  <div className="mt-6 space-y-5">

                    {orders.map((order) => {
                      const status = String(
                        order.status || "pending"
                      ).toLowerCase();

                      const products = Array.isArray(order.products)
                        ? order.products
                        : [];

                      const subtotal = Number(
                        order.subTotal || 0
                      );

                      const deliveryCharge = Number(
                        order.deliveryCharge || 0
                      );

                      const totalPrice = Number(
                        order.totalPrice || 0
                      );

                      return (
                        <div
                          key={order._id}
                          className="overflow-hidden rounded-2xl border border-ink/10 bg-white"
                        >

                          {/* =========================
                              Order Header
                          ========================= */}

                          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink/10 bg-mist/30 px-4 py-4 sm:px-5">

                            <div>
                              <p className="text-sm font-bold">
                                Order #
                                {String(order._id)
                                  .slice(-8)
                                  .toUpperCase()}
                              </p>

                              <p className="mt-1 text-xs text-ink/50">
                                {formatDate(order.createdAt)}
                              </p>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                STATUS_STYLES[status] ||
                                "bg-mist text-ink/70"
                              }`}
                            >
                              {status}
                            </span>
                          </div>

                          {/* =========================
                              Products
                          ========================= */}
                          <div className="px-4 sm:px-5">
                            {products.length > 0 ? (
                              <div className="divide-y divide-ink/5">
                                {products.map((product) => {
                                  const quantity = Number(
                                    product.quantity || 1
                                  );

                                  const itemTotal = Number(
                                    product.totalPrice || 0
                                  );

                                  return (
                                    <div
                                      key={product._id}
                                      className="flex items-center justify-between gap-4 py-4">
                                      <div className="min-w-0 flex justify-between gap-4">
                                        <p className="truncate text-sm font-medium text-ink">
                                          {product.title}
                                        </p>

                                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-ink/50">
                                          <span>
                                            Qty: {quantity}
                                          </span>
                                        </div>
                                      </div>

                                      <p className="shrink-0 text-sm font-semibold">
                                        {formatPrice(itemTotal)}
                                      </p>

                                    </div>
                                  );
                                })}

                              </div>
                            ) : (
                              <p className="py-5 text-sm text-ink/40">
                                No products found in this order.
                              </p>
                            )}

                          </div>

                          {/* =========================
                              Order Summary
                          ========================= */}

                          <div className="border-t border-ink/10 bg-mist/20 px-4 py-4 sm:px-5">
                            <div className="ml-auto max-w-sm space-y-2 text-sm">
                              {/* Delivery */}
                              <div className="flex justify-between gap-4">
                                <span className="text-ink/60">
                                  Delivery
                                </span>

                                <span className="font-medium">
                                  {deliveryCharge === 0
                                    ? "Free"
                                    : formatPrice(
                                        deliveryCharge
                                      )}
                                </span>
                              </div>


                              {/* Total */}
                              <div className="flex justify-between gap-4">
                                <span className="font-semibold">
                                  Total
                                </span>
                                <span className="text-base font-bold">
                                  {formatPrice(totalPrice)}
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* =========================
                              Transaction
                          ========================= */}

                          {order.tranId && (
                            <div className="flex justify-between border-t border-ink/10 px-4 py-3 sm:px-5">
                              <p className="text-xs text-ink/40">
                                Transaction ID:{" "}
                                {
                                  order.paymentMethod == "cod" ? 'Not Avaiable' : 
                                  <span className="font-medium text-ink/60">
                                  {order.tranId}
                                </span>
                                }
                              </p>
                              
                              {/* Payment Method */}
                              {order.paymentMethod && (
                                <div className="text-xs">
                               {
                                order.paymentMethod == "cod" ?
                                   <span className="text-ink/60">
                                   Cash On Delivery <span className="font-bold">({order.paymentMethod})</span> 
                                  </span> :
                                     <span className="text-ink/60">
                                    Paid By <span className="font-bold">{order.paymentMethod}</span> 
                                  </span>
                               }
                                </div>
                              )}
                            </div>
                          )}

                        </div>
                      );
                    })}

                  </div>
                )}
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