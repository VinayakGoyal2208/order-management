import { useState } from "react";
import { CartContext } from "./cartContextbase";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart((prev) => {
      const exist = prev.find((i) => i._id === item._id);

      if (exist) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, qty: i.qty + 1 } : i
        );
      }

      return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i._id !== id));
  };

  const updateQty = (id, type) => {
    setCart((prev) =>
      prev.map((i) =>
        i._id === id
          ? {
              ...i,
              qty: type === "inc" ? i.qty + 1 : Math.max(1, i.qty - 1),
            }
          : i
      )
    );
  };

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, updateQty, total }}
    >
      {children}
    </CartContext.Provider>
  );
};