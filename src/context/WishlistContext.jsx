import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext();

const STORAGE_KEY = "wishlist_items";

export function WishlistProvider({ children }) {
  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistItems));
    } catch {
      // ignore storage errors
    }
  }, [wishlistItems]);

  const addItem = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) return prev;
      return [...prev, product];
    });
  };

  const removeItem = (id) => {
    setWishlistItems((prev) => prev.filter((item) => item._id !== id));
  };

  const toggleItem = (product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item._id === product._id);
      if (exists) return prev.filter((item) => item._id !== product._id);
      return [...prev, product];
    });
  };

  const isInWishlist = (id) => wishlistItems.some((item) => item._id === id);

  const clearWishlist = () => setWishlistItems([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
