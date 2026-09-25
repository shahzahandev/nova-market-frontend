import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";
const WishlistContext = createContext();

// Matches SignIn.jsx: localStorage.setItem("account", JSON.stringify(res.data.existingUser))
const USER_STORAGE_KEY = "account";

function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);    
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function WishlistProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(getStoredUser());
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(() =>
    Boolean(getStoredUser()?._id || getStoredUser()?.userId)
  );
  const [error, setError] = useState("");
  const userId = user?._id || user?.userId;


  useEffect(() => {
    const syncUser = () => setUser(getStoredUser());
    window.addEventListener("storage", syncUser);
    window.addEventListener("login", syncUser);
    window.addEventListener("logout", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("login", syncUser);
      window.removeEventListener("logout", syncUser);
    };
  }, []);

  const fetchWishlist = useCallback(async () => {
    if (!userId) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(
        `${API_ORIGIN}/api/v1/wishlist/singleWishlist/${userId}`
      );
      const items = res.data?.data || [];
      const mapped = items
        .filter((entry) => entry.productId)
        .map((entry) => ({
          ...entry.productId,
          _wishlistId: entry._id
        }));
      setWishlistItems(mapped);
    } catch (err) {
      console.log("Wishlist fetch error:", err);
      setError(
        "Couldn't load your wishlist. try again in a moment."
      );
    } finally {
      setLoading(false);
    }
  }, [userId]);


  useEffect(() => {
    if (userId) {
      fetchWishlist();
    } else {
      setWishlistItems([]);
    }
  }, [userId, fetchWishlist]);

  const isInWishlist = (productId) =>
    wishlistItems.some((item) => item._id === productId);

  const toggleItem = async (product) => {
    if (!userId) {
      navigate("/signin");
      return;
    }

    const existing = wishlistItems.find((item) => item._id === product._id);

    if (existing) {
      setWishlistItems((prev) =>
        prev.filter((item) => item._id !== product._id)
      );
      try {
        await axios.delete(
          `${API_ORIGIN}/api/v1/wishlist/deleteWishlist/${existing._wishlistId}`
        );
      } catch (error) {
        console.log("Wishlist remove error:", error);
        fetchWishlist(); // revert on failure
      }
    } else {
      setWishlistItems((prev) => [
        ...prev,
        { ...product, _wishlistId: null },
      ]);
      try {
        const res = await axios.post(
          `${API_ORIGIN}/api/v1/wishlist/createWishlist`,
          { userId, productId: product._id }
        );
        const newId = res.data?.data?._id;
        setWishlistItems((prev) =>
          prev.map((item) =>
            item._id === product._id
              ? { ...item, _wishlistId: newId }
              : item
          )
        );
      } catch (error) {
        console.log("Wishlist add error:", error);
        fetchWishlist(); // revert on failure (also covers 409 duplicate)
      }
    }
  };

  const removeItem = async (productId) => {
    if (!userId) return;
    const existing = wishlistItems.find((item) => item._id === productId);
    if (!existing) return;

    setWishlistItems((prev) => prev.filter((item) => item._id !== productId));
    try {
      await axios.delete(
        `${API_ORIGIN}/api/v1/wishlist/deleteWishlist/${existing._wishlistId}`
      );
    } catch (error) {
      console.log("Wishlist remove error:", error);
      fetchWishlist();
    }
  };

  const clearWishlist = async () => {
    if (!userId) return;
    const previous = wishlistItems;
    setWishlistItems([]);
    try {
      // no bulk-delete route on the backend yet, so one delete per item
      await Promise.all(
        previous.map((item) =>
          axios.delete(
            `${API_ORIGIN}/api/v1/wishlist/deleteWishlist/${item._wishlistId}`
          )
        )
      );
    } catch (error) {
      console.log("Wishlist clear error:", error);
      fetchWishlist();
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        loading,
        error,
        isLoggedIn: Boolean(userId),
        isInWishlist,
        toggleItem,
        removeItem,
        clearWishlist,
        refreshWishlist: fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
