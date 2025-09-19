
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import AuthContext from './context/authContext.jsx';
import UserContext from './context/UserContext.jsx';
import ShopContext from './context/ShopContext.jsx';
import ThemeProvider from './context/ThemeContext.jsx'; // ⬅️ import

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider> {/* ⬅️ wrap here */}
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
