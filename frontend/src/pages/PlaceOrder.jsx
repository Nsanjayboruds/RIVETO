import React, { useContext, useState, useEffect } from 'react';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { shopDataContext } from '../context/ShopContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  FaMoneyBillWave, 
  FaMapMarkerAlt, 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCity, 
  FaGlobe,
  FaLock,
  FaShippingFast,
  FaCheckCircle
} from 'react-icons/fa';
import { RiSecurePaymentLine, RiCoupon2Line } from 'react-icons/ri';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function PlaceOrder() {
  const [method, setMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();
  
  const { cartItem, setCartItem, getCartAmount, delivery_fee, product: products } = useContext(shopDataContext);
  const { serverUrl, userData } = useContext(authDataContext);

  const [formData, setFormData] = useState({
    firstname: userData?.name?.split(' ')[0] || '',
    lastname: userData?.name?.split(' ')[1] || '',
    email: userData?.email || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phone: userData?.phone || ''
  });

  useEffect(() => {
    // Animations
    gsap.fromTo('.form-section',
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, ease: "power3.out" }
    );

    gsap.fromTo('.payment-section',
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 1, ease: "power3.out", delay: 0.3 }
    );

    gsap.fromTo('.payment-method',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "back.out(1.7)" }
    );
  }, []);

  const validateForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    const pincodeRegex = /^\d{6}$/;

    if (!formData.firstname) errors.firstname = 'First name is required';
    if (!formData.lastname) errors.lastname = 'Last name is required';
    if (!formData.email) errors.email = 'Email is required';
    if (!emailRegex.test(formData.email)) errors.email = 'Invalid email format';
    if (!formData.street) errors.street = 'Street address is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.pincode) errors.pincode = 'Pincode is required';
    if (!pincodeRegex.test(formData.pincode)) errors.pincode = 'Invalid pincode';
    if (!formData.country) errors.country = 'Country is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!phoneRegex.test(formData.phone)) errors.phone = 'Invalid phone number';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(data => ({ ...data, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      let orderItems = [];

      for (const productId in cartItem) {
        for (const size in cartItem[productId]) {
          if (cartItem[productId][size] > 0) {
            const itemInfo = structuredClone(products.find(product => product._id === productId));
            if (itemInfo) {
              itemInfo.size = size;
              itemInfo.quantity = cartItem[productId][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      const orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        paymentMethod: method,
        status: 'Placed'
      };

      const result = await axios.post(`${serverUrl}/api/order/placeorder`, orderData, { withCredentials: true });
      if (result.data) {
        setCartItem({});
        navigate("/order");
      }

    } catch (error) {
      console.error('Error placing order:', error);
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: FaMoneyBillWave,
      description: 'Pay when you receive your order',
      color: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-900 via-[#0f172a] to-[#0c4a6e] pt-24 pb-20 px-4'>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Title text1={'COMPLETE'} text2={'YOUR ORDER'} />
          <p className="text-cyan-100 mt-4">Almost there! Review your details and complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div className="form-section">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <FaMapMarkerAlt className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">Delivery Information</h2>
              </div>

              <form onSubmit={onSubmitHandler} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">First Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={onChangeHandler}
                        placeholder="First name"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        required
                      />
                    </div>
                    {formErrors.firstname && <p className="text-red-400 text-sm mt-1">{formErrors.firstname}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Last Name</label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={onChangeHandler}
                        placeholder="Last name"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        required
                      />
                    </div>
                    {formErrors.lastname && <p className="text-red-400 text-sm mt-1">{formErrors.lastname}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Email Address</label>
                  <div className="relative">
                    <FaEnvelope className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={onChangeHandler}
                      placeholder="Email address"
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>
                  {formErrors.email && <p className="text-red-400 text-sm mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Street Address</label>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="street"
                      value={formData.street}
                      onChange={onChangeHandler}
                      placeholder="Street address"
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>
                  {formErrors.street && <p className="text-red-400 text-sm mt-1">{formErrors.street}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">City</label>
                    <div className="relative">
                      <FaCity className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={onChangeHandler}
                        placeholder="City"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        required
                      />
                    </div>
                    {formErrors.city && <p className="text-red-400 text-sm mt-1">{formErrors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={onChangeHandler}
                      placeholder="State"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                    {formErrors.state && <p className="text-red-400 text-sm mt-1">{formErrors.state}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Pincode</label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={onChangeHandler}
                      placeholder="Pincode"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                    {formErrors.pincode && <p className="text-red-400 text-sm mt-1">{formErrors.pincode}</p>}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">Country</label>
                    <div className="relative">
                      <FaGlobe className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={onChangeHandler}
                        placeholder="Country"
                        className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        required
                      />
                    </div>
                    {formErrors.country && <p className="text-red-400 text-sm mt-1">{formErrors.country}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">Phone Number</label>
                  <div className="relative">
                    <FaPhone className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={onChangeHandler}
                      placeholder="Phone number"
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                  </div>
                  {formErrors.phone && <p className="text-red-400 text-sm mt-1">{formErrors.phone}</p>}
                </div>
              </form>
            </div>
          </div>

          {/* Payment Section */}
          <div className="payment-section">
            <div className="sticky top-24 space-y-8">
              {/* Order Summary */}
              <CartTotal />

              {/* Payment Methods */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <RiSecurePaymentLine className="w-6 h-6 text-cyan-400" />
                  <h2 className="text-2xl font-bold text-white">Payment Method</h2>
                </div>

                <div className="space-y-4">
                  {paymentMethods.map((payment) => {
                    const IconComponent = payment.icon;
                    return (
                      <div
                        key={payment.id}
                        className={`payment-method cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 ${
                          method === payment.id
                            ? `border-cyan-500 bg-cyan-500/10`
                            : 'border-gray-600 hover:border-gray-500'
                        }`}
                        onClick={() => setMethod(payment.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${payment.color} flex items-center justify-center`}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">{payment.name}</h3>
                            <p className="text-gray-400 text-sm">{payment.description}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            method === payment.id ? 'bg-cyan-500 border-cyan-500' : 'border-gray-500'
                          }`}></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Security Badges */}
                <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <FaLock className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">256-bit SSL secured payment</span>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={onSubmitHandler}
                disabled={isProcessing}
                className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                  isProcessing
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white'
                }`}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </div>
                ) : (
                  `Place Order • ${getCartAmount() + delivery_fee}`
                )}
              </button>

              {/* Additional Info */}
              <div className="text-center">
                <p className="text-gray-400 text-sm flex items-center justify-center gap-2">
                  <FaShippingFast className="w-4 h-4" />
                  Free shipping on orders over $50
                </p>
                <p className="text-gray-400 text-sm mt-1 flex items-center justify-center gap-2">
                  <FaCheckCircle className="w-4 h-4" />
                  30-day money-back guarantee
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceOrder;
