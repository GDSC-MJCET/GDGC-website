 import { useState, createContext, type Dispatch, type SetStateAction } from "react"
import type { OutputData } from "@editorjs/editorjs"
import BlogEditor from "../components/BlogEditor"
import axios from "axios"
import toast, { Toaster } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
 export type Blog = {
    title: string;
    banner: string;
    content: unknown;
    des: string;
}
 export type TextEditorState = {
    isReady: boolean | Promise<void>;
    save?: () => Promise<OutputData>;
}
 export type EditorContextValue = {
    blog: Blog;
    setBlog: Dispatch<SetStateAction<Blog>>;
    textEditor: TextEditorState;
    setTextEditor: Dispatch<SetStateAction<TextEditorState>>;
}
 const blogStructure: Blog ={
    title : '',
    banner: '',
    content : '',
    des:'',
}

export const EditorContext = createContext<EditorContextValue>(undefined as unknown as EditorContextValue)
const EditorPage = () =>{
     const [textEditor,setTextEditor] = useState<TextEditorState>({ isReady : false })
    const [blog,setBlog] = useState(blogStructure)
   
     
        return (
            <EditorContext.Provider value={{blog,setBlog,textEditor,setTextEditor}} >
                <Toaster/>
                <BlogEditor  />
                
            </EditorContext.Provider>
        )
    }
    export default EditorPage