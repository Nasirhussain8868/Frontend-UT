"use client"
import React, { useEffect, useState } from 'react'
import Login from '../Login'
import axios from 'axios'

const AuthProvider = ({children}) => {
 const [isSuccess,setIsSucess] = useState(false)
 const token  = localStorage.getItem("token")
 const loggedUser = async () => {
    const url = "http://127.0.0.1:8000/api/loggeduser"
    const config = {
        headers: {
            'Authorization': `Bearer ${token}` // Set the bearer token
        }
    };
    await axios.get(url,config)
    .then((response) => {
        if(response.data.status === 'success'){
          setIsSucess(true)
          console.log(response.data.data)
        }
    })
 }
 useEffect(() => {
    loggedUser()
 },[token,isSuccess])
  return (
    <>
      {
        isSuccess ? children : <Login />
      }
    </>
  )
}

export default AuthProvider