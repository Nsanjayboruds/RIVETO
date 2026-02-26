import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopDataContext } from '../context/ShopContext';
import { RiDeleteBin6Line, RiAddLine, RiSubtractLine, RiShoppingBag3Line } from "react-icons/ri";
import { FaArrowLeft, FaShoppingBasket } from "react-icons/fa";
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toast } from 'react-toastify';

gsap.registerPlugin(ScrollTrigger);

function Cart() {
  const { product, currency, cartItem, UpdateQuantity } = useContext(shopDataContext);
  const [cartData, setCartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const sectionRef = useRef(null);

  useEffect(() => {
    const tempData = [];
    for (const productId in cartItem) {
      for (const size in cartItem[productId]) {
        const quantity = cartItem[productId][size];
        if (quantity > 0) {
          tempData.push({
            _id: productId,
            size: size,
            quantity: quantity,
          });
        }
      }
    }
    setCartData(tempData);
    setIsLoading(false);
  }, [cartItem]);

  useEffect(() => {
    if (!isLoading) {
      gsap.fromTo(".cart-item",
        { opacity: 0, y: 50, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            toggleActions: "play none none none"
          }
        }
      );
    }
  }, [cartData, isLoading]);

  const handleQuantityChange = (productId, size, newQuantity) => {
    if (newQuantity < 0) return;
    
    if (newQuantity === 0) {
      if (window.confirm('Are you sure you want to remove this item from your cart?')) {
        UpdateQuantity(productId, size, 0);
        toast.error("Item removed from cart");
      }
    } else {
      UpdateQuantity(productId, size, newQuantity);
      if (newQuantity > 1) {
        toast.success("Quantity updated");
      }
    }
  };

  const calculateItemTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-100 dark:from-gray-900 dark:via-[#0f172a] dark:to-[#0c4a6e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-700 dark:text-cyan-200 text-lg">Loading your cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={sectionRef} className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-100 dark:from-gray-900 dark:via-[#0f172a] dark:to-[#0c4a6e] pt-24 pb-20 px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <Title text1={"SHOPPING"} text2={"CART"} />
          <p className="text-cyan-700 dark:text-cyan-100 mt-4">Review and manage your items</p>
        </div>

        {/* Back to Shopping Button */}
        <button
          onClick={() => navigate('/collection')}
          className="flex items-center gap-2 px-6 py-3 bg-slate-200 dark:bg-gray-800 hover:bg-slate-300 dark:hover:bg-gray-700 text-slate-800 dark:text-white rounded-xl mb-8 transition-colors"
        >
          <FaArrowLeft className="w-4 h-4" />
          Continue Shopping
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartData.length === 0 ? (
              <div className="text-center py-16 bg-white/80 dark:bg-gray-800/30 rounded-2xl border border-slate-200 dark:border-gray-700/40">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center">
                  <FaShoppingBasket className="text-slate-500 dark:text-gray-600 text-3xl" />
                </div>
                <h3 className="text-slate-900 dark:text-white text-xl font-semibold mb-2">Your cart is empty</h3>
                <p className="text-slate-600 dark:text-gray-400 mb-6">Looks like you haven't added anything to your cart yet</p>
                <button
                  onClick={() => navigate('/collection')}
                  className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-colors font-semibold"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartData.map((item, index) => {
                  const productData = product.find(p => p._id === item._id);

                  if (!productData) {
                    return (
                      <div key={index} className="cart-item bg-red-100 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-2xl p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-red-400 font-medium">Product not available</p>
                            <p className="text-red-500 dark:text-red-300 text-sm">ID: {item._id}</p>
                          </div>
                          <button
                            onClick={() => UpdateQuantity(item._id, item.size, 0)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <RiDeleteBin6Line className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div key={index} className="cart-item bg-gradient-to-br from-white to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 p-6 hover:border-cyan-400/30 transition-all duration-500">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <img
                            src={productData.image1 || '/fallback.jpg'}
                            onError={(e) => e.target.src = '/fallback.jpg'}
                            alt={productData.name}
                            className="w-24 h-24 object-cover rounded-xl shadow-lg border border-slate-200 dark:border-white/10"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-2">{productData.name}</h3>
                          <div className="flex flex-wrap gap-4 text-sm text-slate-700 dark:text-gray-300 mb-3">
                            <span className="bg-cyan-100 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 px-3 py-1 rounded-full">Size: {item.size}</span>
                            <span className="bg-blue-100 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">SKU: {productData._id.slice(-6)}</span>
                          </div>
                          <p className="text-cyan-400 font-bold text-xl mb-3">
                            {currency}{calculateItemTotal(productData.price, item.quantity)}
                          </p>
                          <p className="text-slate-500 dark:text-gray-400 text-sm">
                            {currency}{productData.price} × {item.quantity}
                          </p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end justify-between">
                          <button
                            onClick={() => handleQuantityChange(item._id, item.size, 0)}
                            className="text-red-400 hover:text-red-300 transition-colors mb-4"
                            aria-label="Remove item"
                          >
                            <RiDeleteBin6Line className="w-5 h-5" />
                          </button>

                          <div className="flex items-center gap-3 bg-slate-200 dark:bg-gray-700 rounded-xl p-2">
                            <button
                              onClick={() => handleQuantityChange(item._id, item.size, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center bg-slate-300 dark:bg-gray-600 hover:bg-slate-400 dark:hover:bg-gray-500 rounded-lg transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <RiSubtractLine className="w-4 h-4" />
                            </button>

                            <span className="w-8 text-center font-bold text-slate-900 dark:text-white">{item.quantity}</span>

                            <button
                              onClick={() => handleQuantityChange(item._id, item.size, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center bg-slate-300 dark:bg-gray-600 hover:bg-slate-400 dark:hover:bg-gray-500 rounded-lg transition-colors"
                              aria-label="Increase quantity"
                            >
                              <RiAddLine className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-gradient-to-br from-white to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <RiShoppingBag3Line className="w-5 h-5 text-cyan-400" />
                  Order Summary
                </h3>
                
                <CartTotal />
                
                <button
                  className={`w-full mt-6 py-4 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                    cartData.length > 0
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
                      : 'bg-slate-300 dark:bg-gray-600 text-slate-500 dark:text-gray-400 cursor-not-allowed '
                  }`}
                  onClick={() => {
                    if (cartData.length > 0) {
                      navigate("/placeorder");
                    }
                  }}
                  disabled={cartData.length === 0}
                >
                  {cartData.length > 0 ? (
                    <>Proceed to Checkout</>
                  ) : (
                    <>Add items to checkout</>
                  )}
                </button>

                {cartData.length > 0 && (
                  <p className="text-center text-slate-500 dark:text-gray-400 text-sm mt-4">
                    🚚 Free shipping on orders over {currency}50
                  </p>
                )}
              </div>

              {/* Security Badges */}
              <div className="bg-gradient-to-br from-white to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 p-6">
                <h4 className="text-slate-900 dark:text-white font-semibold mb-4">Secure Shopping</h4>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-green-100 dark:bg-green-500/10 rounded-lg">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-sm">🔒</span>
                    </div>
                    <p className="text-green-400 text-xs">SSL Secure</p>
                  </div>
                  <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-white text-sm">💳</span>
                    </div>
                    <p className="text-blue-400 text-xs">Safe Payment</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;