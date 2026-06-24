import { createContext, useEffect, useState, useCallback} from 'react';
import apiConfig from '../utils/apiConfig';

export const userDataContext = createContext();

function UserContext({ children }) {
  const [userData, setUserData] = useState(null);

  const getCurrentUser = useCallback(async () => {
    try {
      const result = await apiConfig.get('/user/getCurrentUser', {
        skipAuthRedirect: true,
        skipGlobalErrorToast: true,
      });
      setUserData(result.data);
    } catch (error) {
      setUserData(null);
      if (error.response?.status !== 401) {
        // eslint-disable-next-line no-console
        console.error('Error fetching current user:', error);
      }
    }

  }, []);

  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

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
