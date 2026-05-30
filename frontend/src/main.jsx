import { createRoot } from 'react-dom/client';
import './index.css';
import './styles/animations.css';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <ThemeProvider>
      {' '}
      {/* ⬅️ wrap here */}
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
