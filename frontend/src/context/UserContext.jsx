import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { authDataContext } from './authContext';

export const userDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState(null); // null, not ""
  const { serverUrl } = useContext(authDataContext);

  const getCurrentUser = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/user/getCurrentUser`, {
        withCredentials: true, // ✅ ensures cookie is sent
      });
      setUserData(result.data);
      console.log("✅ Current user:", result.data);
    } catch (error) {
      setUserData(null);
      if (error.response && error.response.status === 401) {
        console.log("🚫 Unauthorized: No user logged in");
      } else {
        console.error("❌ Error fetching current user:", error);
      }
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const value = {
    userData,
    setUserData,
    getCurrentUser,
  };

  return (
    <userDataContext.Provider value={value}>
      {children}
    </userDataContext.Provider>
  );
}

export default UserContext;
