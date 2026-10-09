import { useContext, useState, useEffect } from 'react';
import { shopDataContext } from '../context/ShopContext';
import apiConfig from '../utils/apiConfig';
import { useNavigate } from 'react-router-dom';
import { FaMoneyBillWave } from 'react-icons/fa';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { userDataContext } from '../context/UserContext';
import {
  FaCheckCircle,
  FaCity,
  FaEnvelope,
  FaGlobe,
  FaLock,
  FaMapMarkerAlt,
  FaPhone,
  FaShippingFast,
  FaUser,
} from 'react-icons/fa';
import { RiSecurePaymentLine } from 'react-icons/ri';
import Title from '../components/Title';
import CartTotal from '../components/CartTotal';
import { toast } from 'react-toastify';

gsap.registerPlugin(ScrollTrigger);

function PlaceOrder() {
  const [method, setMethod] = useState('cod');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // Saved addresses
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const {
    cartItem,
    setCartItem,
    getCartAmount,
    delivery_fee,
    product: products,
    currency,
  } = useContext(shopDataContext);
  const { userData } = useContext(userDataContext);

  const [formData, setFormData] = useState({
    firstname: userData?.name?.split(' ')[0] || '',
    lastname: userData?.name?.split(' ')[1] || '',
    email: userData?.email || '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    phone: userData?.phone || '',
  });

  useEffect(() => {
    // Fetch saved addresses
    apiConfig.get('/user/address').then((res) => {
      setSavedAddresses(res.data);
      // Pre-select the default address if one exists
      const def = res.data.find((a) => a.isDefault);
      if (def) {
        setSelectedAddressId(def._id);
        setFormData({
          firstname: def.fullName.split(' ')[0] || '',
          lastname: def.fullName.split(' ').slice(1).join(' ') || '',
          email: userData?.email || '',
          street: def.street,
          city: def.city,
          state: def.state,
          pincode: def.pincode,
          country: def.country,
          phone: def.phone,
        });
      }
    }).catch(() => {
      // Non-critical — user can still enter address manually
    });

    // Animations
    gsap.fromTo(
      '.form-section',
      { opacity: 0, x: -50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out' }
    );

    gsap.fromTo(
      '.payment-section',
      { opacity: 0, x: 50 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.3 }
    );

    gsap.fromTo(
      '.payment-method',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'back.out(1.7)' }
    );
  }, [userData]);

  const onSelectSavedAddress = (address) => {
    setSelectedAddressId(address._id);
    setFormData({
      firstname: address.fullName.split(' ')[0] || '',
      lastname: address.fullName.split(' ').slice(1).join(' ') || '',
      email: userData?.email || '',
      street: address.street,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
      country: address.country,
      phone: address.phone,
    });
    setFormErrors({});
  };

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
    if (!pincodeRegex.test(formData.pincode))
      errors.pincode = 'Invalid pincode';
    if (!formData.country) errors.country = 'Country is required';
    if (!formData.phone) errors.phone = 'Phone number is required';
    if (!phoneRegex.test(formData.phone)) errors.phone = 'Invalid phone number';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData((data) => ({ ...data, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
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
            const itemInfo = structuredClone(
              products.find((product) => product._id === productId)
            );
            if (itemInfo) {
              itemInfo.itemId = itemInfo._id;
              itemInfo.size = size;
              itemInfo.quantity = cartItem[productId][size];
              orderItems.push(itemInfo);
            }
          }
        }
      }

      if (orderItems.length === 0) {
        toast.error('Your cart is empty');
        setIsProcessing(false);
        return;
      }

      if (method === 'cod') {
        const orderData = {
          address: formData,
          items: orderItems,
          amount: getCartAmount() + delivery_fee,
          paymentMethod: 'COD',
          status: 'Placed',
        };

        const result = await apiConfig.post('/order/placeorder', orderData);
        if (result.data) {
          setCartItem({});
          toast.success('🎉 Order placed successfully!');
          navigate('/order');
        }
      } else if (method === 'razorpay') {
        const orderData = {
          address: formData,
          items: orderItems,
          amount: getCartAmount() + delivery_fee,
          paymentMethod: 'Razorpay',
        };

        const result = await apiConfig.post('/order/razorpay', orderData);
        if (result.data?.success) {
          const { order, orderId, keyId } = result.data;

          const options = {
            key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: order.amount,
            currency: order.currency || 'INR',
            name: 'Riveto',
            description: 'Order Payment',
            order_id: order.id,
            prefill: {
              name: `${formData.firstname} ${formData.lastname}`.trim(),
              email: formData.email,
              contact: formData.phone,
            },
            theme: {
              color: '#06B6D4',
            },
            handler: async (response) => {
              try {
                const verifyRes = await apiConfig.post('/order/verifyRazorpay', {
                  orderId,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                });

                if (verifyRes.data?.success) {
                  setCartItem({});
                  toast.success('🎉 Payment successful! Order placed.');
                  navigate('/order');
                }
              } catch (verifyErr) {
                // eslint-disable-next-line no-console
                console.error('Payment verification error:', verifyErr);
                toast.error('Payment verification failed. Please contact support.');
              } finally {
                setIsProcessing(false);
              }
            },
            modal: {
              ondismiss: () => {
                setIsProcessing(false);
                toast.info('Payment window closed.');
              },
            },
          };

          if (window.Razorpay) {
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (resp) {
              // eslint-disable-next-line no-console
              console.error('Payment failed:', resp.error);
              toast.error(`Payment failed: ${resp.error?.description || 'Transaction declined'}`);
              setIsProcessing(false);
            });
            rzp.open();
          } else {
            toast.error('Razorpay SDK failed to load. Please refresh the page and try again.');
            setIsProcessing(false);
          }
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
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
      color: 'from-green-500 to-emerald-500',
    },
    {
      id: 'razorpay',
      name: 'Razorpay',
      icon: RiSecurePaymentLine,
      description: 'Cards, UPI, NetBanking & Wallets',
      color: 'from-blue-500 to-cyan-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0f172a] to-[#0c4a6e] pt-24 pb-20 px-4">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Title text1={'COMPLETE'} text2={'YOUR ORDER'} />
          <p className="text-cyan-100 mt-4">
            Almost there! Review your details and complete your purchase
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div className="form-section">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-8">
              <div className="flex items-center gap-3 mb-6">
                <FaMapMarkerAlt className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold text-white">
                  Delivery Information
                </h2>
              </div>

              <form onSubmit={onSubmitHandler} className="space-y-6">
                {/* Saved Addresses Selector */}
                {savedAddresses.length > 0 && (
                  <div className="mb-2">
                    <p className="text-gray-300 text-sm font-medium mb-3 flex items-center gap-2">
                      <FaCheckCircle className="text-cyan-400" />
                      Select a saved address
                    </p>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {savedAddresses.map((address) => (
                        <div
                          key={address._id}
                          onClick={() => onSelectSavedAddress(address)}
                          className={`cursor-pointer p-3 rounded-xl border transition-all ${
                            selectedAddressId === address._id
                              ? 'border-cyan-500 bg-cyan-500/10'
                              : 'border-gray-600 hover:border-gray-500 bg-gray-700/30'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-4 h-4 rounded-full border-2 shrink-0 ${
                                selectedAddressId === address._id
                                  ? 'bg-cyan-500 border-cyan-500'
                                  : 'border-gray-500'
                              }`}
                            />
                            <div>
                              <p className="text-white text-sm font-medium">
                                {address.fullName}
                                {address.isDefault && (
                                  <span className="ml-2 text-xs text-cyan-400">(Default)</span>
                                )}
                              </p>
                              <p className="text-gray-400 text-xs">
                                {address.street}, {address.city}, {address.state} — {address.pincode}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="relative my-5">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600" />
                      </div>
                      <div className="relative flex justify-center text-xs">
                        <span className="bg-gray-800 px-3 text-gray-400">or fill in manually</span>
                      </div>
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      First Name
                    </label>
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
                    {formErrors.firstname && (
                      <p className="text-red-400 text-sm mt-1">
                        {formErrors.firstname}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Last Name
                    </label>
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
                    {formErrors.lastname && (
                      <p className="text-red-400 text-sm mt-1">
                        {formErrors.lastname}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Email Address
                  </label>
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
                  {formErrors.email && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Street Address
                  </label>
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
                  {formErrors.street && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.street}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      City
                    </label>
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
                    {formErrors.city && (
                      <p className="text-red-400 text-sm mt-1">
                        {formErrors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={onChangeHandler}
                      placeholder="State"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                    {formErrors.state && (
                      <p className="text-red-400 text-sm mt-1">
                        {formErrors.state}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Pincode
                    </label>
                    <input
                      type="text"
                      name="pincode"
                      value={formData.pincode}
                      onChange={onChangeHandler}
                      placeholder="Pincode"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                      required
                    />
                    {formErrors.pincode && (
                      <p className="text-red-400 text-sm mt-1">
                        {formErrors.pincode}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm mb-2">
                      Country
                    </label>
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
                    {formErrors.country && (
                      <p className="text-red-400 text-sm mt-1">
                        {formErrors.country}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm mb-2">
                    Phone Number
                  </label>
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
                  {formErrors.phone && (
                    <p className="text-red-400 text-sm mt-1">
                      {formErrors.phone}
                    </p>
                  )}
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
                  <h2 className="text-2xl font-bold text-white">
                    Payment Method
                  </h2>
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
                          <div
                            className={`w-12 h-12 rounded-lg bg-gradient-to-r ${payment.color} flex items-center justify-center`}
                          >
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-white font-semibold">
                              {payment.name}
                            </h3>
                            <p className="text-gray-400 text-sm">
                              {payment.description}
                            </p>
                          </div>
                          <div
                            className={`w-5 h-5 rounded-full border-2 ${
                              method === payment.id
                                ? 'bg-cyan-500 border-cyan-500'
                                : 'border-gray-500'
                            }`}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Security Badges */}
                <div className="mt-6 p-4 bg-green-500/10 rounded-xl border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <FaLock className="w-5 h-5 text-green-400" />
                    <span className="text-green-400 text-sm">
                      256-bit SSL secured payment
                    </span>
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
                  Free shipping on orders over {currency}{currency === '₹' ? '1,999' : '50'}
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
