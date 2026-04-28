import { BrowserRouter, Route, Routes } from 'react-router-dom';

import CartToast from './components/CartToast.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Footer from './sections/Footer.jsx';
import Navbar from './sections/Navbar.jsx';
import CartPage from './pages/CartPage.jsx';
import CheckoutPage from './pages/CheckoutPage.jsx';
import HomePage from './pages/HomePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProductDetailsPage from './pages/ProductDetailsPage.jsx';
import ProductsPage from './pages/ProductsPage.jsx';
import SupportPage from './pages/SupportPage.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:id" element={<ProductDetailsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <CartToast />
        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}
