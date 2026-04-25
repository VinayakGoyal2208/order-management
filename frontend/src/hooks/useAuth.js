import { useContext } from "react";
import { AuthContext } from "../context/authContextbase";

export const useAuth = () => useContext(AuthContext);