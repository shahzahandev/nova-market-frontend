
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import axios from "axios";

const API_ORIGIN = "https://nova-market-backend-2.onrender.com";
const CartContext = createContext(null);

function getUserId() {
  try {
    const account = localStorage.getItem("account");
    if (!account) return null;

    return JSON.parse(account)?._id || null;
  } catch {
    return null;
  }
}

// Product-er latest selling price calculate kore
function getCurrentPrice(product) {
  if (!product) return 0;

  const price = Number(product.price) || 0;
  const discountPrice = Number(product.discountPrice) || 0;

  if (discountPrice <= 0 || discountPrice >= price) {
    return price;
  }

  const now = new Date();
  const start = product.discountStartDate
    ? new Date(product.discountStartDate)
    : null;
  const end = product.discountEndDate
    ? new Date(product.discountEndDate)
    : null;

  // Discount-er date set na thakle discount active noy
  if (
    !start ||
    !end ||
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime())
  ) {
    return price;
  }

  if (now >= start && now <= end) {
    return discountPrice;
  }

  return price;
}

// Backend-er cart data normalize kore
function normalizeCart(cartItems = []) {
  return cartItems.map((item) => {
    const product = item.product;
    const quantity = Number(item.quantity) || 1;

    // Product populated na hole stale total-er upor depend korbo na
    if (!product || typeof product !== "object") {
      return {
        ...item,
        quantity,
        priceNeedsRefresh: true,
      };
    }

    const currentPrice = getCurrentPrice(product);

    return {
      ...item,
      quantity,
      currentPrice,
      totalPrice: currentPrice * quantity,
      priceNeedsRefresh: false,
    };
  });
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCart = useCallback(async () => {
    const userId = getUserId();

    if (!userId) {
      setCart([]);
      setLoading(false);
      setRefreshing(false);
      return { ok: true, cart: [] };
    }

    setRefreshing(true);

    try {
      const res = await axios.get(
        `${API_ORIGIN}/api/v1/cart/single/${userId}`,
        {
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );

      const latestCart = normalizeCart(res.data?.cart || []);

      setCart(latestCart);

      return {
        ok: true,
        cart: latestCart,
      };
    } catch (error) {
      console.error(
        "Cart fetch error:",
        error.response?.data || error.message
      );

      return {
        ok: false,
        message:
          error.response?.data?.message || "Could not refresh cart",
      };
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load + login/logout + browser tab focus
  useEffect(() => {
    fetchCart();

    const handleFocus = () => {
      fetchCart();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchCart();
      }
    };

    window.addEventListener("login", handleFocus);
    window.addEventListener("logout", handleFocus);
    window.addEventListener("focus", handleFocus);

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener("login", handleFocus);
      window.removeEventListener("logout", handleFocus);
      window.removeEventListener("focus", handleFocus);

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [fetchCart]);

  // ---------- ADD ----------
  const addToCart = async (productId) => {
    const userId = getUserId();

    if (!userId) {
      return { ok: false, message: "Not logged in" };
    }

    try {
      await axios.post(`${API_ORIGIN}/api/v1/cart/create`, {
        proid: productId,
        userid: userId,
      });

      const result = await fetchCart();

      if (!result.ok) {
        return {
          ok: false,
          message: "Added, but could not refresh cart",
        };
      }

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message:
          error.response?.data?.message || "Could not add to cart",
      };
    }
  };

  // ---------- INCREMENT / DECREMENT ----------
  const updateQuantity = async (item, type) => {
    try {
      await axios.post(
        `${API_ORIGIN}/api/v1/cart/update/${item._id}`,
        {
          type,
          userid: getUserId(),
        }
      );

      const result = await fetchCart();

      if (!result.ok) {
        return {
          ok: false,
          message: "Quantity updated, but cart refresh failed",
        };
      }

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message:
          error.response?.data?.message ||
          "Could not update quantity",
      };
    }
  };

  // ---------- DELETE ONE ----------
  const removeItem = async (id) => {
    try {
      await axios.delete(
        `${API_ORIGIN}/api/v1/cart/delete/${id}`
      );

      setCart((prev) => prev.filter((item) => item._id !== id));

      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message:
          error.response?.data?.message || "Could not remove item",
      };
    }
  };

  // ---------- CLEAR ALL ----------
  const clearCart = async () => {
    const results = await Promise.allSettled(
      cart.map((item) =>
        axios.delete(
          `${API_ORIGIN}/api/v1/cart/delete/${item._id}`
        )
      )
    );

    const failedIds = cart
      .filter((_, index) => results[index].status === "rejected")
      .map((item) => item._id);

    setCart((prev) =>
      prev.filter((item) => failedIds.includes(item._id))
    );

    return {
      ok: failedIds.length === 0,
      failedIds,
    };
  };

  // Latest populated product-er price diye total
  const totalAmount = cart.reduce((sum, item) => {
    if (item.priceNeedsRefresh) {
      return sum + Number(item.totalPrice || 0);
    }

    return sum + Number(item.totalPrice || 0);
  }, 0);

  const cartCount = cart.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        refreshing,
        totalAmount,
        cartCount,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used inside <CartProvider>");
  }

  return ctx;
}
