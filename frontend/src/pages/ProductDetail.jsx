import { useCallback, useContext, useEffect, useMemo, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { shopDataContext } from '../context/ShopContext';
import { toast } from 'react-toastify';
import { userDataContext } from '../context/UserContext';
import apiConfig from '../utils/apiConfig';
import 'react-toastify/dist/ReactToastify.css';


function ProductDetail() {
  const { userData } = useContext(userDataContext);
  const { productId } = useParams();

  const {
    product,
    pagination,
    loadingProducts,
    currency,
    addtoCart,
    addToWishlist,
    removeFromWishlist,
    wishlist
  } = useContext(shopDataContext);

  const [productData, setProductData] = useState(null);
  const isWishlisted = productData
    ? wishlist?.some(item => item._id === productData._id)
    : false;
  const [selectedImage, setSelectedImage] = useState('');
  const [size, setSize] = useState('');
  const [activeTab, setActiveTab] = useState('description');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const sizeGroupRef = useRef(null);

  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [isEditingReview, setIsEditingReview] = useState(false);

  const userReview = useMemo(() => {
    if (!userData?._id) return null;
    return reviews.find((r) => r.userId === userData._id) || null;
  }, [reviews, userData]);

  const handleSizeKeyDown = (event, sizes) => {
    const currentIndex = sizes.indexOf(size);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      event.preventDefault();
      nextIndex = currentIndex >= sizes.length - 1 ? 0 : currentIndex + 1;
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      event.preventDefault();
      nextIndex = currentIndex <= 0 ? sizes.length - 1 : currentIndex - 1;
    } else {
      return;
    }

    setSize(sizes[nextIndex]);
    const buttons = sizeGroupRef.current?.querySelectorAll('[role="radio"]');
    buttons?.[nextIndex]?.focus();
  };

  const handleTabKeyDown = (event, tabList) => {
    const tabIds = tabList.map((t) => t.id);
    const currentIndex = tabIds.indexOf(activeTab);
    let nextIndex = currentIndex;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      nextIndex = currentIndex >= tabIds.length - 1 ? 0 : currentIndex + 1;
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      nextIndex = currentIndex <= 0 ? tabIds.length - 1 : currentIndex - 1;
    } else if (event.key === 'Home') {
      event.preventDefault();
      nextIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      nextIndex = tabIds.length - 1;
    } else {
      return;
    }

    setActiveTab(tabIds[nextIndex]);
    document.getElementById(`tab-${tabIds[nextIndex]}`)?.focus();
  };

  const fetchReviews = useCallback(async () => {
    try {
      const response = await apiConfig.get(`/review/${productId}`);
      setReviews(response.data);
    } catch {
      // API errors are shown by the global interceptor.
    }
  }, [productId]);

  useEffect(() => {
    const found = (product || []).find((item) => item._id === productId);
    if (found) {
      setProductData(found);
      setSelectedImage(found.image1);
    }

    fetchReviews();
  }, [productId, product, fetchReviews]);

  const handleAddToCart = () => {
    if (!size) {
      toast.warning('Please select a size before adding to cart.');
      return;
    }

    addtoCart(productData._id, size, quantity);
    toast.success(`${quantity} x ${productData.name} added to cart!`);
  };

  const handleAddToWishlist = () => {
  if (!productData?._id) return;

  if (isWishlisted) {
    removeFromWishlist(productData._id);
    toast.info('Removed from wishlist');
  } else {
    addToWishlist(productData._id);
    toast.success('Added to wishlist 💖');
  }
};
  // share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productData.name,
          text: `Check out ${productData.name} on our store!`,
          url: window.location.href,
        });
        toast.success('Product shared successfully!');
      } catch {
        // User cancelled the share dialog — no action needed
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.info('Link copied to clipboard!');
    }
  };

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      toast.warning('Please write a review');
      return;
    }

    try {
      const response = await apiConfig.post(
        '/review/add',
        {
          productId,
          rating: reviewRating,
          comment: reviewComment.trim(),
        }
      );

      toast.success(response.data.message);
      setReviewComment('');
      setReviewRating(5);
      setIsEditingReview(false);
      fetchReviews();
    } catch {
      // API errors are shown by the global interceptor.
    }
  };

  const handleEditReview = () => {
    if (!userReview) return;
    setReviewRating(userReview.rating);
    setReviewComment(userReview.comment);
    setIsEditingReview(true);
  };

  const handleCancelEdit = () => {
    setReviewComment('');
    setReviewRating(5);
    setIsEditingReview(false);
  };

  const nextImage = () => {
    const imgs = [
      productData.image1,
      productData.image2,
      productData.image3,
      productData.image4,
    ].filter(Boolean);

    setCurrentImageIndex((prev) => (prev + 1) % imgs.length);
    setSelectedImage(imgs[(currentImageIndex + 1) % imgs.length]);
  };

  const prevImage = () => {
    const imgs = [
      productData.image1,
      productData.image2,
      productData.image3,
      productData.image4,
    ].filter(Boolean);

    setCurrentImageIndex((prev) => (prev - 1 + imgs.length) % imgs.length);
    setSelectedImage(imgs[(currentImageIndex - 1 + imgs.length) % imgs.length]);
  };

  if (!productData) {
    const allPagesLoaded =
      !loadingProducts &&
      pagination.page >= pagination.pages &&
      product.length > 0;

    if (allPagesLoaded) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-[#0f172a] dark:to-[#0c4a6e] flex items-center justify-center">
          <div
            className="text-slate-900 dark:text-white text-center"
            role="status"
          >
            <p className="text-lg">Product not found.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-[#0f172a] dark:to-[#0c4a6e] flex items-center justify-center">
        <div
          className="text-slate-900 dark:text-white text-center"
          role="status"
          aria-live="polite"
          aria-busy="true"
        >
          <div
            className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"
            aria-hidden="true"
          />
          <p className="text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  const images = [
    productData.image1,
    productData.image2,
    productData.image3,
    productData.image4,
  ].filter(Boolean);

  const rating = productData.rating || 0;
  const reviewCount = reviews.length || 0;

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${reviewCount})` },
  ];

  return (
    <main
      className="min-h-screen bg-gradient-to-br from-slate-100 to-sky-100 dark:from-[#0f172a] dark:to-[#0c4a6e]"
      aria-labelledby="product-title"
    >
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-20 pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <section aria-label="Product images">
            <div className="relative rounded-lg overflow-hidden border border-[#1f2a44]">
              <img
                src={selectedImage}
                alt={`${productData.name} — image ${currentImageIndex + 1} of ${images.length}`}
                className="w-full h-96 lg:h-[500px] object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                    aria-label="Previous product image"
                  >
                    <FaChevronLeft className="text-white" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-black/70 transition-all"
                    aria-label="Next product image"
                  >
                    <FaChevronRight className="text-white" aria-hidden="true" />
                  </button>
                  <p
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm"
                    aria-live="polite"
                  >
                    {currentImageIndex + 1} / {images.length}
                  </p>
                </>
              )}
            </div>

            <div
              className="flex gap-3 mt-4 overflow-x-auto"
              role="list"
              aria-label="Product image thumbnails"
            >
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  role="listitem"
                  onClick={() => {
                    setSelectedImage(img);
                    setCurrentImageIndex(i);
                  }}
                  aria-label={`View image ${i + 1} of ${images.length}`}
                  aria-current={selectedImage === img ? 'true' : undefined}
                  className={`w-16 h-16 rounded-lg cursor-pointer transition-all duration-300 border-2 overflow-hidden p-0 ${
                    selectedImage === img
                      ? 'border-blue-500'
                      : 'border-[#1f2a44] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </section>

          <div className="space-y-6 text-slate-900 dark:text-white">
            <nav
              className="text-sm text-slate-500 dark:text-gray-400"
              aria-label="Breadcrumb"
            >
              Home / {productData.category} / {productData.subCategory} /{' '}
              <span className="text-cyan-500 dark:text-cyan-400">
                {productData.name}
              </span>
            </nav>

            <div>
              <h1 id="product-title" className="text-4xl font-bold mb-3">
                {productData.name}
              </h1>
              <div
                className="flex items-center gap-3"
                aria-label={`Rated ${rating} out of 5 from ${reviewCount} reviews`}
              >
                <div className="flex items-center gap-1" aria-hidden="true">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={
                        i < Math.floor(rating)
                          ? 'text-yellow-400'
                          : 'text-gray-400'
                      }
                    />
                  ))}
                </div>
                <span className="text-cyan-500">{rating}</span>
                <span className="text-gray-500">({reviewCount} reviews)</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <p className="text-3xl font-bold">
                {currency}
                {productData.price.toLocaleString()}
              </p>
            </div>

            <p className="text-slate-700 dark:text-gray-300 leading-relaxed">
              {productData.description}
            </p>

            <div>
              <span id="size-label" className="block mb-3 font-semibold">
                Select Size
              </span>
              <div
                ref={sizeGroupRef}
                role="radiogroup"
                aria-labelledby="size-label"
                className="flex gap-3 flex-wrap"
                onKeyDown={(e) => handleSizeKeyDown(e, productData.sizes || [])}
              >
                {productData.sizes?.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    role="radio"
                    aria-checked={size === s}
                    onClick={() => setSize(s)}
                    className={`px-5 py-2 rounded-lg border ${
                      size === s
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white dark:bg-gray-800'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span id="quantity-label" className="block mb-3 font-semibold">
                Quantity
              </span>
              <div
                className="flex items-center gap-3"
                role="group"
                aria-labelledby="quantity-label"
              >
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span aria-live="polite" aria-atomic="true">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-lg flex items-center justify-center gap-3"
            >
              <FaShoppingCart aria-hidden="true" />
              Add to Cart - {currency}
              {(productData.price * quantity).toLocaleString()}
            </button>

            <div className="flex gap-3">
              <button
  onClick={handleAddToWishlist}
  className={`flex-1 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-200
    ${isWishlisted
      ? 'bg-rose-600 text-white'
      : 'bg-gray-800 text-white hover:bg-gray-700'
    }`}
>
  <FaHeart className={isWishlisted ? 'text-white' : ''} />
  {isWishlisted ? 'Wishlisted' : 'Wishlist'}
</button>
              <button
                type="button"
                onClick={handleShare}
                className="w-14 h-14 bg-gray-800 rounded-lg flex items-center justify-center"
                aria-label="Share product"
              >
                <FaShare className="text-white" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div
            role="tablist"
            aria-label="Product information"
            className="flex gap-6 border-b border-gray-400 mb-8"
            onKeyDown={(e) => handleTabKeyDown(e, tabs)}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 ${
                  activeTab === tab.id
                    ? 'text-cyan-500 border-b-2 border-cyan-500'
                    : 'text-gray-500'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8">
            {activeTab === 'description' && (
              <div
                role="tabpanel"
                id="panel-description"
                aria-labelledby="tab-description"
              >
                <p className="text-slate-700 dark:text-gray-300">
                  {productData.description}
                </p>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div
                role="tabpanel"
                id="panel-specifications"
                aria-labelledby="tab-specifications"
                className="space-y-2 text-slate-700 dark:text-gray-300"
              >
                <p>Material: Premium Fabric</p>
                <p>Weight: 0.5 kg</p>
                <p>Quality: Excellent</p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div
                role="tabpanel"
                id="panel-reviews"
                aria-labelledby="tab-reviews"
                className="space-y-6"
              >
                {userReview && !isEditingReview ? (
                  <div className="bg-slate-100 dark:bg-gray-800/50 p-6 rounded-xl border border-cyan-400/40">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                        Your Review
                      </h3>
                      <button
                        type="button"
                        onClick={handleEditReview}
                        className="text-cyan-400 hover:text-cyan-300 text-sm font-medium"
                      >
                        Edit Review
                      </button>
                    </div>
                    <div className="flex gap-1 mb-2" aria-hidden="true">
                      {[...Array(userReview.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-700 dark:text-gray-300">
                      {userReview.comment}
                    </p>
                    <p className="text-slate-500 dark:text-gray-400 text-sm mt-3">
                      {new Date(userReview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ) : (
                  <div className="bg-slate-100 dark:bg-gray-800/50 p-6 rounded-xl border border-slate-200 dark:border-gray-700/60">
                    <h3 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">
                      {isEditingReview ? 'Edit Your Review' : 'Write a Review'}
                    </h3>

                    <div
                      className="flex gap-2 mb-4"
                      role="radiogroup"
                      aria-label="Review rating"
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          role="radio"
                          aria-checked={star === reviewRating}
                          aria-label={`${star} star${star === 1 ? '' : 's'}`}
                          onClick={() => setReviewRating(star)}
                          className="p-0 bg-transparent border-0"
                        >
                          <FaStar
                            className={`text-2xl ${
                              star <= reviewRating
                                ? 'text-yellow-400'
                                : 'text-gray-400'
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      ))}
                    </div>

                    <label htmlFor="review-comment" className="sr-only">
                      Review comment
                    </label>
                    <textarea
                      id="review-comment"
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Write your review..."
                      rows="4"
                      className="w-full p-4 rounded-lg bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 text-slate-900 dark:text-white outline-none"
                    />

                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        onClick={handleSubmitReview}
                        className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-2 rounded-lg"
                      >
                        {isEditingReview ? 'Update Review' : 'Submit Review'}
                      </button>
                      {isEditingReview && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {reviews.length > 0 ? (
                  reviews
                    .filter((review) => !userReview || review._id !== userReview._id)
                    .map((review) => (
                    <div
                      key={review._id}
                      className="bg-slate-100 dark:bg-gray-800/50 p-6 rounded-xl border border-slate-200 dark:border-gray-700/60"
                    >
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex gap-1" aria-hidden="true">
                          {[...Array(review.rating)].map((_, i) => (
                            <FaStar key={i} className="text-yellow-400" />
                          ))}
                        </div>
                        <span className="text-cyan-400 font-semibold">
                          {review.name}
                        </span>
                      </div>
                      <p className="text-slate-700 dark:text-gray-300">
                        {review.comment}
                      </p>
                      <p className="text-slate-500 dark:text-gray-400 text-sm mt-3">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))
                ) : (
                  !userReview && (
                    <p className="text-gray-500" role="status">
                      No reviews yet.
                    </p>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <section className="py-16" aria-labelledby="related-products-heading">
        <div className="max-w-7xl mx-auto px-4">
          <h2
            id="related-products-heading"
            className="text-2xl font-semibold mb-6 text-white"
          >
            Similar Items
          </h2>
          <RelatedProduct
            category={productData.category}
            subCategory={productData.subCategory}
            currentProductId={productData._id}
            tags={productData.tags || []}
            price={productData.price || 0}
          />
        </div>
      </section>
    </main>
  );
}

export default ProductDetail;
