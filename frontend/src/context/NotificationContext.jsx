/* eslint-disable no-console */
import { createContext, useState, useEffect, useContext } from 'react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import apiConfig from '../utils/apiConfig';
import { userDataContext } from './UserContext';

export const notificationContext = createContext();

const serverURL = (
  import.meta.env.VITE_SERVER_URL ||
  import.meta.env.VITE_BACKEND_URL ||
  'https://riveto.onrender.com'
).replace(/\/+$/, '');

export function NotificationProvider({ children }) {
  const { userData } = useContext(userDataContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket, setSocket] = useState(null);

  const fetchNotifications = async () => {
    if (!userData) return;
    try {
      const response = await apiConfig.get('/notifications');
      setNotifications(response.data);
      setUnreadCount(response.data.filter((n) => !n.read).length);
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await apiConfig.put(`/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiConfig.put('/notifications/read-all-user');
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all read:', err);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await apiConfig.delete(`/notifications/${id}`);
      const wasUnread = notifications.find((n) => n._id === id && !n.read);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Error deleting notification:', err);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchNotifications();

      const newSocket = io(serverURL, {
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      newSocket.on('connect', () => {
        console.log('🔌 Socket.io connected to backend');
      });

      newSocket.on('notification', (newNotif) => {
        console.log('📢 New real-time notification received:', newNotif);
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((prev) => prev + 1);
        toast.info(
          <div>
            <strong className="block text-sm font-semibold">{newNotif.title}</strong>
            <span className="text-xs">{newNotif.message}</span>
          </div>,
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    } else {
      setNotifications([]);
      setUnreadCount(0);
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userData]);

  const value = {
    notifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };

  return (
    <notificationContext.Provider value={value}>
      {children}
    </notificationContext.Provider>
  );
}

export default NotificationProvider;
