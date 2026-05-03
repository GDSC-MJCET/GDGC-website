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
   
     
        return (
            <EditorContext.Provider value={{blog,setBlog,textEditor,setTextEditor}} >
                <Toaster/>
                <BlogEditor  />
                
            </EditorContext.Provider>
        )
    }
    export default EditorPage