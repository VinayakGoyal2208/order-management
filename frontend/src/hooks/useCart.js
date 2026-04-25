import { useContext } from "react";
import { CartContext } from "../context/cartContextbase";

export const useCart = () => useContext(CartContext);