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

  // UPDATED: Now supports multiple additions of the same item
  const addToCart = (product) => {
    setCart((prevCart) => {
      const exists = prevCart.find((item) => item._id === product._id);
      let newCart;

      if (exists) {
        // If it exists, map through and increase quantity
        newCart = prevCart.map((item) =>
          item._id === product._id 
            ? { ...item, quantity: (item.quantity || 1) + 1 } 
            : item
        );
      } else {
        // If it's new, add it with initial quantity of 1
        newCart = [...prevCart, { ...product, quantity: 1 }];
      }

      localStorage.setItem("b2b_cart", JSON.stringify(newCart));
      return newCart;
    });
  };

  // NEW: Function to manually change quantity (used in Cart.jsx)
  const updateQuantity = (id, newQty) => {
    if (newQty < 1) {
      removeFromCart(id); // Remove if quantity goes below 1
      return;
    }
    
    const newCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: newQty } : item
    );
    updateCart(newCart);
  };

  const removeFromCart = (id) => {
    const newCart = cart.filter((item) => item._id !== id);
    updateCart(newCart);
  };

  const clearCart = () => {
    updateCart([]);
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addToCart, 
        removeFromCart, 
        updateQuantity, // Added to provider
        clearCart 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;