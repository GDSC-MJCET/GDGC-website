import { Outlet } from "react-router-dom";
import BlogNavbar from "../components/blog-navbar";
import Background from "../components/Background";
import { useState } from "react"; 
export default function BlogLand() {
    const [removeNavbar,setRemoveNavbar] = useState(false)
    return (
       <div className="bg-black min-h-screen" >

       
        <BlogNavbar removeNavbar={removeNavbar} setRemoveNavbar={setRemoveNavbar} />
        <Outlet/>
       </div>
        
    )
}