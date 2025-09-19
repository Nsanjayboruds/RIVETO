import React, { useContext, useEffect, useState } from 'react';
import Nav from '../components/Nav';
import Sidebar from '../components/Sidebar';
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-toastify';

function List() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const { serverUrl } = useContext(authDataContext);

  const fetchList = async () => {
    try {
      setLoading(true);
      const result = await axios.get(serverUrl + "/api/product/list");
      setList(result.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const removelist = async (id) => {
    if (!window.confirm("Are you sure you want to remove this product?")) return;
    
    try {
      const result = await axios.post(`${serverUrl}/api/product/remove/${id}`, {}, { withCredentials: true });
      if (result.data) {
        fetchList();
        toast.success("Product removed successfully");
      } else {
        console.log("Failed to remove product");
        toast.error("Failed to remove product");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to remove product");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  // Get unique categories for filter
  const categories = ['All', ...new Set(list.map(item => item.category))];

  // Filter products based on search and category
  const filteredList = list.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-screen min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white overflow-x-hidden flex relative">
      <Nav />
      <Sidebar />

      <div className="w-full md:ml-[230px] lg:ml-[320px] mt-[70px] px-6 py-8">
        <div className="bg-gradient-to-br from-slate-900/70 to-slate-800/40 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-slate-700/50 mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Product Inventory</h1>
          <p className="text-slate-400 mb-6">Manage your product listings</p>
          
          {/* Search and Filter Section */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-700/40 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="w-full md:w-48">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-slate-700/40 border border-slate-600 rounded-lg px-4 py-2 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer"
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Results count */}
          <div className="text-slate-400 mb-4">
            {filteredList.length} {filteredList.length === 1 ? 'product' : 'products'} found
            {(searchTerm || filterCategory !== 'All') && ' (filtered)'}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
          </div>
        ) : filteredList?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((item, index) => (
              <div
                key={index}
                className="bg-slate-800/30 backdrop-blur-md rounded-xl overflow-hidden border border-slate-700/50 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="relative">
                  <img
                    src={item.image1}
                    className="w-full h-48 object-cover"
                    alt={item.name}
                  />
                  <div className="absolute top-3 right-3 bg-slate-900/80 text-cyan-400 text-xs font-semibold px-2 py-1 rounded">
                    {item.category}
                  </div>
                  {item.bestseller && (
                    <div className="absolute top-3 left-3 bg-amber-500 text-slate-900 text-xs font-bold px-2 py-1 rounded">
                      Bestseller
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-200 mb-1 truncate">{item.name}</h3>
                  <p className="text-slate-400 text-sm mb-3 line-clamp-2 h-10">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-xl font-bold text-cyan-400">₹{item.price}</div>
                    <div className="text-slate-400 text-sm">
                      {item.sizes?.length > 0 ? (
                        <span>{item.sizes.length} sizes</span>
                      ) : (
                        <span>No sizes</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {item.sizes?.slice(0, 4).map((size, i) => (
                      <span key={i} className="bg-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded">
                        {size}
                      </span>
                    ))}
                    {item.sizes?.length > 4 && (
                      <span className="bg-slate-700/50 text-slate-300 text-xs px-2 py-1 rounded">
                        +{item.sizes.length - 4} more
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={() => removelist(item._id)}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium py-2 px-4 rounded-lg transition-all duration-300 flex items-center justify-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-800/30 backdrop-blur-md rounded-xl p-8 text-center border border-slate-700/50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-16M9 9a1 1 0 011-1h4a1 1 0 011 1v1H9V9z" />
            </svg>
            <h3 className="text-xl font-semibold text-slate-300 mb-2">No products found</h3>
            <p className="text-slate-500">
              {searchTerm || filterCategory !== 'All' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Get started by adding your first product'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default List;