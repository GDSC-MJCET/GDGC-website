import { Link, useNavigate } from "react-router-dom"
import EditorJS from "@editorjs/editorjs"
import axios from 'axios'
import { Toaster, toast } from "react-hot-toast"
import { useContext, useEffect, useState } from "react"
import { EditorContext } from "../pages/EditorPage"
import { tools } from "./tools"
import logo from "../assets/gdg-logo.png"
import defaultBanner from "../assets/random.png"
import Background from "./Background"
import { FaHome } from "react-icons/fa";

const BlogEditor = ({ }) => {
    const { blog, blog: { title, content, des, banner }, setBlog, textEditor, setTextEditor } = useContext(EditorContext)
    const [confirmed, setConfirmed] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const nav = useNavigate()
    useEffect(() => {
        
        // const server = import.meta.env.VITE_SERVER || "http://localhost:3009"
        // axios.post(server+"/confirm").then((data)=>{
        //     if (data.data.success || data.success) {
        //         return;
        //     }else{
        //         nav("/login")
        //     }
        // }).catch((err)=>console.err(err))
        if (!textEditor.isReady) {
            setTextEditor(new EditorJS({
                holder: "textEditor",
                data: Array.isArray(content) ? content[0] : content,
                placeholder: "Give your ideas a Virtual Existence...",
                tools: tools,
                defaultBlock: 'paragraph',
                autofocus: true
            }))
        }
    }, [])

    const imageUploadHandler = async (e) => {
        const file = e.target.files?.[0] || e.dataTransfer?.files?.[0]
        if (!file) return

        const toastId = toast.loading("Uploading Banner...")
        const form = new FormData()
        form.append("file", file)
        form.append('upload_preset', 'ml_ali')
        form.append('cloud_name', 'dcppb6ie3')

        try {
            const { data } = await axios.post("https://api.cloudinary.com/v1_1/dcppb6ie3/image/upload", form)
            if (data?.url) {
                setBlog({ ...blog, banner: data.url })
                toast.success("Banner uploaded!", { id: toastId })
            }
        } catch (error) {
            console.error(error)
            toast.error("Upload failed", { id: toastId })
        }
    }

    const handleTitleOnChange = (e) => {
        const input = e.target
        input.style.height = "auto"
        input.style.height = `${input.scrollHeight}px`
        setBlog({ ...blog, title: e.target.value })
    }

    const handlePublish = async () => {
        if (!banner) return toast.error("Please upload a banner")
        if (!title.trim()) return toast.error("Title cannot be empty")

        if (textEditor.isReady) {
            textEditor.save().then(data => {
                if (data.blocks.length) {
                    setBlog({ ...blog, content: data })
                    toast.success("Content saved! Click publish again to submit.")
                } else {
                    toast.error("Please write some content")
                }
            })
        }
        let auth = JSON.parse(localStorage.getItem("AuthState"))
                const tl = toast.loading ("Submitting blog...")
                const content = await textEditor.save()
                const blogtosent = {
                    ...blog,content
                }
                try {
                    
                    const res =  await axios.post(import.meta.env.VITE_SERVER+"/api/v1/blog/publish-blog",{blog:blogtosent},{headers:{
                        Authorization : `Bearer ${auth.token}`
                    }})
                     if (res.data.success) {
                        toast.dismiss (tl)
                        toast.success ("Blog submitted")
                         return nav("/blog/home")
                     }else{
                        toast.dismiss (tl)
                        toast.error(res.data.error)
                     }
                } catch (error) {
                    toast.dismiss (tl)
                    toast.error ("An error occurred while submitting the blog")
                     console.error (error)
                }

             
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
        }
    }

    const handleDragOver = (e) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = (e) => {
        e.preventDefault()
        setIsDragging(false)
        imageUploadHandler(e)
    }
      
    const handleHomeOnclick = () => {

        setConfirmed(true)
       
     }
     useEffect(() => {
        setBlog({ ...blog, content: textEditor.isReady ? textEditor : content })
     }, [textEditor])
    return (
        <div className="bg-black" >

            <nav className="sticky top-0 z-50 px-4 sm:px-6 py-3 sm:py-4">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                    <Link to="/" className="flex items-center gap-2 sm:gap-3 group">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg p-1 sm:p-1.5 group-hover:scale-105 transition-transform">
                            <img src={logo} alt="GDGC" className="w-full h-full object-contain" />
                        </div>
                        <span className="text-xl sm:text-2xl text-white font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                           GDGC Blogs
                        </span>
                    </Link>

                    <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                        <div className="hidden md:block">
                            <p className="text-white font-medium text-xl sm:text-2xl">
                                {title ? title : 'Untitled Blog'}
                            </p>
                        </div>
                        <button
                            onClick={handlePublish}
                            className="relative overflow-hidden px-4 sm:px-6 py-1.5 sm:py-2.5 rounded-lg text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 text-xl sm:text-2xl"
                        >
                            <span className="relative z-10">Publish</span>
                            <div className="absolute inset-0 bg-white/20 -translate-x-full hover:translate-x-full transition-transform duration-500" />
                        </button>
                        <p className="text-white text-2xl sm:text-3xl cursor-pointer" onClick={handleHomeOnclick}>
                            <FaHome />
                        </p>
                    </div>
                </div>
            </nav>

            <Toaster 
                position="top-center"
                toastOptions={{
                    style: {
                        background: '#333',
                        color: '#fff',
                    },
                    success: {
                        iconTheme: { primary: '#10b981', secondary: '#fff' },
                    },
                }}
            />
            <main className={(confirmed ? "  " : "hidden")} > 
                
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-md rounded-xl bg-[#111] border border-gray-700 p-5 sm:p-6 shadow-xl">
        
        <h2 className="text-base sm:text-lg font-semibold text-white mb-3">
          Danger
        </h2>

        <p className="text-sm sm:text-base text-gray-300 mb-6">
          Changes you made won't be saved if you leave. Are you sure you want to go back to home?
        </p>

        <div className="flex justify-end gap-3">
          <p
            onClick={() => setConfirmed(false)}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-gray-700 text-white hover:text-gray-200 cursor-pointer transition text-sm sm:text-base"
          >
            Cancel
          </p>

          <Link to={"/blog"}
            className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition text-sm sm:text-base"
          >
            Confirm
          </Link>
        </div>

      </div>
    </div>
  
                
                 </main>
            <main className={"max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8" + (confirmed ? " hidden " : "")}>
                {/* Banner Upload Area */}
                <div 
                    className={`relative group cursor-pointer rounded-2xl overflow-hidden border-2 border-dashed transition-all duration-300 ${
                        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                    } ${banner ? 'border-solid' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <div className="aspect-video relative">
                        <img 
                            src={banner || defaultBanner} 
                            alt="Blog banner" 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="text-center text-white p-4">
                                <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="font-medium text-sm sm:text-base">{banner ? 'Change Banner' : 'Upload Banner'}</p>
                                <p className="text-xs sm:text-sm opacity-80">Click or drag & drop</p>
                            </div>
                        </div>
                    </div>
                    
                    <input 
                        type="file" 
                        id="uploadBanner" 
                        accept=".png,.jpg,.jpeg" 
                        hidden 
                        onChange={imageUploadHandler} 
                    />
                    <label htmlFor="uploadBanner" className="absolute inset-0 cursor-pointer" />
                </div>
                {/* Title Input */}
                <div className="mt-6 sm:mt-8">
                    <textarea
                        placeholder="Title"
                        onKeyDown={handleKeyDown}
                        onChange={handleTitleOnChange}
                        defaultValue={title}
                        className="w-full line-clamp-1 text-3xl sm:text-5xl md:text-6xl font-bold text-white placeholder-gray-300 resize-none outline-none leading-tight tracking-tight min-h-[2.5rem] sm:min-h-[3rem] focus:placeholder-gray-400 transition-colors duration-200 bg-transparent"
                        rows={1}
                    />
                    <div className="mt-2 sm:mt-3 h-1 w-16 sm:w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                </div>

                {/* Description Input */}
                <input 
                    value={des} 
                    placeholder="Description " 
                    onChange={(e) => setBlog({...blog, des: e.target.value})}
                    className="mt-4 sm:mt-6 w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-white placeholder-gray-400 transition-all duration-200 font-medium focus:outline-none text-sm sm:text-base"
                />


                {/* Editor Container */}
<div className="mt-6 sm:mt-10">
  

    <div
      id="textEditor"
      className="min-h-[300px] sm:min-h-[500px] p-3 sm:p-6 text-white overflow-x-auto"
    />
  
</div>
            </main>
            
        </div>
    )
}

export default BlogEditor