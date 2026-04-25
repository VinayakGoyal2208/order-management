import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

import Login from "./pages/auth/Login";

// USER
import Home from "./pages/user/Home";
import Menu from "./pages/user/Menu";
import Cart from "./pages/user/Cart";
import Orders from "./pages/user/Orders";

// ADMIN
import AdminDashboard from "./pages/admin/Dashboard";
import ManageUsers from "./pages/admin/ManageUsers";
import ManageRestaurants from "./pages/admin/ManageRestaurants";
import CreateRestaurant from "./pages/admin/CreateRestaurant";

// RESTAURANT
import RestaurantDashboard from "./pages/restaurant/Dashboard";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route
        path="/menu/:id"
        element={user ? <Menu /> : <Navigate to="/login" />}
      />
      <Route path="/login" element={<Login />} />

      {/* USER PROTECTED */}
      <Route
        path="/cart"
        element={user ? <Cart /> : <Navigate to="/login" />}
      />
      <Route
        path="/orders"
        element={user ? <Orders /> : <Navigate to="/login" />}
      />

      {/* ROLE BASED */}
      <Route
        path="/admin"
        element={
          user?.role === "admin" ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route
        path="/admin/users"
        element={<ManageUsers />}
      />

      <Route
        path="/admin/restaurants"
        element={ <ManageRestaurants />}
      />

      <Route
        path="/admin/create-restaurant"
        element={<CreateRestaurant />}
      />



      <Route
        path="/restaurant"
        element={
          user?.role === "restaurant" ? (
            <RestaurantDashboard />
          ) : (
            <Navigate to="/" />
          )
        }
      />
    </Routes>
  );
}

export default App;