import React, { useState, useEffect, useContext } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { SiEbox } from "react-icons/si";
import { toast } from 'react-toastify';

function Order() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('All');
  const { serverUrl } = useContext(authDataContext);

  const fetchAllOrders = async () => {
    try {
      setLoading(true);
      const result = await axios.post(serverUrl + "/api/order/list", {}, { withCredentials: true });
      setOrders(result.data.reverse());
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const statusHandler = async (e, orderId) => {
    try {
      const result = await axios.post(
        serverUrl + "/api/order/status",
        { orderId, status: e.target.value },
        { withCredentials: true }
      );
      
      if (result.data) {
        await fetchAllOrders();
        toast.success("Order status updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // Get unique status values for filter
  const statusOptions = [
    'All',
    'Order Placed',
    'Packing',
    'Shipped',
    'Out for delivery',
    'Delivered'
  ];

  // Filter orders based on status
  const filteredOrders = filterStatus === 'All' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  // Status color mapping
  const statusColors = {
    'Order Placed': 'bg-blue-500',
    'Packing': 'bg-amber-500',
    'Shipped': 'bg-indigo-500',
    'Out for delivery': 'bg-purple-500',
    'Delivered': 'bg-green-500'
  };

  return (
    <div className='w-screen min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white'>
      <Nav />
      <div className='w-full min-h-screen flex items-start lg:justify-center'>
        <Sidebar />
        <div className='lg:w-[85%] md:w-[70%] min-h-screen lg:ml-[310px] md:ml-[250px] mt-[70px] flex flex-col gap-8 overflow-x-hidden py-8 px-4 md:px-8'>

          {/* Header Section */}
          <div className='bg-gradient-to-br from-slate-900/70 to-slate-800/40 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-slate-700/50'>
            <h2 className='text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
              Order Management
            </h2>
            <p className='text-slate-400 mb-6'>Manage and track all customer orders</p>
            
            {/* Filter Section */}
            <div className='flex flex-col md:flex-row gap-4 items-start md:items-center'>
              <div className='flex-1'>
                <label className='block text-slate-400 mb-2'>Filter by Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className='w-full md:w-64 bg-slate-700/40 border border-slate-600 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer'
                >
                  {statusOptions.map((status, index) => (
                    <option key={index} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              
              <div className='text-slate-400'>
                Showing {filteredOrders.length} of {orders.length} orders
              </div>
            </div>
          </div>

          {loading ? (
            <div className='flex justify-center items-center h-64'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500'></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className='bg-slate-800/30 backdrop-blur-md rounded-xl p-8 text-center border border-slate-700/50'>
              <SiEbox className='w-16 h-16 mx-auto text-slate-500 mb-4' />
              <h3 className='text-xl font-semibold text-slate-300 mb-2'>No orders found</h3>
              <p className='text-slate-500'>
                {filterStatus !== 'All' 
                  ? `No orders with status "${filterStatus}"` 
                  : 'No orders have been placed yet'}
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 gap-6'>
              {filteredOrders.map((order, index) => (
                <div key={order._id || index} className='bg-slate-800/30 backdrop-blur-md rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300'>
                  
                  {/* Order Header */}
                  <div className='bg-slate-900/50 p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                    <div className='flex items-center gap-4'>
                      <div className='bg-cyan-500 p-2 rounded-lg'>
                        <SiEbox className='w-6 h-6 text-white' />
                      </div>
                      <div>
                        <p className='text-slate-400 text-sm'>Order ID</p>
                        <p className='text-cyan-400 font-mono'>{order._id?.substring(0, 8)}...</p>
                      </div>
                    </div>
                    
                    <div className='flex flex-wrap gap-4'>
                      <div className='text-right'>
                        <p className='text-slate-400 text-sm'>Placed on</p>
                        <p className='text-slate-300'>{new Date(order.createdAt).toLocaleDateString('en-GB')}</p>
                      </div>
                      <div className='text-right'>
                        <p className='text-slate-400 text-sm'>Total Amount</p>
                        <p className='text-xl font-bold text-cyan-400'>₹{order.amount.toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Order Content */}
                  <div className='p-4 md:p-6'>
                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
                      {/* Order Items */}
                      <div>
                        <h3 className='text-lg font-semibold text-slate-200 mb-3 border-b border-slate-700 pb-2'>Order Items</h3>
                        <div className='space-y-3'>
                          {order.items?.map((item, idx) => (
                            <div key={idx} className='flex items-start gap-3 p-3 bg-slate-700/30 rounded-lg'>
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className='w-12 h-12 object-cover rounded'
                              />
                              <div className='flex-1'>
                                <p className='text-slate-200 font-medium'>{item.name}</p>
                                <div className='flex justify-between text-sm text-slate-400 mt-1'>
                                  <span>Qty: {item.quantity} | Size: {item.size}</span>
                                  <span>₹{item.price}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Shipping Address */}
                      <div>
                        <h3 className='text-lg font-semibold text-slate-200 mb-3 border-b border-slate-700 pb-2'>Shipping Details</h3>
                        <div className='bg-slate-700/30 p-4 rounded-lg'>
                          <p className='text-slate-200 font-medium mb-2'>
                            {order.address.firstname} {order.address.lastname}
                          </p>
                          <p className='text-slate-400'>{order.address.street}</p>
                          <p className='text-slate-400'>
                            {order.address.city}, {order.address.state}, {order.address.country} - {order.address.pincode}
                          </p>
                          <p className='text-slate-400 mt-2'>{order.address.phone}</p>
                          
                          <div className='flex flex-wrap gap-4 mt-4 pt-4 border-t border-slate-600'>
                            <div>
                              <p className='text-slate-400 text-sm'>Payment Method</p>
                              <p className='text-slate-200 font-medium'>{order.paymentMethod || 'COD'}</p>
                            </div>
                            <div>
                              <p className='text-slate-400 text-sm'>Payment Status</p>
                              <p className={`font-medium ${
                                order.paymentStatus === 'Completed' ? 'text-green-400' : 'text-amber-400'
                              }`}>
                                {order.paymentStatus || 'Pending'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Status Control */}
                    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-4 border-t border-slate-700'>
                      <div className='flex items-center gap-3'>
                        <span className='text-slate-400'>Current Status:</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          statusColors[order.status] || 'bg-slate-600'
                        } text-white`}>
                          {order.status}
                        </span>
                      </div>
                      
                      <div className='w-full md:w-64'>
                        <label className='block text-slate-400 mb-2 text-sm'>Update Status</label>
                        <select
                          value={order.status}
                          onChange={(e) => statusHandler(e, order._id)}
                          className='w-full bg-slate-700/40 border border-slate-600 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer'
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Packing">Packing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for delivery">Out for delivery</option>
                          <option value="Delivered">Delivered</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Order;