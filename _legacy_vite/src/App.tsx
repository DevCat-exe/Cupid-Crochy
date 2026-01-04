import React from "react";
import { Navigate, Route, Routes, useRoutes } from "react-router-dom";
import routes from "tempo-routes";
import LoginForm from "./components/auth/LoginForm";
import Dashboard from "./components/pages/dashboard";
import Success from "./components/pages/success";
import Home from "./components/pages/home";
import { AuthProvider, useAuth } from "../supabase/auth";
import { CartProvider } from "./components/cart/CartProvider";
import ProductsPage from "./components/shop/ProductsPage";
import ProductDetail from "./components/shop/ProductDetail";
import ContactPage from "./components/pages/ContactPage";
import CheckoutPage from "./components/pages/CheckoutPage";
import OrderTrackingPage from "./components/pages/OrderTrackingPage";
import AdminPage from "./components/pages/AdminPage";
import AdminProductsPage from "./components/pages/AdminProductsPage";
import AdminOrdersPage from "./components/pages/AdminOrdersPage";
import AdminSettingsPage from "./components/pages/AdminSettingsPage";

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5DDEB]/30">
        <div className="animate-pulse text-[#5B1A1A]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        {/* Signup route removed as we're using pre-created admin accounts */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/success" element={<Success />} />
        <Route path="/shop" element={<ProductsPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-tracking" element={<OrderTrackingPage />} />

        {/* Admin Routes */}
        <Route path="/admin">
          <Route
            index
            element={
              <PrivateRoute>
                <AdminPage />
              </PrivateRoute>
            }
          />
          <Route
            path="products"
            element={
              <PrivateRoute>
                <AdminProductsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="orders"
            element={
              <PrivateRoute>
                <AdminOrdersPage />
              </PrivateRoute>
            }
          />
          {/* Categories section removed as requested */}
          <Route
            path="settings"
            element={
              <PrivateRoute>
                <AdminSettingsPage />
              </PrivateRoute>
            }
          />
        </Route>
      </Routes>
      {import.meta.env.VITE_TEMPO && useRoutes(routes)}
    </>
  );
}

function App() {
  return <AppRoutes />;
}

export default App;
