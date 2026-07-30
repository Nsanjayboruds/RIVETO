import { useContext } from 'react';
import { useLocation, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { RiPriceTag3Line } from 'react-icons/ri';
import './App.css';
import 'react-toastify/dist/ReactToastify.css';

import { userDataContext } from './context/UserContext';
import { shopDataContext } from './context/ShopContext';

// Components
import Nav from './components/Nav';
import BackToTop from './components/BackToTop';
import Login from './pages/Login';
import Registration from './pages/Registration';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import About from './pages/About';
import Wishlist from './pages/wishlist';
import Collections from './pages/Collections';
import NewArrivals from './pages/NewArrivals';
import BestSellers from './pages/BestSellers';
import Recommendations from './pages/Recommendations';
import Product from './pages/Product';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import PlaceOrder from './pages/PlaceOrder';
import FaqPage from './pages/FaqPage';
import Order from './pages/Order';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndServices from './pages/TermsAndServices';
import SizeGuide from './pages/SizeGuide';
import CookiePolicy from './pages/CookiePolicy';
import Contributors from './pages/Contributors';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import SavedAddresses from './pages/SavedAddresses';
import Ai from './components/Ai';
import ComparisonPanel from './components/ComparisonPanel';
import ScrollProgressBar from "./components/ScrollProgressBar";
import CommandPalette from './components/CommandPalette';

function App() {
  const { userData } = useContext(userDataContext);
  const {
    compareList,
    comparePanelOpen,
    toggleComparePanel,
    removeFromCompare,
  } = useContext(shopDataContext);
  const location = useLocation();
  const hideNavRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];
  const isRoot = location.pathname === '/';
  const shouldHideNav = isRoot || hideNavRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
  const shouldShowNav = !shouldHideNav;

  return (
    <>
      <ScrollProgressBar />
      <ToastContainer position="top-center" autoClose={2000} />
      <CommandPalette />
      {shouldShowNav && <Nav />}

      <Routes>
        {/* Auth routes */}
        <Route
          path="/login"
          element={
            userData ? (
              <Navigate to={location.state?.from || '/home'} />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/signup"
          element={
            userData ? (
              <Navigate to={location.state?.from || '/home'} />
            ) : (
              <Registration />
            )
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:resetToken" element={<ResetPassword />} />

        {/* Public landing page — no auth required */}
        <Route
          path="/"
          element={userData ? <Navigate to="/home" replace /> : <LandingPage />}
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            userData ? (
              <Home />
            ) : (
              <Navigate to="/login" state={{ from: '/home' }} />
            )
          }
        />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route
          path="/notifications"
          element={
            userData ? (
              <Notifications />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />
        <Route
          path="/about"
          element={
            userData ? (
              <About />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />
        <Route
          path="/collection"
          element={
            userData ? (
              <Collections />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />
        <Route
          path="/new-arrivals"
          element={
            userData ? (
              <NewArrivals />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />
        <Route
          path="/best-sellers"
          element={
            userData ? (
              <BestSellers />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />
        <Route
          path="/recommendations"
          element={
            userData ? (
              <Recommendations />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />
        <Route
          path="/product"
          element={
            userData ? (
              <Product />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />
        <Route
          path="/contact"
          element={
            userData ? (
              <Contact />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />

        <Route
          path="/productdetail/:productId"
          element={
            userData ? (
              <ProductDetail />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />
        <Route
          path="/cart"
          element={
            userData ? (
              <Cart />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />
        <Route
          path="/placeorder"
          element={
            userData ? (
              <PlaceOrder />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />
        <Route
          path="/faq"
          element={
            userData ? (
              <FaqPage />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />

        <Route
          path="/order"
          element={
            userData ? (
              <Order />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />

        <Route
          path="/saved-addresses"
          element={
            userData ? (
              <SavedAddresses />
            ) : (
              <Navigate to="/login" state={{ from: '/saved-addresses' }} />
            )
          }
        />

        {/* Public routes - Legal pages should be accessible without login */}
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/privicypolicy" element={<Navigate to="/privacypolicy" replace />} />
        <Route path="/terms" element={<TermsAndServices />} />
        <Route path="/termsandservices" element={<TermsAndServices />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />
        <Route path="/contributors" element={<Contributors />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Ai />
      <BackToTop />

      {/* Global Comparison Floating Button */}
      {compareList.length > 0 && !comparePanelOpen && (
        <div className="fixed bottom-6 right-6 z-100">
          <button
            onClick={() => toggleComparePanel(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-6 py-3 rounded-full shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-all hover:scale-105 border border-cyan-400/50 animate-bounce-short"
          >
            <RiPriceTag3Line className="text-xl" />
            <span className="font-bold">Compare ({compareList.length})</span>
          </button>
        </div>
      )}

      {/* Global Comparison Panel */}
      {comparePanelOpen && (
        <ComparisonPanel
          compareList={compareList}
          onClose={() => toggleComparePanel(false)}
          removeProduct={removeFromCompare}
        />
      )}
    </>
  );
}

export default App;
