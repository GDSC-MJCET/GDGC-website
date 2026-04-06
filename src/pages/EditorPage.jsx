 import { useState } from "react"
import { createContext } from "react"
import BlogEditor from "../components/BlogEditor"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
 const blogStructure ={
    title : '',
    banner: '',
    content : '',
    des:'',
}

export const EditorContext = createContext({})
const EditorPage = () =>{
     let [textEditor,setTextEditor] = useState({ isReady : false })
    let [blog,setBlog] = useState(blogStructure)
    const nav = useNavigate ()
     const handleSubmit=async()=>{
        let auth = JSON.parse(localStorage.getItem("AuthState"))
        console.log(blog,"this si the blog being sent");
        
        const tl = toast.loading ("Submitting...")
        try {
            const res =  await axios.post(import.meta.env.VITE_SERVER+"/api/v1/blog/publish-blog",{blog},{headers:{
                Authorization : `Bearer ${auth.token}`
            }})
             if (res.data.success) {
                toast.dismiss (tl)
                toast.success ("Blog submitted")
                 nav ("/home")
             }else{
                toast.dismiss (tl)
                toast.error (res.data.error)
             }
        } catch (error) {
            toast.dismiss (tl)
            toast.error ("An error occurred while submitting the blog")
             console.error (error)
        }
     }
        return (
            <EditorContext.Provider value={{blog,setBlog,textEditor,setTextEditor}} >
                <Toaster/>
                <BlogEditor  />
                <button className="roundd-md bg-black text-white cursor-pointer"  onClick={handleSubmit} >Publish</button>
            </EditorContext.Provider>
        )
    }
    export default EditorPage