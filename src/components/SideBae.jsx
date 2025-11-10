import { IconArticle, IconBrandLine } from '@tabler/icons-react'
import { ChevronDown, ChevronUp ,Settings2 } from 'lucide-react'
import React, { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import gdg from "../assets/gdg-logo.png" 

const SettingSubPanel = () => {
    return (
        <div className='text-[12px] flex flex-col gap-2 pl-6 pt-2'>
            <span className='flex flex-row  gap-2 items-center'>
                {/* <Settings2 className='w-4'/> */}
                <Link to="/team/costumization/qrchange" className='hover:bg-stone-700 py-1 px-3 w-full rounded-md' >QR change </Link> 
                {/* <ChevronUp onClick={handleClickSetting} className='w-4'/> */}
            </span>
            <span className='flex flex-row gap-2 items-center'>
                {/* <Settings2 className='w-4'/> */}
                <Link to="/team/costumization/portfolio" className='hover:bg-stone-700 py-1 px-3 w-full rounded-md' >Portfolio</Link> 
                {/* <ChevronUp onClick={handleClickSetting} className='w-4'/> */}
            </span>
        </div>
    )
}

const SideBae = () => {
    const [clicked , setClicked] = useState("blog")
    const [openSettingPanel , setOpenSettingPanel] = useState(false)
    const navigate = useNavigate();
    function handleClickMagic() {
        setOpenSettingPanel(!openSettingPanel)
    }
    function handleClickRedirect(item , redirect) {
        setClicked(item)
        navigate(redirect)
    }
  return (
    <div className='w-[18%] text-md h-screen  border-r border-r[0.1]'>
            <div className='flex flex-col bottom-1  items-center just'>
                <p className='p-2 border-b  flex h-10 flex-row'>
                    <img src={gdg} alt="" className='w-8 h-4' />
                </p>
            </div>
            {/* in the dashboard section we can have announment and all */}
            <div className='flex flex-col text-[13px] p-5 gap-3'>
                <span onClick={()=>handleClickRedirect("dash","/team/dashboard" )} className={`flex ${clicked == "dash" ? "bg-white text-black" : ""} p-2 rounded-md flex-row cursor-pointer gap-2 items-center`}>
                    <IconBrandLine color='grey' className='w-4'/>
                    <p  >Dashboard</p> 
                </span>
                <span onClick={()=>handleClickRedirect("blog","/team/blog" )} className={`flex ${clicked == "blog" ? "bg-white text-black" : ""} p-2  flex-row gap-2 items-center cursor-pointer rounded-md`}>
                    <IconArticle color='grey' className='w-4'/>
                    <p >Write Blog</p> 
                </span>
                <div>
                    <span className='flex flex-row text-[13px] gap-2 items-center rounded-md'>
                        <Settings2 color='grey' className='w-4'/>
                        <Link to="/team/setting" >Magic</Link> 
                        <button className='hover:bg-stone-700 px-[3px] rounded'>
                        {
                            openSettingPanel == false ? <ChevronUp onClick={handleClickMagic} className='w-4'/> :
                            <ChevronDown color='grey' onClick={handleClickMagic} className='w-4'/> 
                        }
                        
                        </button>
                    </span>
                    {
                        openSettingPanel == false ? <SettingSubPanel/> : ""
                    }
                    
                </div>
            </div>
        </div>
  )
}

export default SideBae