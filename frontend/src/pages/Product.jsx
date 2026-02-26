import React from 'react'
import LastestCollection from '../components/LastestCollection'
import BestSeller from '../components/BestSeller'

function Product() {
  return (
    <div className='w-[100vw] min-h-[100vh] bg-white dark:bg-gradient-to-l dark:from-[#141414] dark:to-[#0c2025] flex items-center justify-start flex-col py-[20px] transition-colors duration-300'>
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