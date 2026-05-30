import { createContext } from 'react';

// Create and export the context
export const authDataContext = createContext();

function authContext({ children }) {
  // Use Vite env var if available (local dev uses VITE_BACKEND_URL)
  const rawServer =
    import.meta.env.VITE_BACKEND_URL || 'https://riveto-backend.onrender.com';
  const serverUrl = rawServer.replace(/\/+$/, '');

  const value = {
    serverUrl,
  };

  return (
    // ✅ FIXED: Removed unnecessary <div> wrapper
    <authDataContext.Provider value={value}>
      {children}
    </authDataContext.Provider>
  );
}

export default authContext;
