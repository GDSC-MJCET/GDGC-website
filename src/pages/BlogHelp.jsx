const image = "/visualise.ai.png";

export default function BlogHelp() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start">
  {/* Image block – appears after Q&A on mobile, before Q&A on desktop */}
  <div className="w-full md:w-[40%] order-2 md:order-1 md:sticky top-24">
    <div className="rounded-2xl overflow-hidden">
      <img
        src={image}
        alt="Blog system visualization"
        className="w-full h-auto max-h-[30vh] md:max-h-none object-contain mt-4 md:mt-0"
      />
    </div>
  </div>

  {/* Q&A block – appears first on mobile, after image on desktop */}
  <div className="w-full mt-16 md:w-[60%] order-1 md:order-2 space-y-10">
    <Section
  question="Why should I write blogs?"
  answer="Writing blogs helps you showcase your knowledge, share insights, spread information across the community, and build a habit of clear communication. It’s a great way to contribute, help others learn, and establish your presence within GDGC."
/>

<Section
  question="Who can delete a blog post?"
  answer="Only the original author of the post and GB (Governing Body) members have permission to delete a blog. This ensures content ownership while allowing moderation when necessary."
/>

<Section
  question="Who can upload a blog?"
  answer="Any active GDGC member can upload a blog. You just need to be logged into the platform, no special roles required to start sharing your thoughts."
/>

<Section
  question="Whom should I report bugs to?"
  answer="Please report any bugs or technical issues to the Tech Captains or the Web Execom team. They are responsible for maintaining the blog system and addressing platform-related problems."
/>

<Section
  question="Which library is used for the blog editor?"
  answer="The editor is built with Editor.js , a block‑based, open‑source WYSIWYG editor. It outputs clean JSON data instead of raw HTML, making content easy to store, render, and extend. Each paragraph, heading, image, or list is a separate block, which gives consistent styling and flexibility. The editor also supports plugins for custom blocks, and we’ve integrated image uploads directly to Cloudinary."
/>

<Section
  question="How are blog banners uploaded?"
  answer="Banners are uploaded directly from the frontend to Cloudinary using Cloudinary’s SDK. Once the upload is complete, the returned image URL is stored in the database alongside the blog post. This approach reduces backend load and simplifies image handling."
/>

<Section
  question="How do likes and comments work?"
  answer="Likes (upvotes) allow members to show appreciation for a post. Each user can like a blog only once. Comments let members discuss or ask questions below a post. Both likes and comments are updated in real time and are visible to all authenticated users. Comments support nested replies, making conversations easy to follow."
/>
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
