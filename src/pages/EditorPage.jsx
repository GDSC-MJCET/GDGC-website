 import { useState } from "react"
import { createContext } from "react"
import BlogEditor from "../components/BlogEditor"
import axios from "axios"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
 const blogStructure ={
    title : '',
    banner: '',
    content : '',
    tags:[],
    des:'',
}

export const EditorContext = createContext({})
const EditorPage = () =>{
     let [textEditor,setTextEditor] = useState({ isReady : false })
    let [blog,setBlog] = useState(blogStructure)
    const nav = useNavigate ()
     const handleSubmit=async({blog})=>{
        const tl = toast.loading ("Submitting...")
        const res =  await axios.post(import.meta.env.VITE_SERVER_PATH+"/submit-blog",blog,{
            Authorization:`Bearer ${token}` //token which is from maybe cookies, which are stored after the user is authorized 
         })
         if (res.data.success) {
            toast.dismiss (tl)
            toast.success ("Blog submitted")
             nav ("/home")
         }else{
            toast.dismiss (tl)
            toast.error (res.data.error)
         }
     }
        return (
            <EditorContext.Provider value={{blog,setBlog,textEditor,setTextEditor}} >
                <BlogEditor/>
                <button className="roundd-md bg-black text-white cursor-pointer" blog={blog} onClick={handleSubmit} >Publish</button>
            </EditorContext.Provider>
        )
    }
    export default EditorPage