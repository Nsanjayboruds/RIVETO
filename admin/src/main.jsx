import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthProvider from './context/AuthProvider'
// import AdminContext from './Context/AdminProvider.jsx'
import AdminProvider from './Context/AdminProvider'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthProvider>
    <AdminProvider>
        <App/>
    </AdminProvider>
  </AuthProvider>
  </BrowserRouter>
)
 