import React, { useContext, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { authDataContext } from "../Context/AuthProvider";
import { adminDataContext } from "../Context/AdminProvider";
import { adminNotificationContext } from "../Context/NotificationContext";
import { FaBell, FaTrash, FaCheck } from "react-icons/fa";

function Nav() {
  let navigate = useNavigate();
  let { serverUrl } = useContext(authDataContext);
  let { getAdmin } = useContext(adminDataContext);
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useContext(adminNotificationContext);

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);

  // Click outside to close notifications popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      const result = await axios.post(`${serverUrl}/api/auth/logout`, {}, {
        withCredentials: true,
      });
      console.log(result.data);
      getAdmin(); // refresh admin context
      navigate("/login");
    } catch (error) {
      console.log(error);
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="w-full h-16 bg-white z-50 fixed top-0 flex items-center justify-between px-6 md:px-8 shadow-md shadow-gray-200">
      <div
        className="flex items-center justify-start gap-3 cursor-pointer transition-transform hover:scale-105"
        onClick={() => navigate("/")}
      >
        {/* <img src={logo} alt="Riveto Logo" className='h-10 w-auto' /> */}
        <h1 className="text-2xl font-bold text-gray-800 font-sans">Riveto</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* NOTIFICATIONS */}
        <div className="relative" ref={notificationsRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-300 relative cursor-pointer flex items-center justify-center border-0 outline-none"
            aria-label="Notifications"
          >
            <FaBell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] w-4.5 h-4.5 rounded-full flex items-center justify-center font-bold">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-gray-200 shadow-2xl rounded-2xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <span className="font-semibold text-sm text-gray-800">Admin Alerts</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-500 cursor-pointer bg-transparent border-0"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500">
                    No new alerts
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n._id}
                      className={`p-3.5 text-left transition-colors hover:bg-gray-50 ${
                        n.read ? "bg-transparent" : "bg-blue-50/30"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className={`text-xs font-bold ${n.read ? "text-gray-600" : "text-blue-600"}`}>
                          {n.title}
                        </span>
                        <div className="flex items-center gap-2 shrink-0">
                          {!n.read && (
                            <button
                              onClick={() => markAsRead(n._id)}
                              title="Mark read"
                              className="text-[10px] text-blue-600 hover:underline cursor-pointer bg-transparent border-0"
                            >
                              <FaCheck />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(n._id)}
                            title="Delete"
                            className="text-gray-400 hover:text-red-500 cursor-pointer bg-transparent border-0"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 leading-normal">{n.message}</p>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        {new Date(n.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* LOGOUT BUTTON */}
        <button
          className={`text-sm font-medium py-2 px-5 rounded-full transition-all duration-300 flex items-center justify-center
            ${
              isLoggingOut
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          onClick={logout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              LOGGING OUT...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              LOGOUT
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default Nav;
