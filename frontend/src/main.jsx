import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ThemeProvider from './context/ThemeContext';
import AuthContext from './context/AuthContext';
import UserContext from './context/UserContext';
import ShopContext from './context/ShopContext';
import './index.css';
import './styles/animations.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      <AuthContext>
        <UserContext>
          <ShopContext>
            <App />
          </ShopContext>
        </UserContext>
      </AuthContext>
    </ThemeProvider>
  </BrowserRouter>
);
