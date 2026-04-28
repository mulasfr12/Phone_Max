import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import CartToast from './components/CartToast.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Footer from './sections/Footer.jsx';
import Navbar from './sections/Navbar.jsx';

const HomePage = lazy(() => import('./pages/HomePage.jsx'));
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage.jsx'));
const CartPage = lazy(() => import('./pages/CartPage.jsx'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage.jsx'));
const SupportPage = lazy(() => import('./pages/SupportPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));
const AdminDashboardPage = lazy(
  () => import('./pages/admin/AdminDashboardPage.jsx'),
);
const AdminProductsPage = lazy(
  () => import('./pages/admin/AdminProductsPage.jsx'),
);
const AdminOrdersPage = lazy(() => import('./pages/admin/AdminOrdersPage.jsx'));
const AdminCategoriesPage = lazy(
  () => import('./pages/admin/AdminCategoriesPage.jsx'),
);

function PageFallback() {
  return (
    <main className="grid min-h-96 place-items-center bg-zinc-50 px-5 py-20">
      <div className="rounded-lg border border-zinc-200 bg-white px-6 py-5 text-sm font-semibold text-zinc-600 shadow-sm shadow-zinc-950/5">
        Loading Luxora
      </div>
    </main>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <ScrollToTop />
        <Navbar />
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/products/:id" element={<ProductDetailsPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/products" element={<AdminProductsPage />} />
            <Route path="/admin/orders" element={<AdminOrdersPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        <CartToast />
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}
