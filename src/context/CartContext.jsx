import { createContext, useContext, useState, useEffect, useCallback } from "react";
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

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    const userId = getUserId();
    if (!userId) {
      setCart([]);
      setLoading(false);
      return;
    }
    try {
      const res = await axios.get(`${API_ORIGIN}/api/v1/cart/single/${userId}`);
      setCart(res.data.cart || []);
    } catch (error) {
      console.log("Cart fetch error:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // First load + login/logout hole cart abar fetch
  useEffect(() => {
    fetchCart();
    window.addEventListener("login", fetchCart);
    window.addEventListener("logout", fetchCart);
    return () => {
      window.removeEventListener("login", fetchCart);
      window.removeEventListener("logout", fetchCart);
    };
  }, [fetchCart]);

  // ---------- ADD ----------
  const addToCart = async (productId) => {
    const userId = getUserId();
    if (!userId) return { ok: false, message: "Not logged in" };
    try {
      await axios.post(`${API_ORIGIN}/api/v1/cart/create`, {
        proid: productId,
        userid: userId,
      });
      await fetchCart();
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error.response?.data?.message || "Could not add to cart",
      };
    }
  };

  // ---------- INCREMENT / DECREMENT ----------
  const updateQuantity = async (item, type) => {
    try {
      await axios.post(`${API_ORIGIN}/api/v1/cart/update/${item._id}`, {
        type, // "plus" | "minus"
        userid: getUserId(),
      });
      await fetchCart(); // populated product + fresh stock/price shoho abar ney
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error.response?.data?.message || "Could not update quantity",
      };
    }
  };

  // ---------- DELETE ONE ----------
  const removeItem = async (id) => {
    try {
      await axios.delete(`${API_ORIGIN}/api/v1/cart/delete/${id}`);
      setCart((prev) => prev.filter((c) => c._id !== id));
      return { ok: true };
    } catch (error) {
      return {
        ok: false,
        message: error.response?.data?.message || "Could not remove item",
      };
    }
  };

  // ---------- CLEAR ALL ----------
  const clearCart = async () => {
    const results = await Promise.allSettled(
      cart.map((c) => axios.delete(`${API_ORIGIN}/api/v1/cart/delete/${c._id}`))
    );
    // jegulo delete hoyeche shegulo remove, fail hole cart e thakbe
    const failedIds = cart
      .filter((_, idx) => results[idx].status === "rejected")
      .map((c) => c._id);
    setCart((prev) => prev.filter((c) => failedIds.includes(c._id)));
  };

  const totalAmount = cart.reduce((sum, i) => sum + Number(i.totalPrice || 0), 0);
  const cartCount = cart.length; // koyta alada product ache (wishlist er moto)

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
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
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}