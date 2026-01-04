import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
export const SpecificBlog = () => {
    const _id = useParams().postId;
    const IndividualBlogStructure = {
        title: "blog title",
        content: "content",
        banner: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
        des: "blog description",
        upvotes: "5",

    }
    const [blogState,setBlogState] = useState([IndividualBlogStructure])
    // useEffect(() => {
    //     axios.post(`${import.meta.env.VITE_SERVER}/api/v1/blog/get-blog`,{_id}).then((response) => {
    //         console.log(response.data);
    //     }).catch((error) => {
    //         console.error("There was an error fetching the blog! ", error);
    //     }); 
    // }, []);commenting for testing purposes
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">    
       
  {/* Banner */}
  <section className="w-full h-[45vh] relative">
    <img
      src={blogState.banner}
      alt="Blog banner"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-black/40" />
  </section>

  {/* Content */}
  <article className="relative max-w-3xl mx-auto px-6 -mt-24">
    <div className="bg-neutral-950 rounded-2xl p-8 shadow-xl">

      {/* Title */}
      <h1 className="text-4xl font-bold text-white leading-tight mb-6">
        {blogState.title}
      </h1>

      {/* Votes */}
      <div className="flex items-center gap-4 mb-10 text-neutral-400">
        <button className="flex items-center gap-1 hover:text-white transition">
          ▲ <span>Upvote</span>
        </button>
        <button className="flex items-center gap-1 hover:text-white transition">
          ▼ <span>Downvote</span>
        </button>
      </div>

      {/* EditorJS content */}
      <div className="prose prose-invert max-w-none">
        {blogState.content?.blocks?.map((block, index) => {
          switch (block.type) {
            case "header":
              return (
                <h2
                  key={index}
                  className="text-2xl font-semibold text-white mt-8"
                >
                  {block.data.text}
                </h2>
              );

            case "paragraph":
              return (
                <p key={index} className="text-neutral-300 leading-relaxed">
                  {block.data.text}
                </p>
              );

            case "list":
              return (
                <ul key={index} className="list-disc ml-6 text-neutral-300">
                  {block.data.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              );

            case "quote":
              return (
                <blockquote
                  key={index}
                  className="border-l-4 border-neutral-600 pl-4 italic text-neutral-400"
                >
                  {block.data.text}
                </blockquote>
              );

            case "image":
              return (
                <img
                  key={index}
                  src={block.data.file?.url}
                  alt={block.data.caption || ""}
                  className="rounded-lg my-6"
                />
              );

            default:
              return null;
          }
        })}
      </div>
    </div>
  </article>


    </div>
  );
}