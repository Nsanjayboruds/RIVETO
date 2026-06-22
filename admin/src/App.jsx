import React, { useContext } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Home from "./pages/Home";
import Add from "./pages/Add";
import List from "./pages/List";
import Order from "./pages/Order";
import Login from "./pages/Login";

import { adminDataContext } from "./Context/AdminProvider";

function ProtectedRoute({ children }) {
  const { adminData } = useContext(adminDataContext);

  if (!adminData) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const { adminData } = useContext(adminDataContext);

  return (
    <>
      <ToastContainer />

      <Routes>
        <Route
          path="/login"
          element={
            adminData ? <Navigate to="/" replace /> : <Login />
          }
        />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/add"
          element={
            <ProtectedRoute>
              <Add />
            </ProtectedRoute>
          }
        />

        <Route
          path="/list"
          element={
            <ProtectedRoute>
              <List />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order"
          element={
            <ProtectedRoute>
              <Order />
            </ProtectedRoute>
          }
        />

        <Route
          path="*"
          element={
            <Navigate
              to={adminData ? "/" : "/login"}
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

export default App;