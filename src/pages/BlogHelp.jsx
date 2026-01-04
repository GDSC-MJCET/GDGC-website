import image from "../../public/visualise.ai.png";

export default function BlogHelp() {
  return (
    <div className="relative h-full w-full bg-black">
  <div
    className="absolute bottom-0 left-0 right-0 top-0  bg-[linear-gradient(45deg,#ffffff25_1px,transparent_1px),linear-gradient(-45deg,#ffffff25_1px,transparent_1px)]  bg-[size:20px_20px]  "
  />

    <div className="min-h-screen bg-zinc-950 text-zinc-100 px-6 py-16">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Blog Help
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto">
          A concise reference for how the blog system works, how data flows,
          and how clients are expected to interact with the API.
        </p>
      </div>

      {/* Main layout */}
      <div className="max-w-7xl mx-auto flex gap-12 items-start">
        
        {/* Left: Illustration */}
        <div className="w-[40%] sticky top-24">
          <div className="rounded-2xl overflow-hidden">
            <img
              src={image}
              alt="Blog system visualization"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        {/* Right: Q&A */}
        <div className="w-[60%] space-y-10">

  <Section
    question="What is the Blog feature used for?"
    answer="The blog is an informal communication space for Execom and GB members. It’s meant for sharing thoughts, updates, announcements, or discussions that don’t fit into formal channels. Think of it as a lightweight internal feed rather than a polished publishing platform."
  />

  <Section
    question="How do I create a new blog post?"
    answer="Navigate to the blog editor from the blog section and start writing directly in the editor. The editor supports structured blocks like headings, paragraphs, and images. Once you’re done, publishing the post makes it immediately visible to other members."
  />

  <Section
    question="How is the blog editor implemented?"
    answer="The editor is built using Editor.js, which provides a block-based writing experience. Each piece of content text, headings, images is stored as structured data rather than raw HTML, making posts easier to render, update, and extend in the future."
  />

  <Section
    question="How do I attach an image to a blog post?"
    answer="Images can be added directly from the editor. When you upload an image, it is sent from the frontend to Cloudinary using its SDK. Cloudinary handles storage, optimization, and delivery, and the editor stores the returned image URL as part of the post content."
  />

  <Section
    question="Is there any other way images can be uploaded?"
    answer="Yes. An alternative approach is uploading images to the backend using Multer middleware and then forwarding them to a storage service. While this works, using Cloudinary directly from the frontend reduces backend load and simplifies image handling."
  />

  <Section
    question="How do upvotes and downvotes work?"
    answer="Each blog post supports upvoting and downvoting to reflect community feedback. Votes are tied to the user’s identity, so a user can’t repeatedly vote on the same post. The total vote count updates in real time to reflect engagement."
  />

  <Section
    question="Can I edit or delete a blog post after publishing?"
    answer="Yes, but only for posts you authored. Editing opens the same editor with the existing content loaded. Deleting a post permanently removes it from the feed and is restricted to the author or administrators."
  />

  <Section
    question="Who can see the blog posts?"
    answer="All published blog posts are visible to authorized members of the platform. Some actions like posting, editing, or voting may require authentication, but reading posts is generally open within the system."
  />

</div>

      </div>

      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-24 text-center text-zinc-500 text-sm">
        Designed for clarity, not magic. If behavior feels surprising,{" it’s "}a bug.
      </div>
    </div>
    </div>
  );
}

function Section({ question, answer }) {
  return (
    <div className=" rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-3 text-zinc-100">
        {question}
      </h2>
      <p className="text-zinc-400 leading-relaxed">
        {answer}
      </p>
    </div>
  );
}
