import Embed from "@editorjs/embed"
import InlineCode from "@editorjs/inline-code"
import Image from "@editorjs/image"
import Header from "@editorjs/header"
import Quote from "@editorjs/quote"
import Marker from "@editorjs/marker"
import List from "@editorjs/list"
import Paragraph from "@editorjs/paragraph";
import axios from "axios"
const uploadImageByUrl = async(e)=>{
    let link = new Promise((resolve,reject)=>{
        try {
            resolve(e)
        } catch (error) {
            reject(error)
        }
    })
    return link.then(url=>{
        return {
            success:1,
            file: {url}
        }
    })
}
const uploadImageByFile = async (file) => {
    // 1. Guard clause: return early if no file is provided
    if (!file) {
        return {
            success: 0,
            message: "No file provided"
        };
    }

    // 2. Prepare the FormData with required fields for Cloudinary
    const form = new FormData();
    form.append("file", file);
    // ⚠️ Important: Replace this with your actual upload preset name from Cloudinary
    form.append("upload_preset", import.meta.env.VITE_CLOUDINARY_PRESET);

    try {
        // 3. Make the request to Cloudinary
        const { data } = await axios.post(
            import.meta.env.VITE_CLOUDINARY_URL,
            form
        );

        // 4. Check for a successful upload and a valid URL
        if (data?.secure_url) {
            return {
                success: 1,
                file: { url: data.secure_url }
            };
        } else {
            // This case shouldn't happen with a successful Cloudinary response,
            // but it's good to have a fallback.
            console.error("Cloudinary upload succeeded but no URL was returned", data);
            return {
                success: 0,
                message: "Upload succeeded, but no URL was returned by Cloudinary"
            };
        }
    } catch (error) {
        // 5. Comprehensive error handling for network or Cloudinary issues
        console.error("Cloudinary upload failed", error);
        
        // Provide a more specific error message if possible
        let errorMessage = "Upload failed. Please try again.";
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            errorMessage = error.response.data?.error?.message || 
                          `Server error: ${error.response.status}`;
        } else if (error.request) {
            // The request was made but no response was received
            errorMessage = "Network error. Please check your connection.";
        }

        return {
            success: 0,
            message: errorMessage
        };
    }
};
export const tools = {
    embed : Embed,
    inlineCode:InlineCode,
    image:{
        class:Image,
        config:{
            uploader:{
                uploadByUrl : uploadImageByUrl,
                uploadByFile : uploadImageByFile
            }
        }
    },
    header:{
        class:Header,
        levels:[1,2,3],
        defaultLevel:1
    },
    quote:{
        class:Quote,
        inlineToolbar : true
    },
    marker:Marker,
    list:{
        class:List,
        inlineToolbar : true
    }, paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  }
}