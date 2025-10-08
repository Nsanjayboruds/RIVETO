// context/AdminContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { authDataContext } from './AuthContext';
import axios from 'axios';

export const adminDataContext = createContext();

function AdminProvider({ children }) {
  const [adminData, setAdminData] = useState(null);
  const { serverUrl } = useContext(authDataContext);

  const getAdmin = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/getAdmin`, {
        withCredentials: true,
      });

      setAdminData(result.data);
      console.log('Admin data:', result.data);
    } catch (error) {
      setAdminData(null);
      console.error('Error fetching admin data:', error);
    }
  };

  useEffect(() => {
    getAdmin();
  }, []);

  const value = {
    adminData,
    setAdminData,
    getAdmin,
  };

  return (
    <adminDataContext.Provider value={value}>
      {children}
    </adminDataContext.Provider>
  );
}

export default AdminProvider;
