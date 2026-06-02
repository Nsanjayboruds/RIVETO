import { createContext, useEffect, useState } from 'react';
import apiConfig from '../utils/apiConfig';

export const userDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);

  const getCurrentUser = async () => {
    try {
      const result = await apiConfig.get('/user/getCurrentUser', {
        skipAuthRedirect: true,
        skipGlobalErrorToast: true,
      });
      setUserData(result.data);
      console.log('✅ Current user:', result.data);}
     catch (error) {
      setUserData(null);
      if (error.response && error.response.status === 401) {
        console.log('🚫 Unauthorized: No user logged in');
      } else {
        console.error('❌ Error fetching current user:', error);
      }
    }
// catch (error) {

//   console.log('⚠ Using temporary demo user');

//   setUserData({
//     _id: "temp123",
//     name: "Demo User",
//     email: "demo@test.com",
//   });

// }
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
