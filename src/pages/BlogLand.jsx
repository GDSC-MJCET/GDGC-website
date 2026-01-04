import { Outlet } from "react-router-dom";
import BlogNavbar from "../components/blog-navbar";

export default function BlogLand() {
    return (
       <>
       
        <BlogNavbar/>
        <Outlet/>
        </>
    )
}