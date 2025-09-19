import React, { useState } from 'react'
import { IoMdAddCircleOutline } from "react-icons/io";
import { FaRectangleList } from "react-icons/fa6";
import { SiTicktick } from "react-icons/si";
import { useNavigate, useLocation } from 'react-router-dom';

function Sidebar() {
  let navigate = useNavigate()
  const location = useLocation()
  const [activeItem, setActiveItem] = useState(location.pathname)

  const menuItems = [
    { path: '/add', icon: <IoMdAddCircleOutline className='w-5 h-5' />, label: 'Add Items' },
    { path: '/list', icon: <FaRectangleList className='w-5 h-5' />, label: 'List Items' },
    { path: '/order', icon: <SiTicktick className='w-5 h-5' />, label: 'View Orders' }
  ]

  const handleNavigation = (path) => {
    setActiveItem(path)
    navigate(path)
  }

  return (
    <div className='w-20 md:w-64 min-h-screen bg-gradient-to-b ffrom-slate-900 via-blue-900 to-slate-900 border-r border-gray-200 py-16 fixed left-0 top-0 shadow-lg z-40 transition-all duration-300'>
      <div className='flex flex-col gap-2 pt-8 px-4 text-base'>
        {menuItems.map((item) => (
          <div 
            key={item.path}
            className={`flex items-center justify-center md:justify-start gap-3 rounded-xl px-4 py-3 cursor-pointer transition-all duration-300 group
              ${activeItem === item.path 
                ? 'bg-blue-500 text-white shadow-md' 
                : 'hover:bg-blue-100 text-gray-700'
              }`}
            onClick={() => handleNavigation(item.path)}
          >
            <div className={`transition-transform duration-300 group-hover:scale-110 ${activeItem === item.path ? 'text-white' : 'text-blue-500'}`}>
              {item.icon}
            </div>
            <p className='hidden md:block font-medium'>{item.label}</p>
          </div>
        ))}
      </div>
      
      {/* Sidebar footer with decorative element */}
      <div className="absolute bottom-6 left-0 right-0 px-4">
        <div className="flex justify-center">
          <div className="h-1 w-8 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full"></div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar