import React, { useContext, useEffect, useState, useRef } from 'react';
import Title from '../components/Title';
import { shopDataContext } from '../context/ShopContext';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { 
  FaBox, FaShoppingBag, FaShippingFast, FaCheckCircle, 
  FaClock, FaMoneyBillWave, FaCreditCard, FaCalendarAlt,
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaUndo, FaStar
} from 'react-icons/fa';
import { GiReceiveMoney } from 'react-icons/gi';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Order() {
  const [orderData, setOrderData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const { currency } = useContext(shopDataContext);
  const { serverUrl } = useContext(authDataContext);
  const sectionRef = useRef(null);

  const loadOrderData = async () => {
    try {
      setIsLoading(true);
      const result = await axios.post(
        serverUrl + '/api/order/userorder',
        {},
        { withCredentials: true }
      );

      if (result.data) {
        let allOrdersItem = [];
        result.data.forEach((order) => {
          order.items.forEach((item) => {
            item.status = order.status;
            item.payment = order.payment;
            item.paymentMethod = order.paymentMethod;
            item.date = order.date;
            item.orderId = order._id;
            item.totalAmount = order.totalAmount;
            item.shippingAddress = order.shippingAddress;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem.reverse());
      }
    } catch (error) {
      console.log('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrderData();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      gsap.fromTo(".order-item",
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
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
  }, [isLoading, orderData]);

  const getNormalizedStatusIndex = (status) => {
    if (!status) return -1;
    const normalized = status.toLowerCase();

    if (normalized.includes('place')) return 0;
    if (normalized.includes('pack')) return 1;
    if (normalized.includes('ship')) return 2;
    if (normalized.includes('out')) return 3;
    if (normalized.includes('deliver')) return 4;
    if (normalized.includes('cancel')) return -2;

    return -1;
  };

  const statusSteps = [
    { name: 'Order Placed', icon: FaShoppingBag, color: 'from-blue-500 to-cyan-500' },
    { name: 'Packing', icon: FaBox, color: 'from-purple-500 to-pink-500' },
    { name: 'Shipped', icon: FaShippingFast, color: 'from-amber-500 to-orange-500' },
    { name: 'Out for delivery', icon: FaMapMarkerAlt, color: 'from-green-500 to-emerald-500' },
    { name: 'Delivered', icon: FaCheckCircle, color: 'from-green-600 to-teal-500' }
  ];

  const statusFilters = [
    { value: 'all', label: 'All Orders', icon: FaShoppingBag },
    { value: 'placed', label: 'Placed', icon: FaClock },
    { value: 'shipped', label: 'Shipped', icon: FaShippingFast },
    { value: 'delivered', label: 'Delivered', icon: FaCheckCircle },
    { value: 'cancelled', label: 'Cancelled', icon: FaUndo }
  ];

  const filteredOrders = orderData.filter(item => {
    if (filterStatus === 'all') return true;
    const status = item.status?.toLowerCase();
    return status.includes(filterStatus);
  });

  const getStatusIcon = (status) => {
    const normalized = status?.toLowerCase();
    if (normalized?.includes('place')) return FaShoppingBag;
    if (normalized?.includes('pack')) return FaBox;
    if (normalized?.includes('ship')) return FaShippingFast;
    if (normalized?.includes('out')) return FaMapMarkerAlt;
    if (normalized?.includes('deliver')) return FaCheckCircle;
    if (normalized?.includes('cancel')) return FaUndo;
    return FaClock;
  };

  const getStatusColor = (status) => {
    const normalized = status?.toLowerCase();
    if (normalized?.includes('place')) return 'text-blue-400';
    if (normalized?.includes('pack')) return 'text-purple-400';
    if (normalized?.includes('ship')) return 'text-amber-400';
    if (normalized?.includes('out')) return 'text-green-400';
    if (normalized?.includes('deliver')) return 'text-green-500';
    if (normalized?.includes('cancel')) return 'text-red-400';
    return 'text-gray-400';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-100 dark:from-gray-900 dark:via-[#0f172a] dark:to-[#0c4a6e] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-700 dark:text-cyan-200 text-lg">Loading your orders...</p>
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
          <Title text1='MY' text2='ORDERS' />
          <p className="text-cyan-700 dark:text-cyan-100 mt-4">Track and manage all your purchases in one place</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {statusFilters.map((filter) => {
            const IconComponent = filter.icon;
            return (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  filterStatus === filter.value
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-slate-200 dark:bg-gray-800 text-slate-700 dark:text-gray-300 hover:bg-slate-300 dark:hover:bg-gray-700'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="text-sm font-medium">{filter.label}</span>
              </button>
            );
          })}
        </div>

        {/* Orders Count */}
        <div className="bg-gradient-to-r from-cyan-100 to-blue-100 dark:from-cyan-500/10 dark:to-blue-500/10 border border-cyan-300/50 dark:border-cyan-500/20 rounded-2xl p-4 mb-8">
          <div className="flex flex-wrap justify-between items-center">
            <div>
              <h3 className="text-slate-900 dark:text-white font-semibold">Order Summary</h3>
              <p className="text-cyan-700 dark:text-cyan-100 text-sm">
                {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="flex gap-4 text-sm">
              <span className="text-green-400">● {orderData.filter(o => o.status?.toLowerCase().includes('deliver')).length} Delivered</span>
              <span className="text-blue-400">● {orderData.filter(o => o.status?.toLowerCase().includes('ship')).length} Shipping</span>
              <span className="text-amber-400">● {orderData.filter(o => o.status?.toLowerCase().includes('place')).length} Processing</span>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 bg-white/80 dark:bg-gray-800/30 rounded-2xl border border-slate-200 dark:border-gray-700/40">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center">
                <FaShoppingBag className="text-slate-500 dark:text-gray-600 text-3xl" />
              </div>
              <h3 className="text-slate-900 dark:text-white text-xl font-semibold mb-2">No orders found</h3>
              <p className="text-slate-600 dark:text-gray-400">You haven't placed any orders yet.</p>
              <button className="mt-6 px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl transition-colors">
                Start Shopping
              </button>
            </div>
          ) : (
            filteredOrders.map((item, index) => {
              const StatusIcon = getStatusIcon(item.status);
              const statusIndex = getNormalizedStatusIndex(item.status);
              const isCancelled = item.status?.toLowerCase().includes('cancel');

              return (
                <div
                  key={index}
                  className="order-item bg-gradient-to-br from-white to-slate-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-slate-200 dark:border-gray-700 p-6 shadow-xl"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Product Info */}
                    <div className="flex gap-4">
                      <img
                        src={item.image1}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-xl border border-slate-200 dark:border-gray-700"
                      />
                      <div>
                        <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">{item.name}</h3>
                        <p className="text-cyan-400 font-bold text-xl">{currency}{item.price}</p>
                        <p className="text-slate-500 dark:text-gray-400 text-sm">Quantity: {item.quantity || 1}</p>
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <StatusIcon className={`w-4 h-4 ${getStatusColor(item.status)}`} />
                        <span className={`font-medium ${getStatusColor(item.status)}`}>
                          {item.status || 'Processing'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                        <FaCalendarAlt className="w-4 h-4" />
                        <span>{formatDate(item.date)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-gray-400">
                        {item.payment ? (
                          <GiReceiveMoney className="w-4 h-4 text-green-400" />
                        ) : (
                          <FaMoneyBillWave className="w-4 h-4 text-amber-400" />
                        )}
                        <span>{item.payment ? 'Paid' : 'Pending'} • {item.paymentMethod}</span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-gray-500">Order ID: {item.orderId?.slice(-8)}</p>
                    </div>

                    {/* Status Tracker */}
                    <div className="lg:col-span-1">
                      {!isCancelled ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            {statusSteps.map((step, idx) => {
                              const StepIcon = step.icon;
                              const isCompleted = idx <= statusIndex;
                              const isCurrent = idx === statusIndex;

                              return (
                                <div key={idx} className="flex flex-col items-center">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    isCompleted 
                                      ? `bg-gradient-to-r ${step.color} text-white` 
                                      : 'bg-slate-300 dark:bg-gray-700 text-slate-500 dark:text-gray-400'
                                  }`}>
                                    <StepIcon className="w-4 h-4" />
                                  </div>
                                  {idx < statusSteps.length - 1 && (
                                    <div className={`w-12 h-1 mt-2 ${
                                      isCompleted ? `bg-gradient-to-r ${step.color}` : 'bg-slate-300 dark:bg-gray-700'
                                    }`}></div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <p className="text-center text-sm text-cyan-400">
                            {statusIndex >= 0 ? statusSteps[statusIndex]?.name : 'Processing...'}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                          <FaUndo className="w-8 h-8 text-red-400 mb-2" />
                          <p className="text-red-400 text-sm font-semibold">Order Cancelled</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-gray-700">
                    <button className="px-4 py-2 bg-slate-300 dark:bg-gray-700 hover:bg-slate-400 dark:hover:bg-gray-600 text-slate-800 dark:text-white rounded-xl text-sm transition-colors">
                      View Details
                    </button>
                    {!isCancelled && statusIndex === 4 && (
                      <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm transition-colors flex items-center gap-2">
                        <FaStar className="w-4 h-4" />
                        Rate Product
                      </button>
                    )}
                    {!isCancelled && statusIndex < 2 && (
                      <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm transition-colors">
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default Order;
