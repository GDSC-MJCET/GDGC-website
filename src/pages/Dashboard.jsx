import { IconBrandLine } from '@tabler/icons-react'
import { ChartLine, Settings2 } from 'lucide-react'
import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import SideBae from '../components/SideBae'
import axios from 'axios'

const Dashboard = () => {
  const auth =  JSON.parse(localStorage.getItem("AuthState"))
  
  const nav = useNavigate()
  useEffect(()=>{
    axios.get(import.meta.env.VITE_SERVER+"/api/v1/dashboard/get-dashboard",{headers:{
    Authorization:`Bearer ${auth?.token}`
   }}).then((data)=>{
    console.log(data)
    if (!data.data.success) {
       nav("/login")
    }
    }).catch((err)=>{
      console.log(err,"this is err")
      if (err.status==401) {
        nav("/login")
      }
    })
  },[])
 
  return (
        <div>
            <p>Dashboard</p>
        </div>
  )
}

export default Dashboard