"use client";
import React from "react";
import ScrollLines from "../components/scroll-component";
import { Outlet, redirect, useLocation, useParams } from "react-router-dom";
import BlogNavbar from "../components/blog-navbar";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import { FaArrowUp} from "react-icons/fa";

const BlogHome = () => {
  const blogStructure = {
    title: "blog title",
    content: "amazing blog content ",
    banner: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
    des: "blog description",
    upvotes:"5",
    redirectLink:"/blog/"
  }
  const location = useLocation()
  const [locations,setLocation] = useState(true)
  const [blogs,setBlogs] = useState([blogStructure])
  // const server = import.meta.env.VITE_SERVER || "http://localhost:"
    // useEffect(()=>{
    //     try {
    //       axios.get(server+"/api/v1/blog/get-blogs").then(data=>{
    //         setBlogs(data.data.blogs).catch(err=>console.log(err))
    //       })
    //     } catch (error) {
    //       console.log(error)
    //     } //get blogs for home pages
        // commenting out for testing purposes
    // },[])

  return (
    <div className="relative h-full w-full bg-black">
{<div>
    <div
    className="absolute bottom-0 left-0 right-0 top-0 z-0  bg-[linear-gradient(to_right,#ffffff20_1px,transparent_1px),linear-gradient(to_bottom,#ffffff20_1px,transparent_1px)]  bg-[size:12px_12px]  "
  />
  
   <section className="grid grid-cols-1 md:grid-cols-3 relative z-10  pt-18" >
    {
      blogs.map((blog,index)=>(
        <div key={index} className="m-4 p-4 border border-white rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-2">{blog.title}</h2>  
          <img src={blog.banner} alt="Blog Banner" className="w-full h-auto mb-4 rounded"/>
          <p className="text-white mb-4">{blog.des}</p>
         
            <button className="text-gray-400 text-sm flex gap-2 relative"> <FaArrowUp  className="absolute -translate-y-1/2 top-1/2 " /> <span className="pl-5" >{blog.upvotes || 0}</span></button>

          
        </div>
      ))
    }
   </section>

   
</div>}
</div>
  );
};
export default BlogHome 