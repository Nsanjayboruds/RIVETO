import React from 'react'

function Title({text1,text2}) {
  return (
    <div className='inline-flex gap-2 items-center text-center mb-3 text-[35px] md:text-[40px]'>
        <p className='text-blue-900 dark:text-blue-100 font-bold font-["Prata"]'>{text1} <span className='text-teal-600 dark:text-[#a5faf7] font-medium'>{text2}</span>
      </p>
    </div>
  )
}

export default Title