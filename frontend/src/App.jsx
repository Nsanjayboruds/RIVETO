import { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

import { userDataContext } from './context/UserContext';
import { shopDataContext } from './context/ShopContext';

// Components
import Nav from './components/Nav';
import BackToTop from './components/BackToTop';
import Ai from './components/Ai';
import ComparisonPanel from './components/ComparisonPanel';
import { RiPriceTag3Line } from 'react-icons/ri';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import About from './pages/About';
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
import Wishlist from './pages/wishlist';
import PrivicyPolicy from './pages/PrivicyPolicy';
import TermsAndServices from './pages/TermsAndServices';
import SizeGuide from './pages/SizeGuide';
import CookiePolicy from './pages/CookiePolicy';
import Contributors from './pages/Contributors';
import NotFound from './pages/NotFound';

function App() {
  const { userData } = useContext(userDataContext);
  const {
    compareList,
    comparePanelOpen,
    toggleComparePanel,
    removeFromCompare,
  } = useContext(shopDataContext);
  const location = useLocation();
  const hideNavRoutes = ['/login', '/signup'];
  const shouldShowNav = !hideNavRoutes.includes(location.pathname);

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      {shouldShowNav && <Nav />}

      <Routes>
        {/* Auth routes */}
        <Route
          path="/login"
          element={
            userData ? <Navigate to={location.state?.from || '/'} /> : <Login />
          }
        />
        <Route
          path="/signup"
          element={
            userData ? (
              <Navigate to={location.state?.from || '/'} />
            ) : (
              <Registration />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            userData ? (
              <Home />
            ) : (
              <Navigate to="/login" state={{ from: location.pathname }} />
            )
          }
        />
        <Route path="/wishlist" element={<Wishlist />} />
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

        {/* Public routes - Legal pages should be accessible without login */}
        <Route path="/privicypolicy" element={<PrivicyPolicy />} />
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
