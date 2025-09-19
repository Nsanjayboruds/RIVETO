import React from 'react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
    let navigate =useNavigate()
  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-l  from-[#1e24c8]  to-[#28c8f0] md:text-[70px] text-[30px]  flex items-center justify-center text-[white] flex-col  gap-[20px]'>
        404 Page Not Found
        <button className='bg-[white] px-[20px] py-[10px] rounded-2xl text-[18px] text-[black] cursor-pointer' onClick={()=>navigate("/login")}>Login</button>

    </div>
  )
}

export default NotFound