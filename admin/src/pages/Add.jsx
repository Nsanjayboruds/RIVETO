import React, { useState, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import Nav from '../components/Nav';
import upset from "../assets/upload.jpg";
import { authDataContext } from '../context/AuthContext';
import axios from 'axios';
import Loading from '../components/Loading';
import {toast} from 'react-toastify'

function Add() {
  const [image1, setImage1] = useState(false);
  const [image2, setImage2] = useState(false);
  const [image3, setImage3] = useState(false);
  const [image4, setImage4] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Men");
  const [subCategory, setSubCategory] = useState("TopWear");
  const [sizes, setSizes] = useState([]);
  const [loading,setLoading]=useState(false)
  const [bestseller, setBestseller] = useState(false);

  const { serverUrl } = useContext(authDataContext);

  const handleAddProduct = async (e) => {
    setLoading(true)
    e.preventDefault();
    try {
      let formData = new FormData();
      formData.append("image1", image1);
      formData.append("image2", image2);
      formData.append("image3", image3);
      formData.append("image4", image4);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", category);
      formData.append("subCategory", subCategory);
      formData.append("sizes", JSON.stringify(sizes));
      formData.append("bestseller", bestseller);

     const result = await axios.post(`${serverUrl}/api/product/addproduct`, formData, {
  withCredentials: true,
  headers: {
    'Content-Type': 'multipart/form-data'
  }

});

      console.log(result.data);
      toast.success("ADD Product Sucessfully")
      setLoading(false)
      if (result.data) {
        setName("");
        setDescription("");
        setPrice("");
        setImage1(false);
        setImage2(false);
        setImage3(false);
        setImage4(false);
        setBestseller(false);
        setCategory("Men");
        setSubCategory("TopWear");
        setSizes([]);
      }
    } catch (error) {
      console.error(error);
      setLoading(false)
      toast.error("ADD PRODUCT FAILED")
    }
  };

  return (
    <div className='w-screen min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] text-white overflow-x-hidden flex relative'>
      <Nav />
      <Sidebar />

      <div className='w-[82%] min-h-screen overflow-y-auto absolute right-0 px-6 py-8'>
        <div className='bg-gradient-to-br from-slate-900/70 to-slate-800/40 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-xl border border-slate-700/50'>
          <h1 className='text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent'>Add New Product</h1>
          <p className='text-slate-400 mb-8'>Fill in the details below to add a new product to your catalog</p>
          
          <form onSubmit={handleAddProduct} className='flex flex-col gap-8'>
            {/* Image Upload */}
            <div className='bg-slate-800/30 p-6 rounded-xl border border-slate-700/50'>
              <p className='text-xl md:text-2xl font-semibold mb-4 text-slate-200'>Product Images</p>
              <div className='flex flex-wrap gap-6'>
                {[image1, image2, image3, image4].map((img, i) => (
                  <label key={i} htmlFor={`image${i + 1}`} className='cursor-pointer group relative'>
                    <div className='w-28 h-28 md:w-32 md:h-32 rounded-xl overflow-hidden border-2 border-dashed border-slate-500 group-hover:border-cyan-400 transition-all duration-300 flex items-center justify-center'>
                      <img
                        src={!img ? upset : URL.createObjectURL(img)}
                        alt=""
                        className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-300'
                      />
                      {!img && (
                        <div className='absolute inset-0 bg-slate-800/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      id={`image${i + 1}`}
                      hidden
                      required={i === 0} // Only first image is required
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (i === 0) setImage1(file);
                        if (i === 1) setImage2(file);
                        if (i === 2) setImage3(file);
                        if (i === 3) setImage4(file);
                      }}
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Name and Description */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div className='bg-slate-800/30 p-6 rounded-xl border border-slate-700/50'>
                <p className='text-xl md:text-2xl font-semibold mb-4 text-slate-200'>Product Name</p>
                <input
                  type="text"
                  placeholder='Enter product name'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className='w-full bg-slate-700/40 border border-slate-600 rounded-lg px-4 py-3 text-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all'
                />
              </div>

              <div className='bg-slate-800/30 p-6 rounded-xl border border-slate-700/50'>
                <p className='text-xl md:text-2xl font-semibold mb-4 text-slate-200'>Product Price</p>
                <div className='relative'>
                  <span className='absolute left-3 top-3 text-slate-400'>₹</span>
                  <input
                    type="number"
                    placeholder='2000'
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    required
                    className='w-full bg-slate-700/40 border border-slate-600 rounded-lg pl-8 pr-4 py-3 text-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all'
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className='bg-slate-800/30 p-6 rounded-xl border border-slate-700/50'>
              <p className='text-xl md:text-2xl font-semibold mb-4 text-slate-200'>Product Description</p>
              <textarea
                placeholder='Describe the product in detail...'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className='w-full h-32 bg-slate-700/40 border border-slate-600 rounded-lg px-4 py-3 text-lg placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all resize-none'
              />
            </div>

            {/* Category and Subcategory */}
            <div className='bg-slate-800/30 p-6 rounded-xl border border-slate-700/50'>
              <p className='text-xl md:text-2xl font-semibold mb-4 text-slate-200'>Product Category</p>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-slate-400 mb-2'>Main Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className='w-full bg-slate-700/40 border border-slate-600 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer'
                  >
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kid">Kid</option>
                  </select>
                </div>
                <div>
                  <label className='block text-slate-400 mb-2'>Sub-Category</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    className='w-full bg-slate-700/40 border border-slate-600 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all cursor-pointer'
                  >
                    <option value="TopWear">TopWear</option>
                    <option value="BottomWear">BottomWear</option>
                    <option value="WinterWear">WinterWear</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                    <option value="Watches">Watches</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sizes */}
            <div className='bg-slate-800/30 p-6 rounded-xl border border-slate-700/50'>
              <p className='text-xl md:text-2xl font-semibold mb-4 text-slate-200'>Available Sizes</p>
              <div className='flex flex-wrap gap-3'>
                {["S", "M", "L", "XL", "XXL"].map(size => (
                  <div
                    key={size}
                    onClick={() => setSizes(prev =>
                      prev.includes(size)
                        ? prev.filter(s => s !== size)
                        : [...prev, size]
                    )}
                    className={`px-5 py-2.5 rounded-lg border cursor-pointer text-lg font-medium transition-all duration-200 ${
                      sizes.includes(size)
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-cyan-500 shadow-lg shadow-cyan-500/30"
                        : "bg-slate-700/40 text-slate-300 border-slate-600 hover:border-cyan-400"
                    }`}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>

            {/* Bestseller Checkbox */}
            <div className='bg-slate-800/30 p-6 rounded-xl border border-slate-700/50 flex items-center'>
              <label className='flex items-center cursor-pointer'>
                <div className='relative'>
                  <input
                    type="checkbox"
                    id="bestseller"
                    checked={bestseller}
                    onChange={() => setBestseller(prev => !prev)}
                    className='sr-only'
                  />
                  <div className={`block w-14 h-7 rounded-full ${bestseller ? 'bg-cyan-500' : 'bg-slate-600'}`}></div>
                  <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ${bestseller ? 'transform translate-x-7' : ''}`}></div>
                </div>
                <div className='ml-4 text-lg font-medium text-slate-200'>
                  Mark as Bestseller
                </div>
              </label>
            </div>

            {/* Submit Button */}
            <div className='flex justify-center mt-4'>
              <button
                type="submit"
                disabled={loading}
                className='relative w-48 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl text-lg font-semibold hover:from-cyan-600 hover:to-blue-600 active:scale-95 transition-all duration-300 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 flex items-center justify-center disabled:opacity-80 disabled:cursor-not-allowed'
              >
                {loading ? <Loading/> : (
                  <>
                    <span>Add Product</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Add;