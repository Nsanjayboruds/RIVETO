import axios from 'axios';
import { toast } from 'react-toastify';

const rawServer =
   import.meta.env.VITE_SERVER_URL ||
   import.meta.env.VITE_BACKEND_URL ||
   'https://riveto-backend.onrender.com';



const serverURL = rawServer.replace(/\/+$/, '');

const MESSAGE_MAP = {
  400: 'Invalid request. Please check the data you entered.',
  401: 'Your session has expired. Please log in again.',
  403: 'You do not have permission to perform this action.',
  404: 'The requested resource could not be found.',
  409: 'A conflict occurred while processing your request.',
  422: 'Validation failed. Please review your input and try again.',
  429: 'Too many requests detected. Please wait a moment and try again.',
  500: 'Something went wrong on the server. Please try again later.',
  502: 'The service is temporarily unavailable.',
  503: 'The server is currently under maintenance. Please try again shortly.',
};

const apiConfig = axios.create({
  baseURL: `${serverURL}/api`,
  withCredentials: true,
});

apiConfig.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.name === 'CanceledError' || error.name === 'AbortError') {
      return Promise.reject(error);
    }

    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;
    const message =
      serverMessage ||
      MESSAGE_MAP[status] ||
      error.message ||
      'An unexpected error occurred.';

    if (!error.config?.skipGlobalErrorToast) {
      toast.error(message);
    }

    if (status === 401 && !error.config?.skipAuthRedirect) {
      window.location.replace('/login');
    }

    return Promise.reject(error);
  }
);

export default apiConfig;
