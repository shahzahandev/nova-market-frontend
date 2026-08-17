import { createContext, useContext, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // TODO: swap these for real API calls (POST /cart, PATCH /cart/:id, DELETE /cart/:id)
  // once your backend is connected — the shape and call sites won't need to change.
  const addToCart = (product) => {
    setCartItems((items) => {
      const existing = items.find((i) => i._id === product._id);
      if (existing) {
        return items.map((i) =>
          i._id === product._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...items, { ...product, quantity: 1 }];
    });
  };

  const increaseQuantity = (id) =>
    setCartItems((items) =>
      items.map((i) => (i._id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );

  const decreaseQuantity = (id) =>
    setCartItems((items) =>
      items.map((i) =>
        i._id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
      )
    );

  const removeItem = (id) =>
    setCartItems((items) => items.filter((i) => i._id !== id));

  const clearCart = () => setCartItems([]);

  const subtotal = cartItems.reduce(
    (sum, i) => sum + Number(i.discountPrice || i.price) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increaseQuantity,
        decreaseQuantity,
        removeItem,
        clearCart,
        subtotal,
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
