import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Package, LogOut } from "lucide-react";
import Container from "../components/Container";
import { FormField, SubmitButton, FormMessage } from "../components/FormField";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const NAV = [
  { key: "profile", label: "Profile", icon: User },
  { key: "orders", label: "Orders", icon: Package },
  { key: "logout", label: "Logout", icon: LogOut },
];

export default function Profile() {
  const { userInfo, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("profile");
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    email: userInfo?.email || "",
    phone: userInfo?.phone || "",
    address: userInfo?.address || "",
    city: userInfo?.city || "",
    postalCode: userInfo?.postalCode || "",
  });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setSaving(true);
      await api.patch(`/user/update/${userInfo.id}`, formData);
      setSuccess("Profile updated.");
    } catch (err) {
      setError(err.response?.data?.message || "Could not save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleNavClick = (key) => {
    if (key === "logout") return setShowLogoutConfirm(true);
    setActive(key);
  };

  const confirmLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Container className="py-10">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-2xl border border-ink/10 p-3">
          <nav className="flex gap-2 overflow-x-auto md:flex-col">
            {NAV.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleNavClick(key)}
                className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  key === "logout"
                    ? "text-red-600 hover:bg-red-50"
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

        <section className="rounded-2xl border border-ink/10 p-6 sm:p-8">
          {active === "profile" && (
            <>
              <h1 className="font-display text-xl font-bold">Your profile</h1>
              <p className="mt-1 text-sm text-ink/60">Update your personal information.</p>

              <form onSubmit={handleSave} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <FormField label="Full name" name="name" value={formData.name} onChange={handleChange} />
                  <FormField label="Email" name="email" value={formData.email} onChange={handleChange} />
                  <FormField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
                  <FormField label="City" name="city" value={formData.city} onChange={handleChange} />
                  <FormField label="Postal code" name="postalCode" value={formData.postalCode} onChange={handleChange} />
                  <div className="sm:col-span-2">
                    <FormField label="Address" name="address" value={formData.address} onChange={handleChange} />
                  </div>
                </div>

                {error && <FormMessage>{error}</FormMessage>}
                {success && <FormMessage type="success">{success}</FormMessage>}

                <div className="sm:w-48">
                  <SubmitButton loading={saving}>Save changes</SubmitButton>
                </div>
              </form>
            </>
          )}

          {active === "orders" && (
            <>
              <h1 className="font-display text-xl font-bold">Your orders</h1>
              <p className="mt-1 text-sm text-ink/60">Wire this up to GET /order/mine when your backend's ready.</p>
              <div className="mt-6 rounded-xl border border-dashed border-ink/15 p-10 text-center text-sm text-ink/40">
                No orders to show yet.
              </div>
            </>
          )}
        </section>
      </div>

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6">
            <h3 className="font-display text-lg font-bold">Log out?</h3>
            <p className="mt-2 text-sm text-ink/60">You'll need to sign in again to access your account.</p>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="h-11 flex-1 rounded-xl border border-ink/10 text-sm font-semibold hover:bg-mist"
              >
                Cancel
              </button>
              <button
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
