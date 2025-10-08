import React, { useState, useContext, useEffect } from 'react'
import Nav from '../components/Nav'
import Sidebar from '../components/Sidebar'
import { authDataContext } from '../Context/AuthProvider'
import axios from 'axios'
import { FiBox, FiShoppingCart, FiTrendingUp, FiActivity } from 'react-icons/fi'

function Home() {
  const [totalProducts, setTotalProducts] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)
  const [loading, setLoading] = useState(true)
  const { serverUrl } = useContext(authDataContext)

  const fetchCounts = async () => {
    try {
      setLoading(true)
      const productRes = await axios.get(`${serverUrl}/api/product/list`, { withCredentials: true })
      setTotalProducts(productRes.data.length)

      const orderRes = await axios.post(`${serverUrl}/api/order/list`, {}, { withCredentials: true })
      setTotalOrders(orderRes.data.length)
    } catch (error) {
      console.log("Failed to fetch counts", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCounts()
  }, [])

  // Format numbers with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white'>
      <Nav />
      <Sidebar />
      
      <div className='ml-0 lg:ml-64 p-6 pt-24 lg:pt-6'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>
            Dashboard Overview
          </h1>
          <p className='text-gray-400 mt-2'>Welcome back! Here's what's happening with your store today.</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {/* Products Card */}
          <div className='bg-gradient-to-br from-blue-900/50 to-blue-800/30 rounded-2xl p-6 border border-blue-700/30 shadow-2xl shadow-blue-900/20 backdrop-blur-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-blue-300 text-sm font-medium'>Total Products</p>
                <h2 className='text-3xl font-bold mt-2 text-white'>
                  {loading ? (
                    <div className='h-8 w-20 bg-blue-700/50 rounded animate-pulse'></div>
                  ) : (
                    formatNumber(totalProducts)
                  )}
                </h2>
                <p className='text-blue-400 text-xs mt-2 flex items-center'>
                  <FiTrendingUp className='mr-1' /> 
                  <span>12% increase this month</span>
                </p>
              </div>
              <div className='p-3 bg-blue-600/20 rounded-full'>
                <FiBox className='text-blue-400 text-2xl' />
              </div>
            </div>
          </div>

          {/* Orders Card */}
          <div className='bg-gradient-to-br from-purple-900/50 to-purple-800/30 rounded-2xl p-6 border border-purple-700/30 shadow-2xl shadow-purple-900/20 backdrop-blur-sm'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-purple-300 text-sm font-medium'>Total Orders</p>
                <h2 className='text-3xl font-bold mt-2 text-white'>
                  {loading ? (
                    <div className='h-8 w-20 bg-purple-700/50 rounded animate-pulse'></div>
                  ) : (
                    formatNumber(totalOrders)
                  )}
                </h2>
                <p className='text-purple-400 text-xs mt-2 flex items-center'>
                  <FiActivity className='mr-1' /> 
                  <span>8% increase this month</span>
                </p>
              </div>
              <div className='p-3 bg-purple-600/20 rounded-full'>
                <FiShoppingCart className='text-purple-400 text-2xl' />
              </div>
            </div>
          </div>
        </div>

        {/* Additional Dashboard Content */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          {/* Quick Stats */}
          <div className='bg-gray-900/50 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm'>
            <h3 className='text-lg font-semibold text-gray-200 mb-4'>Store Performance</h3>
            <div className='space-y-4'>
              <div className='flex justify-between items-center p-3 bg-gray-800/30 rounded-lg'>
                <span className='text-gray-400'>Average Order Value</span>
                <span className='text-cyan-400 font-medium'>$124.50</span>
              </div>
              <div className='flex justify-between items-center p-3 bg-gray-800/30 rounded-lg'>
                <span className='text-gray-400'>Conversion Rate</span>
                <span className='text-cyan-400 font-medium'>3.2%</span>
              </div>
              <div className='flex justify-between items-center p-3 bg-gray-800/30 rounded-lg'>
                <span className='text-gray-400'>Customer Satisfaction</span>
                <span className='text-cyan-400 font-medium'>94%</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className='bg-gray-900/50 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm'>
            <h3 className='text-lg font-semibold text-gray-200 mb-4'>Recent Activity</h3>
            <div className='space-y-3'>
              <div className='flex items-center space-x-3 p-3 hover:bg-gray-800/30 rounded-lg transition-colors'>
                <div className='w-2 h-2 bg-green-400 rounded-full'></div>
                <p className='text-sm text-gray-300'>New order #ORD-2871 received</p>
                <span className='text-xs text-gray-500 ml-auto'>2m ago</span>
              </div>
              <div className='flex items-center space-x-3 p-3 hover:bg-gray-800/30 rounded-lg transition-colors'>
                <div className='w-2 h-2 bg-blue-400 rounded-full'></div>
                <p className='text-sm text-gray-300'>Product "Wireless Headphones" updated</p>
                <span className='text-xs text-gray-500 ml-auto'>15m ago</span>
              </div>
              <div className='flex items-center space-x-3 p-3 hover:bg-gray-800/30 rounded-lg transition-colors'>
                <div className='w-2 h-2 bg-amber-400 rounded-full'></div>
                <p className='text-sm text-gray-300'>Inventory alert: "Smart Watch" low stock</p>
                <span className='text-xs text-gray-500 ml-auto'>1h ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className='mt-8 bg-gray-900/50 rounded-2xl p-6 border border-gray-700/30 backdrop-blur-sm'>
          <h3 className='text-lg font-semibold text-gray-200 mb-4'>Quick Actions</h3>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <button className='p-4 bg-blue-600/20 hover:bg-blue-600/30 rounded-lg transition-colors flex flex-col items-center'>
              <FiBox className='text-blue-400 text-xl mb-2' />
              <span className='text-sm text-gray-300'>Add Product</span>
            </button>
            <button className='p-4 bg-purple-600/20 hover:bg-purple-600/30 rounded-lg transition-colors flex flex-col items-center'>
              <FiShoppingCart className='text-purple-400 text-xl mb-2' />
              <span className='text-sm text-gray-300'>View Orders</span>
            </button>
            <button className='p-4 bg-green-600/20 hover:bg-green-600/30 rounded-lg transition-colors flex flex-col items-center'>
              <FiTrendingUp className='text-green-400 text-xl mb-2' />
              <span className='text-sm text-gray-300'>Analytics</span>
            </button>
            <button className='p-4 bg-cyan-600/20 hover:bg-cyan-600/30 rounded-lg transition-colors flex flex-col items-center'>
              <FiActivity className='text-cyan-400 text-xl mb-2' />
              <span className='text-sm text-gray-300'>Reports</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home