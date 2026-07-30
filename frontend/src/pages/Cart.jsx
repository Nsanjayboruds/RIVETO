import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { shopDataContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import CartTotal from '../components/CartTotal';
import { LoadingState, EmptyState, ErrorState } from '../components/StateComponents';
import { FaArrowLeft, FaShoppingBasket, FaTruck, FaLock, FaShieldAlt } from 'react-icons/fa';
import { RiDeleteBin6Line, RiSubtractLine, RiAddLine, RiShoppingBag3Line } from 'react-icons/ri';
import { MdLocalOffer } from 'react-icons/md';

function Cart() {
  const { product, currency, cartItem, UpdateQuantity, loadingCart, cartError, getUserCart, clearCartData } =
    useContext(shopDataContext);
  const [cartData, setCartData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

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

  const handleQuantityChange = (productId, size, newQuantity) => {
    if (newQuantity < 0) return;

    if (newQuantity === 0) {
      if (
        window.confirm(
          'Are you sure you want to remove this item from your cart?'
        )
      ) {
        UpdateQuantity(productId, size, 0);
        toast.error('Item removed from cart');
      }
    } else {
      UpdateQuantity(productId, size, newQuantity);
      if (newQuantity > 1) {
        toast.success('Quantity updated');
      }
    }
  };

  const handleClearCart = async () => {
  if (window.confirm('Are you sure you want to completely empty your cart?')) {
    await clearCartData();
  }
};

  const calculateItemTotal = (price, quantity) => {
    return (price * quantity).toFixed(2);
  };

  if (cartError) {
    return (
      <div className="min-h-screen bg-[#0b1220] flex items-center justify-center pt-24 px-4">
        <ErrorState 
          title="Failed to Load Cart" 
          message={cartError} 
          onRetry={getUserCart} 
        />
      </div>
    );
  }

  if (isLoading || loadingCart) {
    return (
      <div className="min-h-screen bg-[#0b1220] pt-28 pb-20 px-4 md:px-10">
        <div className="max-w-7xl mx-auto">
          <LoadingState type="list" count={3} message="Loading your cart..." />
        </div>
      </div>
    );
  }

  return (
    <main
      className="min-h-screen bg-[#0b1220] pt-24 pb-20 px-4"
      aria-labelledby="cart-page-title"
    >
      <div className="max-w-7xl mx-auto">
        {/* Dynamic Header with Clear Cart Button */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              id="cart-page-title"
              className="text-3xl md:text-4xl font-bold text-white mb-2"
            >
              Shopping Cart
            </h1>
            <p className="text-gray-400">
              Review and manage your items before checkout
            </p>
          </div>

          {cartData.length > 0 && (
            <button
              type="button"
              onClick={handleClearCart}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 rounded-lg transition-all duration-200 self-start sm:self-center font-medium text-sm"
            >
              <RiDeleteBin6Line className="w-4 h-4" />
              Clear Cart
            </button>
          )}
        </div>

        {/* Back to Shopping Button */}
        <button
          type="button"
          onClick={() => navigate('/collection')}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#0f172a] hover:bg-[#1a2332] border border-[#1f2a44] text-gray-300 hover:text-white rounded-lg mb-8 transition-all duration-200"
        >
          <FaArrowLeft className="w-4 h-4" aria-hidden="true" />
          Continue Shopping
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {cartData.length === 0 ? (
              <EmptyState
                icon={FaShoppingBasket}
                title="Your cart is empty"
                description="Looks like you haven't added anything to your cart yet. Let's find some awesome gear!"
                actionText="Start Shopping"
                onAction={() => navigate('/collection')}
              />
            ) : (
              <ul className="space-y-4" aria-label="Cart items">
                {cartData.map((item, index) => {
                  const productData = product.find((p) => p._id === item._id);

                  if (!productData) {
                    return (
                      <li
                        key={index}
                        className="bg-red-500/10 border border-red-500/30 rounded-lg p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-red-400 font-medium">
                              Product not available
                            </p>
                            <p className="text-red-500 dark:text-red-300 text-sm">
                              ID: {item._id}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              UpdateQuantity(item._id, item.size, 0)
                            }
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            <RiDeleteBin6Line className="w-5 h-5" />
                          </button>
                        </div>
                      </li>
                    );
                  }

                  const itemLabel = `${productData.name}, size ${item.size}`;

                  return (
                    <li
                      key={index}
                      className="bg-[#0f172a] border border-[#1f2a44] rounded-lg p-5 hover:border-blue-500/40 transition-all duration-200"
                    >
                      <div className="flex flex-col md:flex-row gap-5">
                        {/* Product Image */}
                        <div className="shrink-0">
                          <img
                            src={productData.image1 || '/fallback.jpg'}
                            onError={(e) => (e.target.src = '/fallback.jpg')}
                            alt={productData.name}
                            className="w-24 h-24 object-cover rounded-lg border border-[#1f2a44]"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1">
                          <h3 className="text-white font-semibold text-lg mb-2">
                            {productData.name}
                          </h3>
                          <div className="flex flex-wrap gap-2 text-sm mb-3">
                            <span className="px-2.5 py-1 bg-[#111c33] border border-[#1f2a44] text-gray-300 rounded">
                              Size: {item.size}
                            </span>
                            <span className="px-2.5 py-1 bg-[#111c33] border border-[#1f2a44] text-gray-400 rounded text-xs">
                              SKU: {productData._id.slice(-6)}
                            </span>
                          </div>
                          <div className="flex items-baseline gap-3">
                            <p className="text-white font-bold text-xl">
                              {currency}
                              {calculateItemTotal(
                                productData.price,
                                item.quantity
                              )}
                            </p>
                            <p className="text-gray-500 text-sm">
                              {currency}
                              {productData.price} × {item.quantity}
                            </p>
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex flex-col items-end justify-between">
                          <button
                            type="button"
                            onClick={() =>
                              handleQuantityChange(item._id, item.size, 0)
                            }
                            className="text-red-400 hover:text-red-500 transition-colors p-2"
                            aria-label={`Remove ${itemLabel} from cart`}
                          >
                            <RiDeleteBin6Line
                              className="w-5 h-5"
                              aria-hidden="true"
                            />
                          </button>

                          <div
                            className="flex items-center gap-3 bg-slate-200 dark:bg-gray-700 rounded-xl p-2"
                            role="group"
                            aria-label={`Quantity for ${itemLabel}`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.size,
                                  item.quantity - 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center bg-slate-300 dark:bg-gray-600 hover:bg-slate-400 dark:hover:bg-gray-500 rounded-lg transition-colors"
                              aria-label={`Decrease quantity for ${itemLabel}`}
                            >
                              <RiSubtractLine
                                className="w-4 h-4 text-gray-400"
                                aria-hidden="true"
                              />
                            </button>

                            <span
                              className="w-8 text-center font-bold text-slate-900 dark:text-white"
                              aria-live="polite"
                              aria-atomic="true"
                            >
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                handleQuantityChange(
                                  item._id,
                                  item.size,
                                  item.quantity + 1
                                )
                              }
                              className="w-8 h-8 flex items-center justify-center bg-slate-300 dark:bg-gray-600 hover:bg-slate-400 dark:hover:bg-gray-500 rounded-lg transition-colors"
                              aria-label={`Increase quantity for ${itemLabel}`}
                            >
                              <RiAddLine
                                className="w-4 h-4 text-gray-400"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <div className="bg-linear-to-br from-white to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 p-6">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                  <RiShoppingBag3Line className="w-5 h-5 text-cyan-400" />
                  Order Summary
                </h3>

                <CartTotal />

                <button
                  type="button"
                  className={`w-full mt-6 py-3.5 rounded-lg font-semibold transition-all duration-200 ${
                    cartData.length > 0
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-[#111c33] border border-[#1f2a44] text-gray-500 cursor-not-allowed'
                  }`}
                  onClick={() => {
                    if (cartData.length > 0) {
                      navigate('/placeorder');
                    }
                  }}
                  disabled={cartData.length === 0}
                  aria-disabled={cartData.length === 0}
                >
                  {cartData.length > 0
                    ? 'Proceed to Checkout'
                    : 'Add items to checkout'}
                </button>

                {cartData.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-[#1f2a44]">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <FaTruck className="w-4 h-4 text-green-400" />
                      <span>Free shipping on orders over {currency}50</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="bg-[#0f172a] border border-[#1f2a44] rounded-lg p-5">
                <h4 className="text-sm font-semibold text-white mb-4">
                  Secure Checkout
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-green-500/10 border border-green-500/30 rounded flex items-center justify-center shrink-0">
                      <FaLock className="w-3.5 h-3.5 text-green-400" />
                    </div>
                    <span className="text-gray-300">
                      256-bit SSL encryption
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/30 rounded flex items-center justify-center shrink-0">
                      <FaShieldAlt className="w-3.5 h-3.5 text-blue-400" />
                    </div>
                    <span className="text-gray-300">Buyer protection</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 bg-purple-500/10 border border-purple-500/30 rounded flex items-center justify-center shrink-0">
                      <MdLocalOffer className="w-3.5 h-3.5 text-purple-400" />
                    </div>
                    <span className="text-gray-300">Best price guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
export default Cart;