import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AuthContext from './context/AuthContext'
import AdminContext from './context/AdminContext'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <AuthContext>
    <AdminContext>
        <App/>
    </AdminContext>
  </AuthContext>
  </BrowserRouter>
)
