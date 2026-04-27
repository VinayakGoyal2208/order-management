import { createContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 1. Initialize cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("b2b_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (err) {
        console.error("Failed to parse cart data", err);
      }
    }
  }, []);

  // 2. Helper to update state and storage simultaneously
  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("b2b_cart", JSON.stringify(newCart));
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item._id === product._id);
      if (exists) {
        alert("This item is already in your cart.");
        return prevCart;
      }
      
      const newCart = [...prevCart, product];
      localStorage.setItem("b2b_cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter((item) => item._id !== id);
    updateCart(newCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;