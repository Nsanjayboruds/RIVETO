import { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import apiConfig from '../utils/apiConfig';
import { userDataContext } from './UserContext';

export const shopDataContext = createContext();

function ShopContext({ children }) {
  const [product, setProduct] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total: 0, pages: 1 });
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const [loadingCart, setLoadingCart] = useState(false);
  const [cartError, setCartError] = useState(null);
  const [compareList, setCompareList] = useState([]);
  const [comparePanelOpen, setComparePanelOpen] = useState(false);

  const { userData } = useContext(userDataContext); //
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(false);
  const [wishlistError, setWishlistError] = useState(null);

  const currency = '₹';
  const delivery_fee = 40;
  //wishlist functions
  const fetchWishlist = async () => {
    setLoadingWishlist(true);
    setWishlistError(null);
    try {
      const response = await apiConfig.get('/wishlist');
      if (response.data.success) {
        setWishlist(response.data.wishlist);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      setWishlistError(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch wishlist'
      );
    } finally {
      setLoadingWishlist(false);
    }
  };

  const addToWishlist = async (productId) => {
    try {
      const response = await apiConfig.post('/wishlist/add', { productId });

      if (response.data.success) {
        if (response.data.wishlist) {
          setWishlist(response.data.wishlist);
        } else {
          fetchWishlist();
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const response = await apiConfig.post('/wishlist/remove', { productId });

      if (response.data.success) {
        if (response.data.wishlist) {
          setWishlist(response.data.wishlist);
        } else {
          fetchWishlist();
        }
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  // Fetch products from server
  const getProducts = async (page = 1, limit = 20) => {
    if (loadingProducts) return;
    setLoadingProducts(true);
    setProductsError(null);
    try {
      const result = await apiConfig.get(
        `/product/list?page=${page}&limit=${limit}`
      );
      const incoming = result.data.products || [];
      setProduct((prev) => (page === 1 ? incoming : [...prev, ...incoming]));
      setPagination(result.data.pagination || { page: 1, total: 0, pages: 1 });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching products:', error);
      setProductsError(
        error.response?.data?.message ||
          error.message ||
          'Failed to load products.'
      );
    } finally {
      setLoadingProducts(false);
    }
  };

  // Add product to cart
  const addtoCart = async (itemId, size) => {
    if (!size) {
      return;
    }

    let cartData = structuredClone(cartItem);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    setCartItem(cartData);

    if (userData) {
      try {
        await apiConfig.post('/cart/add', { itemId, size });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  };

  const getUserCart = async () => {
    if (!userData) return; // Don't call API if not logged in
    setLoadingCart(true);
    setCartError(null);
    try {
      const result = await apiConfig.post('/cart/get', {});
      setCartItem(result.data);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching cart:', error);
      setCartError(
        error.response?.data?.message || error.message || 'Failed to load cart.'
      );
    } finally {
      setLoadingCart(false);
    }
  };

  const UpdateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity;
    setCartItem(cartData);

    if (userData) {
      try {
        await apiConfig.post('/cart/update', { itemId, size, quantity });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      }
    }
  };

  // Count total items in cart
  const getCartCount = () => {
    let totalCount = 0;
    for (const itemId in cartItem) {
      for (const size in cartItem[itemId]) {
        try {
          const count = cartItem[itemId][size];
          if (count > 0) {
            totalCount += count;
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Error counting cart item', error);
        }
      }
    }
    return totalCount; // ✅ Now returns the total count
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItem) {
      let itemInfo = (product || []).find((p) => p._id === items);
      for (const item in cartItem[items]) {
        try {
          if (itemInfo && cartItem[items][item] > 0) {
            totalAmount += itemInfo.price * cartItem[items][item];
          }
        } catch (_error) {
          void _error;
        }
      }
    }
    return totalAmount;
  };

  const clearCartData = async () => {
    // Instantly clear frontend state for immediate UI feedback
    setCartItem({});

    if (!userData) {
      return;
    }

    try {
      await apiConfig.post('/cart/clear');
      toast.success('Cart cleared successfully');
    } catch (error) {
      console.log('clearCartData frontend error:', error);
      toast.error(error.response?.data?.message || 'Failed to clear cart on server');

      // Fallback: reload cart if backend call failed to sync state
      getUserCart();
    }
  };

  const toggleCompare = (product) => {
    setCompareList((prev) => {
      const exists = prev.find((item) => item._id === product._id);
      if (exists) {
        toast.info('Removed from comparison', {
          position: 'bottom-center',
          autoClose: 1000,
          hideProgressBar: true,
        });
        return prev.filter((item) => item._id !== product._id);
      }
      if (prev.length >= 4) {
        toast.warning('You can compare up to 4 products', {
          position: 'bottom-center',
          autoClose: 2000,
        });
        return prev;
      }
      toast.success('Added to comparison', {
        position: 'bottom-center',
        autoClose: 1000,
        hideProgressBar: true,
      });
      return [...prev, product];
    });
  };

  const removeFromCompare = (id) => {
    setCompareList((prev) => prev.filter((item) => item._id !== id));
  };

  const toggleComparePanel = (state) => {
    setComparePanelOpen(state !== undefined ? state : !comparePanelOpen);
  };

  useEffect(() => {
    getProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (userData) {
      getUserCart();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);
  useEffect(() => {
    if (userData) {
      fetchWishlist();
    }
  }, [userData]);
  const value = {
    product,
    pagination,
    loadingProducts,
    productsError,
    currency,
    delivery_fee,
    getProducts,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItem,
    loadingCart,
    cartError,
    addtoCart,
    getCartCount,
    setCartItem,
    UpdateQuantity,
    clearCartData,
    getCartAmount,
    compareList,
    toggleCompare,
    removeFromCompare,
    comparePanelOpen,
    toggleComparePanel,
    wishlist, loadingWishlist, wishlistError,
    addToWishlist,
    fetchWishlist,
    removeFromWishlist,
  };

  return (
    <shopDataContext.Provider value={value}>
      {children}
    </shopDataContext.Provider>
  );
}

export default ShopContext;
