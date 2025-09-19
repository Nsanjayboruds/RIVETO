import React from 'react'
import {Route ,Routes } from 'react-router-dom'
import Home from './pages/Home'
import Add from './pages/Add'
import List from './pages/List'
import Order from './pages/Order'
import Login from './pages/Login'
import { useContext } from 'react'
import { adminDataContext } from './context/AdminContext'
 import { ToastContainer, toast } from 'react-toastify';

function App() {
  let {adminData}=useContext(adminDataContext)
  return (
    <>
      <ToastContainer />
   {!adminData ?<Login/>:<>
    <Routes>
       <Route path="/" element={<Home/>}/>
       <Route path="/add" element={<Add/>}/>
       <Route path="/list" element={<List/>}/>
       <Route path="/order" element={<Order/>}/>
       <Route path="/login" element={<Login/>}/>
    </Routes>
    </>
    }
    </>
  )
}

export default App