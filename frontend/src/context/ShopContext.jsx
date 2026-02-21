import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { authDataContext } from './AuthContext';
import axios from 'axios';
import { userDataContext } from './UserContext';


export const shopDataContext = createContext();

function ShopContext({ children }) {
  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItem, setCartItem] = useState({});
  const [compareList, setCompareList] = useState([]);
  const [comparePanelOpen, setComparePanelOpen] = useState(false);
  const { serverUrl } = useContext(authDataContext);
  const { userData } = useContext(userDataContext); //

  const currency = '₹';
  const delivery_fee = 40;

  // Fetch products from server
  const getProducts = async () => {
    try {
      const result = await axios.get(serverUrl + "/api/product/list");
      console.log("Fetched products:", result.data);
      setProduct(result.data);
    } catch (error) {
      console.log("Error fetching products:", error);
    }
  };

  // Add product to cart
  const addtoCart = async (itemId, size) => {
    if (!size) {
      console.log("Select Product Size");
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
    console.log(cartData);


    if (userData) {
      try {
        let result = await axios.post(serverUrl + '/api/cart/add', { itemId, size }, { withCredentials: true })
        console.log(result.data);

      } catch (error) {
        console.log(error);

      }
    }
  };


  const getUserCart = async () => {
    if (!userData) return; // Don't call API if not logged in

    try {
      const result = await axios.post(serverUrl + "/api/cart/get", {}, { withCredentials: true });
      setCartItem(result.data);
    } catch (error) {
      console.log("❌ Error fetching cart:", error);
    }
  };

  const UpdateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItem);
    cartData[itemId][size] = quantity
    setCartItem(cartData)


    if (userData) {
      try {
        await axios.post(serverUrl + "/api/cart/update", { itemId, size, quantity }, { withCredentials: true })
      } catch (error) {
        console.log(error);



      }
    }
  }

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
          console.error("Error counting cart item", error);
        }
      }
    }
    return totalCount; // ✅ Now returns the total count
  };


  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItem) {
      let itemInfo = product.find((product) => product._id === items);
      for (const item in cartItem[items]) {
        try {
          if (cartItem[items][item] > 0) {
            totalAmount += itemInfo.price * cartItem[items][item];
          }
        } catch (error) {

        }
      }
    }
    return totalAmount
  }

  const toggleCompare = (product) => {
    setCompareList(prev => {
      const exists = prev.find(item => item._id === product._id);
      if (exists) {
        toast.info("Removed from comparison", {
          position: "bottom-center",
          autoClose: 1000,
          hideProgressBar: true
        });
        return prev.filter(item => item._id !== product._id);
      }
      if (prev.length >= 4) {
        toast.warning("You can compare up to 4 products", {
          position: "bottom-center",
          autoClose: 2000
        });
        return prev;
      }
      toast.success("Added to comparison", {
        position: "bottom-center",
        autoClose: 1000,
        hideProgressBar: true
      });
      return [...prev, product];
    });
  };

  const removeFromCompare = (id) => {
    setCompareList(prev => prev.filter(item => item._id !== id));
  };

  const toggleComparePanel = (state) => {
    setComparePanelOpen(state !== undefined ? state : !comparePanelOpen);
  };

  useEffect(() => {
    getProducts();
  }, []);
  useEffect(() => {
    if (userData) {
      getUserCart();
    }
  }, [userData]);

  const value = {
    product,
    currency,
    delivery_fee,
    getProducts,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItem,
    addtoCart,
    getCartCount,
    setCartItem, UpdateQuantity, getCartAmount,
    compareList, toggleCompare, removeFromCompare, comparePanelOpen, toggleComparePanel
  };

  return (
    <shopDataContext.Provider value={value}>
      {children}
    </shopDataContext.Provider>
  );
}

export default ShopContext;
