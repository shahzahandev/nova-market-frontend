import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import { StoreInfoProvider } from "./context/StoreInfoContext";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./components/About";
import WhatsAppButton from "./components/WhatsAppButton";



import Home from "./pages/Home";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Cart from "./pages/Cart";
import Profile from "./pages/Profile";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import EmailVerify from "./pages/EmailVerify";
import ProductDetails from "./pages/ProductDetails";
import Wishlist from "./pages/Wishlist";
import Contact from "./components/Contact";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFail from "./pages/PaymentFail";
import PaymentCancel from "./pages/PaymentCancel";


import Terms from "./pages/Terms";
import Shhiping from "./pages/Shipping";
import Careers from "./pages/Careers";
import PrivacyPolicy from "./pages/PrivacyPolicy";


function StoreLayout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreInfoProvider>
      <CartProvider>
        <BrowserRouter>
          <WishlistProvider>
            <Routes>
              <Route element={<StoreLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/productDetails/:id" element={<ProductDetails />} />
                <Route path="/products/:id" element={<SingleProduct />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/about" element={<About />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/payment/success" element={<PaymentSuccess />} />
                <Route path="/payment/fail" element={<PaymentFail />} />
                <Route path="/payment/cancel" element={<PaymentCancel />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/shhiping" element={<Shhiping />} />
                <Route path="/privacyPolicy" element={<PrivacyPolicy />} />
                <Route path="/careers" element={<Careers />} />
              </Route>

              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/resetpassword/:token" element={<ResetPassword />} />
              <Route path="/verifyemail/:token" element={<EmailVerify />} />
            </Routes>
          </WishlistProvider>
        </BrowserRouter>
      </CartProvider>
      </StoreInfoProvider>
    </AuthProvider>
  );
}
