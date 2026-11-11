import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react";

import Home from "./pages/user/Home";

import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Loader from "./components/common/Loader";

const VendorDetails = lazy(() => import("./pages/user/VendorDetails"));
const Cart = lazy(() => import("./pages/user/Cart"));
const Orders = lazy(() => import("./pages/user/Orders"));
const Profile = lazy(() => import("./pages/user/Profile"));
const VendorDashboard = lazy(() => import("./pages/vendor/Dashboard"));
const VendorOrders = lazy(() => import("./pages/vendor/Orders"));
const VendorPayments = lazy(() => import("./pages/vendor/VendorPayments"));
const Products = lazy(() => import("./pages/vendor/Products"));
const AddProduct = lazy(() => import("./pages/vendor/AddProduct"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AdminOrders = lazy(() => import("./pages/admin/UserOrders"));
const Users = lazy(() => import("./pages/admin/Users"));
const Vendors = lazy(() => import("./pages/admin/Vendors"));
const AddVendor = lazy(() => import("./pages/admin/AddVendor"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));

function App() {
  return (
    <>
      <Suspense fallback={<Loader fullPage />}>
        <Routes>
          {/* ================= USER (PUBLIC) ================= */}
          <Route path="/" element={<Home />} />
          <Route path="/vendor/:id" element={<VendorDetails />} />

          {/* ================= AUTH ================= */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ================= USER (PROTECTED) ================= */}
          <Route path="/cart" element={<ProtectedRoute role="user"><Cart /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute role="user"><Orders /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute role="user"><Profile /></ProtectedRoute>} />

          {/* ================= VENDOR ================= */}
          <Route path="/vendor-dashboard" element={<ProtectedRoute role="vendor"><VendorDashboard /></ProtectedRoute>} />
          <Route path="/vendor-orders" element={<ProtectedRoute role="vendor"><VendorOrders /></ProtectedRoute>} />

          {/* LEDGER ROUTE */}
          <Route path="/vendor-payments" element={<ProtectedRoute role="vendor"><VendorPayments /></ProtectedRoute>} />

          <Route path="/vendor-products" element={<ProtectedRoute role="vendor"><Products /></ProtectedRoute>} />
          <Route path="/add-product" element={<ProtectedRoute role="vendor"><AddProduct /></ProtectedRoute>} />

          {/* ================= ADMIN ================= */}
          <Route path="/admin-dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin-users" element={<ProtectedRoute role="admin"><Users /></ProtectedRoute>} />
          <Route path="/admin-orders" element={<ProtectedRoute role="admin"><AdminOrders /></ProtectedRoute>} />
          <Route path="/admin-vendors" element={<ProtectedRoute role="admin"><Vendors /></ProtectedRoute>} />
          <Route path="/add-vendor" element={<ProtectedRoute role="admin"><AddVendor /></ProtectedRoute>} />

          {/* ================= FALLBACK ================= */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <SpeedInsights />
    </>
  );
}

export default App;