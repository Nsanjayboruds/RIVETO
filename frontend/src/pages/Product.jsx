import React from 'react'
import LastestCollection from '../components/LastestCollection'
import BestSeller from '../components/BestSeller'

function Product() {
  return (
    <div className='w-[100vw] min-h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] flex items-center justify-start flex-col py-[20px]'>
        <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[10px] flex-col'>
            <LastestCollection/>
        </div>
         <div className='w-[100%] min-h-[70px] flex items-center justify-center gap-[10px] flex-col'>
            <BestSeller/>
        </div>
    </div>
  )
}

export default Product