import { Outlet } from "react-router-dom";
import BlogNavbar from "../components/blog-navbar";
import Background from "../components/Background";
import { useState } from "react"; 
export default function BlogLand() {
    return (
       <div className="bg-black min-h-screen" >
        
        <Outlet/>
       </div>
        
    )
}