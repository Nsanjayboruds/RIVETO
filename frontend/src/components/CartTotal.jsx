import React, { useContext, useState, useEffect } from 'react';
import { shopDataContext } from '../context/ShopContext';
import Title from './Title';
import { FaShippingFast, FaPercentage, FaGift } from 'react-icons/fa';
import { RiCoupon2Line, RiArrowRightSLine } from 'react-icons/ri';
import gsap from 'gsap';

function CartTotal() {
  const { currency, delivery_fee, getCartAmount } = useContext(shopDataContext);
  const [discountCode, setDiscountCode] = useState('');
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const subtotal = getCartAmount();
  const shippingFee = subtotal > 0 ? delivery_fee : 0;
  const discount = hasDiscount ? Math.min(subtotal * 0.1, 50) : 0; // 10% discount, max $50
  const total = subtotal > 0 ? subtotal + shippingFee - discount : 0;

  useEffect(() => {
    // Animation for the totals container
    gsap.fromTo('.cart-totals-container',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );
  }, []);

  const applyDiscount = () => {
    if (discountCode.toUpperCase() === 'SAVE10') {
      setHasDiscount(true);
      setDiscountAmount(Math.min(subtotal * 0.1, 50));
      gsap.fromTo('.discount-applied',
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
    } else {
      setHasDiscount(false);
      setDiscountAmount(0);
    }
  };

  const removeDiscount = () => {
    setHasDiscount(false);
    setDiscountAmount(0);
    setDiscountCode('');
  };

  return (
    <div className='w-full'>
      <div className='text-center mb-6'>
        <Title text1={'ORDER'} text2={'SUMMARY'} />
      </div>

      <div className='cart-totals-container bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6 shadow-xl'>
        {/* Discount Code Section */}
        <div className='mb-6'>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className='flex items-center justify-between w-full text-left text-cyan-300 hover:text-cyan-200 transition-colors'
          >
            <div className='flex items-center gap-2'>
              <RiCoupon2Line className='w-5 h-5' />
              <span className='font-medium'>Apply Discount Code</span>
            </div>
            <RiArrowRightSLine className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>

          {isExpanded && (
            <div className='mt-4 p-4 bg-gray-700/50 rounded-xl'>
              <div className='flex gap-2'>
                <input
                  type='text'
                  placeholder='Enter code: SAVE10'
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  className='flex-1 px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                />
                <button
                  onClick={applyDiscount}
                  className='px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition-colors font-medium'
                >
                  Apply
                </button>
              </div>
              {hasDiscount && (
                <div className='discount-applied mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center justify-between'>
                  <div className='flex items-center gap-2 text-green-400'>
                    <FaPercentage className='w-4 h-4' />
                    <span>10% discount applied!</span>
                  </div>
                  <button
                    onClick={removeDiscount}
                    className='text-red-400 hover:text-red-300 text-sm'
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Order Summary Items */}
        <div className='space-y-4'>
          {/* Subtotal */}
          <div className='flex justify-between items-center py-3'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center'>
                <FaGift className='w-4 h-4 text-blue-400' />
              </div>
              <span className='text-gray-300'>Subtotal</span>
            </div>
            <span className='text-white font-semibold'>{currency}{subtotal.toFixed(2)}</span>
          </div>

          {/* Shipping */}
          <div className='flex justify-between items-center py-3 border-t border-gray-700'>
            <div className='flex items-center gap-3'>
              <div className='w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center'>
                <FaShippingFast className='w-4 h-4 text-green-400' />
              </div>
              <span className='text-gray-300'>Shipping</span>
            </div>
            <span className='text-white font-semibold'>
              {subtotal > 0 ? `${currency}${shippingFee.toFixed(2)}` : 'Free'}
            </span>
          </div>

          {/* Discount */}
          {hasDiscount && (
            <div className='flex justify-between items-center py-3 border-t border-gray-700'>
              <div className='flex items-center gap-3'>
                <div className='w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center'>
                  <RiCoupon2Line className='w-4 h-4 text-red-400' />
                </div>
                <span className='text-gray-300'>Discount (10%)</span>
              </div>
              <span className='text-green-400 font-semibold'>-{currency}{discountAmount.toFixed(2)}</span>
            </div>
          )}

          {/* Total */}
          <div className='flex justify-between items-center py-4 border-t border-gray-600 mt-2'>
            <span className='text-lg font-semibold text-white'>Total</span>
            <div className='text-right'>
              <div className='text-2xl font-bold text-cyan-400'>
                {currency}{total.toFixed(2)}
              </div>
              {subtotal > 0 && (
                <div className='text-sm text-gray-400 mt-1'>
                  {hasDiscount ? 'Including discount' : 'Excluding taxes'}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Free Shipping Progress */}
        {subtotal > 0 && subtotal < 50 && (
          <div className='mt-6 p-4 bg-cyan-500/10 rounded-xl border border-cyan-500/20'>
            <div className='flex items-center justify-between mb-2'>
              <span className='text-cyan-300 text-sm font-medium'>Free shipping on orders over {currency}50</span>
              <span className='text-cyan-400 text-sm'>{currency}{(50 - subtotal).toFixed(2)} to go!</span>
            </div>
            <div className='w-full bg-gray-700 rounded-full h-2'>
              <div 
                className='bg-gradient-to-r from-cyan-500 to-blue-600 h-2 rounded-full transition-all duration-1000'
                style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className='mt-6 text-center'>
          <p className='text-gray-400 text-sm'>
            📦 Orders typically ship within 24 hours
          </p>
          <p className='text-gray-400 text-sm mt-1'>
            🔒 Secure checkout with 256-bit SSL encryption
          </p>
        </div>
      </div>
    </div>
  );
}

export default CartTotal;