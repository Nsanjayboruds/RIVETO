import React, { createContext } from 'react';

// Create and export the context
export const authDataContext = createContext();

function authContext({ children }) {
  // ❌ FIXED: Removed leading space before "http"
  const serverUrl ="http://localhost:3000";

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

