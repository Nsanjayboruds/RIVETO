import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { shopDataContext } from '../context/ShopContext';
import RelatedProduct from '../components/RelatedProduct';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaShoppingCart, FaHeart, FaShare, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

gsap.registerPlugin(ScrollTrigger);

function ProductDetail() {
  const { productId } = useParams();
  const { product, currency, addtoCart, addToWishlist } = useContext(shopDataContext);
  const [productData, setProductData] = useState(null);
  const [selectedImage, setSelectedImage] = useState('');
  const [size, setSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const found = product.find(item => item._id === productId);
    if (found) {
      setProductData(found);
      setSelectedImage(found.image1);
    }
  }, [productId, product]);

  useEffect(() => {
    if (!productData) return;
    
    // Enhanced animations
    gsap.fromTo(".fade-in", 
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".fade-in",
          start: "top 85%",
          toggleActions: "play none none none"
        }
      }
    );

    // Image gallery animation
    gsap.fromTo(".gallery-image", 
      { scale: 0.9, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1 }
    );
  }, [productData]);

  const handleAddToCart = () => {
    if (!size) {
      toast.warning('Please select a size before adding to cart.');
      return;
    }
    addtoCart(productData._id, size, quantity);
    toast.success(`${quantity} x ${productData.name} added to cart!`);
  };

  const handleAddToWishlist = () => {
    addToWishlist(productData._id);
    toast.success('Added to wishlist! 💖');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productData.name,
          text: `Check out ${productData.name} on our store!`,
          url: window.location.href,
        });
        toast.success('Product shared successfully!');
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Link copied to clipboard!');
    }
  };

  const nextImage = () => {
    const images = [productData.image1, productData.image2, productData.image3, productData.image4].filter(Boolean);
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
    setSelectedImage(images[(currentImageIndex + 1) % images.length]);
  };

  const prevImage = () => {
    const images = [productData.image1, productData.image2, productData.image3, productData.image4].filter(Boolean);
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    setSelectedImage(images[(currentImageIndex - 1 + images.length) % images.length]);
  };

  if (!productData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#0c4a6e] flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  const images = [productData.image1, productData.image2, productData.image3, productData.image4].filter(Boolean);
  const rating = 4.5; // Example rating
  const reviewCount = 124;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#0c4a6e]">
      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Image Gallery */}
          <div className="fade-in">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src={selectedImage} 
                alt={productData.name}
                className="w-full h-96 lg:h-[500px] object-cover gallery-image"
              />
              
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                  >
                    <FaChevronLeft className="text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                  >
                    <FaChevronRight className="text-white" />
                  </button>
                </>
              )}
              
              {/* Image Counter */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                  {currentImageIndex + 1} / {images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Thumbnail ${i + 1}`}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-all duration-300 gallery-image ${
                    selectedImage === img 
                      ? 'ring-2 ring-cyan-400 scale-110' 
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  onClick={() => {
                    setSelectedImage(img);
                    setCurrentImageIndex(i);
                  }}
                />
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="fade-in text-white space-y-6">
            {/* Breadcrumb */}
            <div className="text-sm text-gray-400">
              Home / {productData.category} / {productData.subCategory} / <span className="text-cyan-400">{productData.name}</span>
            </div>

            {/* Title and Rating */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-2">{productData.name}</h1>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={`text-sm ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-600'}`} />
                  ))}
                  <span className="text-cyan-400 ml-2">{rating}</span>
                </div>
                <span className="text-gray-400">({reviewCount} reviews)</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold text-cyan-400">{currency}{productData.price.toLocaleString()}</p>
              {productData.originalPrice && (
                <p className="text-xl text-gray-400 line-through">{currency}{productData.originalPrice.toLocaleString()}</p>
              )}
              {productData.originalPrice && (
                <span className="bg-rose-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  Save {currency}{(productData.originalPrice - productData.price).toLocaleString()}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-300 leading-relaxed">{productData.description}</p>

            {/* Size Selection */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold">Select Size:</label>
              <div className="flex flex-wrap gap-3">
                {productData.sizes?.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setSize(s)}
                    className={`px-6 py-3 rounded-xl border-2 text-sm font-semibold transition-all duration-200 ${
                      size === s
                        ? 'bg-cyan-500 border-cyan-500 text-white shadow-lg scale-105'
                        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-cyan-400 hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              {size && (
                <p className="text-green-400 font-medium flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  Selected: {size}
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="space-y-3">
              <label className="block text-lg font-semibold">Quantity:</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-gray-800 rounded-xl p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-400">({productData.stock || 50} available)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white py-4 px-8 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                <FaShoppingCart className="group-hover:scale-110 transition-transform" />
                Add to Cart - {currency}{(productData.price * quantity).toLocaleString()}
              </button>
              
              <div className="flex gap-3">
                <button
                  onClick={handleAddToWishlist}
                  className="w-14 h-14 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl flex items-center justify-center transition-all duration-300 group"
                  title="Add to Wishlist"
                >
                  <FaHeart className="text-gray-400 group-hover:text-rose-400 group-hover:scale-110 transition-all" />
                </button>
                
                <button
                  onClick={handleShare}
                  className="w-14 h-14 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl flex items-center justify-center transition-all duration-300 group"
                  title="Share Product"
                >
                  <FaShare className="text-gray-400 group-hover:text-cyan-400 group-hover:scale-110 transition-all" />
                </button>
              </div>
            </div>

            {/* Product Features */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">✓</span>
                </div>
                <p className="text-sm text-gray-300">Free Shipping</p>
              </div>
              <div className="text-center p-4 bg-gray-800/50 rounded-xl">
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-white font-bold">↺</span>
                </div>
                <p className="text-sm text-gray-300">30-Day Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs Section */}
      <div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="fade-in">
            <div className="flex gap-6 border-b border-gray-700 mb-8">
              {[
                { id: 'description', label: 'Description' },
                { id: 'specifications', label: 'Specifications' },
                { id: 'reviews', label: `Reviews (${reviewCount})` }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-3 text-lg font-semibold transition-all duration-300 ${
                    activeTab === tab.id
                      ? "text-cyan-400 border-b-2 border-cyan-400"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="bg-gray-900/50 backdrop-blur-md border border-gray-800 rounded-2xl p-8 shadow-xl">
              {activeTab === 'description' && (
                <div className="text-gray-300 space-y-4">
                  <p className="leading-relaxed">
                    {productData.description || "Discover effortless style with our premium product. Designed with comfort and durability in mind, this piece blends timeless fashion with modern quality."}
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                      Premium quality materials
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                      Comfortable and durable design
                    </li>
                    <li className="flex items-center gap-3">
                      <span className="w-2 h-2 bg-cyan-400 rounded-full"></span>
                      Perfect for everyday wear
                    </li>
                  </ul>
                </div>
              )}

              {activeTab === 'specifications' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                  <div>
                    <h4 className="text-cyan-400 font-semibold mb-3">Product Details</h4>
                    <div className="space-y-2">
                      <p><span className="text-gray-400">Material:</span> Premium Fabric</p>
                      <p><span className="text-gray-400">Color:</span> As shown</p>
                      <p><span className="text-gray-400">Weight:</span> 0.5 kg</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-cyan-400 font-semibold mb-3">Dimensions</h4>
                    <div className="space-y-2">
                      <p><span className="text-gray-400">Length:</span> 28 inches</p>
                      <p><span className="text-gray-400">Width:</span> 20 inches</p>
                      <p><span className="text-gray-400">Height:</span> 2 inches</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="bg-gray-800/50 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400" />
                        ))}
                      </div>
                      <span className="text-cyan-400 font-semibold">Excellent Product</span>
                    </div>
                    <p className="text-gray-300">
                      "I bought this last month and it's already my favorite item. Great quality, fits perfectly, and looks amazing. Would definitely recommend!"
                    </p>
                    <p className="text-gray-400 text-sm mt-3">- Sarah Johnson</p>
                  </div>

                  <div className="bg-gray-800/50 p-6 rounded-xl">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1">
                        {[...Array(4)].map((_, i) => (
                          <FaStar key={i} className="text-yellow-400" />
                        ))}
                        <FaStar className="text-gray-600" />
                      </div>
                      <span className="text-cyan-400 font-semibold">Great Fit</span>
                    </div>
                    <p className="text-gray-300">
                      "Really happy with the material and fit. The quality is much better than I expected for the price. Will be buying again!"
                    </p>
                    <p className="text-gray-400 text-sm mt-3">- Mike Thompson</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="fade-in py-16 bg-gradient-to-br from-[#0c4a6e] to-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <RelatedProduct
            category={productData.category}
            subCategory={productData.subCategory}
            currentProductId={productData._id}
            tags={productData.tags || []}
            price={productData.price || 0}
          />
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;