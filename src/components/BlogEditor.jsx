import { Link, useNavigate } from "react-router-dom"
import EditorJS from "@editorjs/editorjs"
import axios from 'axios'
import { Toaster, toast } from "react-hot-toast"
import { useContext, useEffect, useState } from "react"
import { EditorContext } from "../pages/EditorPage"
import { tools } from "./tools"
import logo from "../assets/gdg-logo.png"
import defaultBanner from "../assets/random.png"

const BlogEditor = () => {
    const { blog, blog: { title, content, des, banner }, setBlog, textEditor, setTextEditor } = useContext(EditorContext)
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

    const handlePublish = () => {
        if (!banner) return toast.error("Please upload a banner")
        if (!title.trim()) return toast.error("Title cannot be empty")

        if (textEditor.isReady) {
            textEditor.save().then(data => {
                if (data.blocks.length) {
                    setBlog({ ...blog, content: data })
                    
                } else {
                    toast.error("Please write some content")
                }
            })
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

    return (
        <>
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 p-1.5 group-hover:scale-105 transition-transform">
                            <img src={logo} alt="GDGC" className="w-full h-full object-contain filter brightness-0 invert" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            GDGC Blog Editor
                        </span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <div className="hidden md:block">
                            <p className="text-sm text-gray-600 font-medium">
                                {title ? title : 'Untitled Blog'}
                            </p>
                        </div>
                        <button
                            onClick={handlePublish}
                            className="relative overflow-hidden px-6 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
                        >
                            <span className="relative z-10">Publish</span>
                            <div className="absolute inset-0 bg-white/20 -translate-x-full hover:translate-x-full transition-transform duration-500" />
                        </button>
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

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                            <div className="text-center text-white">
                                <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                <p className="font-medium">{banner ? 'Change Banner' : 'Upload Banner'}</p>
                                <p className="text-sm opacity-80">Click or drag & drop</p>
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

                {/* Description Input */}
                <input 
                    value={des} 
                    placeholder="Write a compelling description..." 
                    onChange={(e) => setBlog({...blog, des: e.target.value})}
                    className="mt-6 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-medium"
                />

                {/* Title Input */}
                <div className="mt-8">
                    <textarea
                        placeholder="title:Yap Yap Yap ...."
                        onKeyDown={handleKeyDown}
                        onChange={handleTitleOnChange}
                        defaultValue={title}
                        className="w-full line-clamp-1 text-5xl md:text-6xl font-bold text-gray-900 placeholder-gray-300 resize-none outline-none leading-tight tracking-tight min-h-[3rem] focus:placeholder-gray-400 transition-colors duration-200 bg-transparent"
                        rows={1}
                    />
                    <div className="mt-3 h-1 w-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full" />
                </div>

                {/* Editor Container */}
                <div className="mt-10">
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div id="textEditor" className="min-h-[500px] p-6" />
                    </div>
                </div>
            </main>
        </>
    )
}

export default BlogEditor