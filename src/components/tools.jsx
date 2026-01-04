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
const uploadImageByFile = async(file)=>{
           
            if (!file) return;
            let form = new FormData();
            form.append("image",file)
            
            const {data} = await axios.post(import.meta.env.VITE_SERVER_PATH+"/editor",form,{
                headers : {
                    "Content-Type" : "multipart/form-data"
                }
            });
            let url = data.publicUrl;
            
            return {
                success: 1,
                file: { url }
            }

}
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