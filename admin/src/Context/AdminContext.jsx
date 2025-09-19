import React, { Children, createContext, useContext, useEffect, useState } from 'react'
import { authDataContext } from './AuthContext'
import axios from 'axios'
export const adminDataContext =createContext()
function AdminContext({children}) {
    let [adminData,setAdminData]=useState(null)
    let {serverUrl}=useContext(authDataContext)


    const getAdmin = async()=>{
      try {
        let result =await axios.get(serverUrl + '/api/user/getAdmin', {
          withCredentials: true})

          setAdminData(result.data)
          console.log(result.data);
          
      } catch (error) {
        setAdminData(null)
        console.log(error);
        
        
      }
    }
    useEffect(()=>{

      getAdmin()
    },[])

    let value={
      adminData,
      setAdminData,
      getAdmin
    }
  return (
   
        <adminDataContext.Provider value={value}>
            {children}
        </adminDataContext.Provider>
   
  )
}

export default AdminContext