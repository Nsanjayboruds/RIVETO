import { useContext, useEffect, useState, useRef, useCallback } from 'react';
import { useFocusTrap, useEscapeKey } from '../hooks/useDialogA11y';

import { shopDataContext } from '../context/ShopContext';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Add slide animation style
const slideAnimationStyle = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

// Loader Component
const _Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-4 border-cyan-300 border-b-transparent rounded-full animate-spin-reverse"></div>
      </div>
      <p className="text-cyan-700 dark:text-cyan-200 text-lg font-medium">
        Loading Products...
      </p>
      <p className="text-slate-500 dark:text-gray-400 text-sm mt-2">
        Discovering amazing items for you
      </p>
    </div>
  );
};

// Skeleton Loader for Cards
const _CardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-slate-100 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-gray-700 animate-pulse">
      <div className="w-full h-64 bg-slate-200 dark:bg-gray-700"></div>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded"></div>
        <div className="h-4 bg-slate-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-slate-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="h-10 bg-slate-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    </div>
  );
};

// Filter Content Component
const _FilterContent = ({
  activeFilters,
  clearAllFilters,
  priceRange,
  setPriceRange,
  categories,
  category,
  toggleCategory,
  subCategories,
  subCategory,
  toggleSubCategory,
  ratings,
  selectedRatings,
  toggleRating,
}) => {
  return (
    <div className="space-y-8">
      {activeFilters > 0 && (
        <button
          type="button"
          onClick={clearAllFilters}
          className="w-full text-sm px-4 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-all border border-red-500/20"
        >
          Clear all filters
        </button>
      )}

      {/* Price Range Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
          <RiPriceTag3Line className="text-cyan-400" />
          Price Range
        </h3>
        <div className="px-1">
          <label htmlFor="collections-price-range" className="sr-only">
            Maximum price filter
          </label>
          <input
            id="collections-price-range"
            type="range"
            min="0"
            max="2000"
            value={priceRange[1]}
            onChange={(e) =>
              setPriceRange([priceRange[0], parseInt(e.target.value)])
            }
            className="w-full h-2 bg-slate-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider-thumb"
            aria-valuemin={0}
            aria-valuemax={2000}
            aria-valuenow={priceRange[1]}
            aria-label={`Maximum price ${priceRange[1]} dollars`}
          />
          <div className="flex justify-between mt-3">
            <span className="text-slate-700 dark:text-gray-400 text-sm font-medium">
              ${priceRange[0]}
            </span>

            <span className="text-slate-900 dark:text-white text-sm font-semibold">
              ${priceRange[1]}
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
          Category
        </h3>
        <div className="space-y-2">
          {categories.map((cat, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleCategory(cat)}
              aria-pressed={category.includes(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                category.includes(cat)
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-gray-700/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-Category Filter - Pill Style */}
      <div>
        <h3 className="font-semibold mb-3 text-slate-900 dark:text-white">
          Sub Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {subCategories.map((sub, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleSubCategory(sub)}
              aria-pressed={subCategory.includes(sub)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                subCategory.includes(sub)
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-gray-700/50'
              }`}
            >
              {sub}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter - Clean Cards */}
      <div>
        <h3 className="text-base font-semibold text-white mb-4">Rating</h3>
        <div className="space-y-2">
          {ratings.map((rating, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleRating(rating)}
              aria-pressed={selectedRatings.includes(rating)}
              aria-label={`${rating} stars and up`}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center gap-2 ${
                selectedRatings.includes(rating)
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-gray-700/50'
              }`}
            >
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, starIndex) => (
                  <FaStar
                    key={starIndex}
                    className={`text-sm ${
                      starIndex < rating
                        ? 'text-yellow-400'
                        : 'text-slate-400 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">& up</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

function Collections() {
  const [showFilter, setShowFilter] = useState(false);
  const {
    product,
    pagination,
    loadingProducts,
    getProducts,
    search,
    showSearch,
    compareList,
    toggleCompare,
  } = useContext(shopDataContext);
  const [filterProduct, setFilterProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [sortType, setSortType] = useState('relevant');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [activeFilters, setActiveFilters] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFiltering, setIsFiltering] = useState(false);

  const contentRef = useRef(null);
  const filterRef = useRef(null);
  const filterDrawerRef = useRef(null);

  const closeFilterDrawer = useCallback(() => setShowFilter(false), []);

  useFocusTrap(showFilter, filterDrawerRef);
  useEscapeKey(showFilter, closeFilterDrawer);

  // Extract unique categories and subcategories
  const categories = [...new Set(product.map((item) => item.category))].filter(
    Boolean
  );
  const subCategories = [
    ...new Set(product.map((item) => item.subCategory)),
  ].filter(Boolean);
  const ratings = [5, 4, 3, 2];

  const toggleCategory = (cat) => {
    if (category.includes(cat)) {
      setCategory((prev) => prev.filter((item) => item !== cat));
    } else {
      setCategory((prev) => [...prev, cat]);
    }
  };

  const toggleSubCategory = (sub) => {
    if (subCategory.includes(sub)) {
      setSubCategory((prev) => prev.filter((item) => item !== sub));
    } else {
      setSubCategory((prev) => [...prev, sub]);
    }
  };

  const toggleRating = (rating) => {
    if (selectedRatings.includes(rating)) {
      setSelectedRatings((prev) => prev.filter((item) => item !== rating));
    } else {
      setSelectedRatings((prev) => [...prev, rating]);
    }
  };

  const applyFilter = () => {
    setIsFiltering(true);

    // Simulate filtering delay for better UX
    setTimeout(() => {
      let productCopy = product.slice();

      // Search filter
      if (showSearch && search) {
        productCopy = productCopy.filter((item) =>
          item.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Category filter
      if (category.length > 0) {
        productCopy = productCopy.filter((item) =>
          category.includes(item.category)
        );
      }

      // Subcategory filter
      if (subCategory.length > 0) {
        productCopy = productCopy.filter((item) =>
          subCategory.includes(item.subCategory)
        );
      }

      // Price filter
      productCopy = productCopy.filter(
        (item) => item.price >= priceRange[0] && item.price <= priceRange[1]
      );

      // Rating filter (simulated)
      if (selectedRatings.length > 0) {
        productCopy = productCopy.filter((_item) => {
          const itemRating = Math.floor(Math.random() * 1.5 + 3.5); // Simulated rating
          return selectedRatings.some((rating) => itemRating >= rating);
        });
      }

      setFilterProduct(productCopy);

      // Count active filters
      const filterCount =
        category.length +
        subCategory.length +
        selectedRatings.length +
        (priceRange[0] > 0 || priceRange[1] < 2000 ? 1 : 0);
      setActiveFilters(filterCount);

      setIsFiltering(false);
    }, 500);
  };

  const sortProduct = () => {
    setIsFiltering(true);

    setTimeout(() => {
      let sorted = [...filterProduct];
      switch (sortType) {
        case 'low-high':
          sorted.sort((a, b) => a.price - b.price);
          break;
        case 'high-low':
          sorted.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          sorted.sort((a, b) => (b.rating || 4.5) - (a.rating || 4.5));
          break;
        default:
          // Relevant sorting (default)
          break;
      }
      setFilterProduct(sorted);
      setIsFiltering(false);
    }, 300);
  };

  const clearAllFilters = () => {
    setIsFiltering(true);

    setTimeout(() => {
      setCategory([]);
      setSubCategory([]);
      setSelectedRatings([]);
      setPriceRange([0, 2000]);
      setSortType('relevant');
      setIsFiltering(false);
    }, 500);
  };

  // Inject style element on mount
  useEffect(() => {
    if (
      typeof document !== 'undefined' &&
      !document.head.querySelector('[data-collections-style]')
    ) {
      const styleEl = document.createElement('style');
      styleEl.setAttribute('data-collections-style', 'true');
      styleEl.textContent = slideAnimationStyle;
      document.head.appendChild(styleEl);
    }
  }, []);

  useEffect(() => {
    // Initial loading simulation
    const timer = setTimeout(() => {
      setIsLoading(false);
      setFilterProduct(product);
    }, 1500);

    return () => clearTimeout(timer);
  }, [product]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  useEffect(() => {
    applyFilter();
  }, [category, subCategory, search, showSearch, priceRange, selectedRatings]);

  useEffect(() => {
    // Animations
    if (!isLoading && !isFiltering) {
      gsap.fromTo(
        '.collection-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      gsap.fromTo(
        filterRef.current,
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        }
      );
    }
  }, [filterProduct, isLoading, isFiltering]);

  return (
    <>
      <main
        className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-sky-100 dark:from-gray-900 dark:via-[#0f172a] dark:to-[#0c4a6e] pt-24 pb-20 overflow-x-hidden"
        aria-labelledby="collections-page-title"
      >
        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Desktop Only */}
          <div
            ref={filterRef}
            className="hidden lg:block lg:w-80 bg-white/90 dark:bg-gray-800/50 backdrop-blur-md rounded-2xl border border-slate-200 dark:border-gray-700 p-6 sticky top-24 h-fit"
            aria-label="Product filters"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FaFilter className="text-cyan-400" />
                Filters {activeFilters > 0 && `(${activeFilters})`}
              </h2>
            </div>
            <FilterContent
              activeFilters={activeFilters}
              clearAllFilters={clearAllFilters}
              priceRange={priceRange}
              setPriceRange={setPriceRange}
              categories={categories}
              category={category}
              toggleCategory={toggleCategory}
              subCategories={subCategories}
              subCategory={subCategory}
              toggleSubCategory={toggleSubCategory}
              ratings={ratings}
              selectedRatings={selectedRatings}
              toggleRating={toggleRating}
            />
          </div>

          {/* Products Section */}
          <div className="flex-1 min-w-0" ref={contentRef}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 p-5 bg-white/90 dark:bg-gray-800/50 rounded-2xl backdrop-blur-md border border-slate-200 dark:border-gray-700">
              <h1
                id="collections-page-title"
                className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight"
              >
                ALL{' '}
                <span className="text-cyan-500 dark:text-cyan-400">
                  COLLECTIONS
                </span>
              </h1>
              <div className="flex items-center gap-3">
                {/* Mobile Filter Toggle */}
                <button
                  type="button"
                  onClick={() => setShowFilter(!showFilter)}
                  className="lg:hidden flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-gray-700 rounded-lg text-slate-800 dark:text-white text-sm font-medium"
                  aria-expanded={showFilter}
                  aria-controls="collections-filter-drawer"
                >
                  <FaFilter className="text-sm" aria-hidden="true" />
                  Filters {activeFilters > 0 && `(${activeFilters})`}
                </button>
                {/* Sort Dropdown */}
                <div className="relative">
                  <label htmlFor="collections-sort" className="sr-only">
                    Sort products
                  </label>
                  <select
                    id="collections-sort"
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value)}
                    className="appearance-none bg-white dark:bg-gray-700 text-slate-900 dark:text-white px-4 py-2 rounded-lg pr-9 focus:outline-none focus:ring-2 focus:ring-cyan-500 border border-slate-300 dark:border-gray-600 text-sm"
                  >
                    <option value="relevant">Sort by: Relevant</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <RiArrowUpDownLine className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 dark:text-gray-400 pointer-events-none text-sm" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {isLoading ? (
              <div className="space-y-8">
                <Loader />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {[...Array(8)].map((_, index) => (
                    <CardSkeleton key={index} />
                  ))}
                </div>
              </div>
            ) : isFiltering ? (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className="text-cyan-700 dark:text-cyan-200">
                  Applying filters...
                </p>
              </div>
            ) : filterProduct.length > 0 ? (
              <>
                <p className="sr-only" role="status" aria-live="polite">
                  Showing {filterProduct.length} product
                  {filterProduct.length === 1 ? '' : 's'}
                </p>
                <div
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
                  role="list"
                  aria-label="Product results"
                >
                  {filterProduct.map((item, _index) => (
                    <div
                      key={item._id}
                      className="collection-item"
                      role="listitem"
                    >
                      <Card
                        id={item._id}
                        name={item.name}
                        price={item.price}
                        image={item.image1}
                        showQuickActions={true}
                        onCompare={() => toggleCompare(item)}
                        isCompared={compareList?.some(
                          (p) => p._id === item._id
                        )}
                      />
                    </div>
                  ))}
                </div>

                {/* Load More Button */}
                {pagination.page < pagination.pages && (
                  <div className="text-center mt-12">
                    <button
                      onClick={() => getProducts(pagination.page + 1)}
                      disabled={loadingProducts}
                      className="px-8 py-3 bg-slate-200 dark:bg-gray-700 hover:bg-slate-300 dark:hover:bg-gray-600 text-slate-800 dark:text-white rounded-lg transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loadingProducts ? 'Loading...' : 'Load More Products'}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white/80 dark:bg-gray-800/30 rounded-2xl border border-slate-200 dark:border-gray-700/40">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center">
                  <FaSearch className="text-slate-500 dark:text-gray-600 text-3xl" />
                </div>
                <h3 className="text-slate-900 dark:text-white text-xl font-semibold mb-2">
                  No products found
                </h3>
                <p className="text-slate-600 dark:text-gray-400 mb-6">
                  Try adjusting your filters to find what you're looking for.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="px-6 py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-full transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Floating Filter Drawer - Slides from Right with Blur Overlay */}
        {showFilter && (
          <div
            className="fixed inset-0 z-50 backdrop-blur-sm bg-black/60 transition-all duration-300"
            onClick={closeFilterDrawer}
            role="presentation"
          >
            <div
              id="collections-filter-drawer"
              ref={filterDrawerRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="filter-drawer-title"
              className="absolute top-0 right-0 h-full w-full max-w-md bg-gray-900/95 backdrop-blur-xl border-l border-gray-700/50 shadow-2xl overflow-y-auto transform transition-transform duration-300"
              onClick={(e) => e.stopPropagation()}
              style={{
                animation: 'slideInRight 0.3s ease-out',
              }}
            >
              <div className="sticky top-0 bg-gray-900/95 backdrop-blur-xl border-b border-gray-700/50 p-6 z-10">
                <div className="flex items-center justify-between">
                  <h2
                    id="filter-drawer-title"
                    className="text-2xl font-bold text-white flex items-center gap-3"
                  >
                    <FaFilter className="text-cyan-400" />
                    Filters
                    {activeFilters > 0 && (
                      <span className="px-2.5 py-1 bg-cyan-500 text-white text-sm rounded-full">
                        {activeFilters}
                      </span>
                    )}
                  </h2>
                  <button
                    type="button"
                    onClick={closeFilterDrawer}
                    className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-all"
                    aria-label="Close filters"
                  >
                    <FaTimes className="text-xl" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div className="p-6">
                <FilterContent
                  activeFilters={activeFilters}
                  clearAllFilters={clearAllFilters}
                  priceRange={priceRange}
                  setPriceRange={setPriceRange}
                  categories={categories}
                  category={category}
                  toggleCategory={toggleCategory}
                  subCategories={subCategories}
                  subCategory={subCategory}
                  toggleSubCategory={toggleSubCategory}
                  ratings={ratings}
                  selectedRatings={selectedRatings}
                  toggleRating={toggleRating}
                />
              </div>

              {/* Action Buttons */}
              <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-xl border-t border-gray-700/50 p-6 space-y-3">
                <button
                  onClick={() => setShowFilter(false)}
                  className="w-full px-4 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl transition-all duration-300 font-semibold"
                >
                  View {filterProduct.length} Products
                </button>
                {activeFilters > 0 && (
                  <button
                    onClick={() => {
                      clearAllFilters();
                      setShowFilter(false);
                    }}
                    className="w-full px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl transition-all duration-300 font-medium"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <Footer />
    </>
  );
}

export default Collections;
