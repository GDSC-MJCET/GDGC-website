"use client";
import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { FaComment, FaArrowUp, FaReply } from "react-icons/fa";
import axios from "axios";
import {toast,Toaster} from 'react-hot-toast';
import { useParams } from "react-router-dom";

const SpecificBlog = () => {
  const server = import.meta.env.VITE_SERVER;
  const authRaw = typeof window !== "undefined" ? localStorage.getItem("AuthState") : null;
  const auth = authRaw ? JSON.parse(authRaw) : null;

  const [blog, setBlog] = useState(null);
  const [liked, setLiked] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [replyInputs, setReplyInputs] = useState({});
  const [replyVisible, setReplyVisible] = useState({});
  const replyInputRefs = useRef({});
  const [name, setName] = useState("");
  const { blogId } = useParams();

  // Fetch blog
  console.log("Fetching blog with id:", blogId);
  useEffect(() => {
    if ( !blogId) return;
    axios
      .post(
        `${server}/api/v1/blog/get-blog`,
        { _id: blogId }
      )
      .then((res) => {
        const b = res?.data || null;
        if (!b) return console.warn("get-blog returned nothing");
        const comments = (b.comments || []).map((c) => ({ ...c, showReplies: !!c.showReplies }));
        setBlog({ ...b, comments });
        setLiked(Boolean(b.isLiked));
        setName(res?.data?.Name || "");
      
      })
      .catch((err) => console.error("fetch blog:", err));
  }, [server, auth?.token, blogId]);

  // Click outside to collapse reply inputs
  useEffect(() => {
    const handler = (e) => {
      const clickedInsideReplyBox = e.target.closest(".reply-box");
      const clickedReplyToggle = e.target.closest(".reply-toggle");
      const clickedShowReplies = e.target.closest(".show-replies-toggle");
      if (!clickedInsideReplyBox && !clickedReplyToggle && !clickedShowReplies) {
        setReplyVisible({});
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Focus‑preserving effect for reply inputs
  useEffect(() => {
    Object.keys(replyVisible).forEach((id) => {
      if (!replyVisible[id]) return;
      const el = replyInputRefs.current[id];
      if (!el) return;
      if (document.activeElement !== el) {
        try {
          el.focus();
          const val = replyInputs[id] || "";
          if (typeof el.setSelectionRange === "function") {
            el.setSelectionRange(val.length, val.length);
          }
        } catch (e) {}
      }
    });
  }, [replyVisible, replyInputs]);

  // Build comment tree
  const buildCommentTree = (comments) => {
    if (!Array.isArray(comments) || comments.length === 0) return [];
    const commentMap = new Map();
    const roots = [];
    comments.forEach((c) => commentMap.set(String(c._id), { ...c, replies: [] }));
    commentMap.forEach((c) => {
      if (c.replyTo && commentMap.has(String(c.replyTo))) {
        commentMap.get(String(c.replyTo)).replies.push(c);
      } else {
        roots.push(c);
      }
    });
    return roots;
  };

  // Optimistic update helper
  const replaceOrAppendCommentLocal = (tempId, realComment) => {
    setBlog((prev) => {
      if (!prev) return prev;
      const comments = Array.isArray(prev.comments) ? prev.comments.slice() : [];
      const found = comments.some((c) => String(c._id) === String(tempId));
      const updatedComments = found
        ? comments.map((c) => (String(c._id) === String(tempId) ? realComment : c))
        : [...comments, realComment];
      return { ...prev, comments: updatedComments };
    });
  };

  // Like / unlike
  const handleLike = async () => {
    if (!auth?.token || !blog) return toast.error("You must be logged in to perform this action.");
    try {
      const { data } = await axios.post(
        `${server}/api/v1/blog/like-blog`,
        { _id: blog._id },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      if (data?.message === "You have already upvoted this blog") {
        return handleUnlike();
      }
      setLiked(true);
      setBlog((prev) =>
        prev ? { ...prev, activity: { ...(prev.activity || {}), total_upvotes: (prev.activity?.total_upvotes || 0) + 1 } } : prev
      );
    } catch (err) {
      console.error("like error:", err);
    }
  };

  const handleUnlike = async () => {
    if (!auth?.token || !blog) return toast.error("You must be logged in to perform this action.");
    try {
      await axios.post(
        `${server}/api/v1/blog/unlike-blog`,
        { _id: blog._id },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setLiked(false);
      setBlog((prev) =>
        prev ? { ...prev, activity: { ...(prev.activity || {}), total_upvotes: Math.max(0, (prev.activity?.total_upvotes || 0) - 1) } } : prev
      );
    } catch (err) {
      console.error("unlike error:", err);
    }
  };

  // Add top‑level comment
  const handleAddComment = async () => {
    if (!auth?.token || !blog) return toast.error("You must be logged in to perform this action.");
    const text = (commentInput || "").trim();
    if (!text || !blog) return;
    const tempId = `temp-${Date.now()}`;
    const newComment = {
      _id: tempId,
      text,
      commentedBy: { name: name || "You" },
      level: 0,
      replyTo: null,
      createdAt: new Date().toISOString(),
    };
    setBlog((prev) =>
      prev
        ? {
            ...prev,
            comments: [...(Array.isArray(prev.comments) ? prev.comments : []), newComment],
            activity: { ...(prev.activity || {}), total_comments: (prev.activity?.total_comments || 0) + 1 },
          }
        : prev
    );
    setCommentInput("");
    try {
      const res = await axios.post(
        `${server}/api/v1/blog/add-comment`,
        { _id: blog._id, text, level: 0, replyTo: null, isReply: false },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      const realComment = res?.data?.comment;
      if (realComment) replaceOrAppendCommentLocal(tempId, realComment);
    } catch (err) {
      console.error("add-comment failed:", err);
    }
  };

  // Add reply
  const handleAddReply = async (parentComment) => {

    if (!blog || !auth?.token) return toast.error("You must be logged in to perform this action.");
    const parentIdStr = String(parentComment._id);
    const text = (replyInputs[parentIdStr] || "").trim();
    if (!text) return;
    const tempId = `temp-${Date.now()}-reply`;
    const newReply = {
      _id: tempId,
      text,
      commentedBy: { name: name || "You" },
      level: (parentComment.level || 0) + 1,
      replyTo: parentComment._id,
      createdAt: new Date().toISOString(),
    };
    setBlog((prev) =>
      prev
        ? {
            ...prev,
            comments: [...(Array.isArray(prev.comments) ? prev.comments : []), newReply],
            activity: { ...(prev.activity || {}), total_comments: (prev.activity?.total_comments || 0) + 1 },
          }
        : prev
    );
    setReplyInputs((prev) => ({ ...prev, [parentIdStr]: "" }));
    setReplyVisible((prev) => ({ ...prev, [parentIdStr]: false }));
    try {
      const res = await axios.post(
        `${server}/api/v1/blog/add-comment`,
        { _id: blog._id, text, level: parentComment.level + 1, replyTo: parentComment._id, isReply: true },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );
      const realReply = res?.data?.comment;
      if (realReply) replaceOrAppendCommentLocal(tempId, realReply);
    } catch (err) {
      console.error("add-reply failed:", err);
    }
  };

  const handleReplyChange = (commentId, value) => {
    setReplyInputs((prev) => ({ ...prev, [String(commentId)]: value }));
  };

  const toggleReplyVisible = (commentId) => {
    const key = String(commentId);
    setReplyVisible((prev) => ({ ...prev, [key]: !prev[key] }));
    if (!replyInputRefs.current[key]) replyInputRefs.current[key] = null;
  };

  const toggleShowReplies = (commentId) => {
    setBlog((prev) => {
      if (!prev) return prev;
      const comments = Array.isArray(prev.comments)
        ? prev.comments.map((c) => (String(c._id) === String(commentId) ? { ...c, showReplies: !c.showReplies } : c))
        : [];
      return { ...prev, comments };
    });
  };

  // Memoized comment component (styled)
  const CommentItem = memo(function CommentItem({ comment }) {
    const idStr = String(comment._id);
    const visible = Boolean(replyVisible[idStr]);
    const assignRef = useCallback((el) => {
      replyInputRefs.current[idStr] = el;
    }, []);

    return (
      <div className="mb-4" style={{ marginLeft: (comment.level || 0) > 0 ? "1.5rem" : 0 }}>
        <Toaster/>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-black/20">
          <div className="flex justify-between items-start">
            <span className="font-bold text-green-400 text-sm">{comment.commentedBy?.name || "Anonymous"}</span>
            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-gray-200 text-sm mt-2">{comment.text}</p>

          <div className="mt-3 flex gap-4 items-center">
            <button
              onClick={() => toggleShowReplies(comment._id)}
              className={`text-xs text-gray-400 hover:text-green-400 show-replies-toggle ${
                comment.showReplies ? "text-green-400" : ""
              }`+  (comment.replies.length>0 ? " " : " hidden") }
            >
              Replies 
            </button>
            <button
              onClick={() => toggleReplyVisible(idStr)}
              className="reply-toggle text-xs text-gray-400 hover:text-green-400 flex items-center gap-2"
            >
              <FaReply size={12} /> Reply
            </button>
          </div>
        </div>

        {visible && (
          <div className="reply-box flex gap-2 mt-2 ml-4">
            <input
              ref={assignRef}
              type="text"
              value={replyInputs[idStr] || ""}
              onChange={(e) => handleReplyChange(idStr, e.target.value)}
              placeholder="Write a reply."
              className="flex-1 bg-gray-900 text-white border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-400/50"
            />
            <button
              onClick={() => handleAddReply(comment)}
              className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition"
            >
              Post
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && comment.showReplies && (
          <div className="mt-2">
            {comment.replies.map((r) => (
              <CommentItem key={String(r._id)} comment={r} />
            ))}
          </div>
        )}
      </div>
    );
  });

  if (!blogId) return <div className="p-8 text-center text-red-400">No blog id provided in props or URL.</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <main className="max-w-5xl mx-auto">
        {/* HEADER */}
        <header className="mb-10 rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-lg shadow-black/20">
          <p className="text-xs uppercase tracking-[0.25em] text-green-400/80 mb-3">Blog Post</p>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight">{blog.title}</h1>
          <p className="mt-3 text-sm text-gray-400">
            by <span className="text-green-300">{blog.author?.name || "Author"}</span> ·{" "}
            {new Date(blog.createdAt || blog.updatedAt || Date.now()).toLocaleDateString()}
          </p>
          <div className="mt-5 h-px w-full bg-gradient-to-r from-green-400/60 via-white/15 to-transparent" />
          <p className="mt-5 text-gray-300 leading-7">{blog.description}</p>
        </header>

        {/* BANNER */}
        {blog.banner && (
          <img
            src={blog.banner}
            alt="Banner"
            className="w-full rounded-2xl mb-10 object-cover max-h-[420px] border border-white/10"
          />
        )}

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_200px] gap-8">
          {/* CONTENT */}
          <article className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 shadow-lg shadow-black/20">
            <div className="mb-5 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gray-400">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              Content
            </div>
         

<div className="prose prose-invert max-w-none">
  {blog.content?.[0].blocks?.map((block, index) => {
    
    if (block.type === "paragraph") {
      return (
        <p key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />
      );
    }

    if (block.type === "header") {
      return (
        <h2 key={index} dangerouslySetInnerHTML={{ __html: block.data.text }} />
      );
    }

    if (block.type === "image") {
      return (
        <img
          key={index}
          src={block.data.file.url}
          alt={block.data.caption || "blog image"}
          className="rounded-xl my-6"
        />
      );
    }

    return null;
  })}
</div>
          </article>

          {/* ACTIONS */}
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-black/20 md:sticky md:top-6 h-fit">
            <p className="mb-4 text-xs uppercase tracking-[0.2em] text-gray-400">Actions</p>
            <div className="space-y-3">
              <button
                onClick={() => (liked ? handleUnlike() : handleLike())}
                className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition
                ${
                  liked
                    ? "border-green-400/30 bg-green-400/10 text-green-300"
                    : "border-white/10 bg-black/20 text-gray-300 hover:border-green-400/30 hover:bg-green-400/5 hover:text-green-300"
                }`}
              >
                <span className="flex items-center gap-2">
                  <FaArrowUp />
                  Upvotes
                </span>
                <span className="font-semibold">{blog.activity?.total_upvotes || 0}</span>
              </button>
              <div className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300">
                <span className="flex items-center gap-2">
                  <FaComment />
                  Comments
                </span>
                <span className="font-semibold">
                  {blog.activity?.total_comments || (Array.isArray(blog.comments) ? blog.comments.length : 0)}
                </span>
              </div>
            </div>
          </aside>
        </div>

        {/* COMMENTS SECTION */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold mb-6">Comments</h3>

          {Array.isArray(blog.comments) && blog.comments.length > 0 ? (
            <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-6 pr-2">
              {buildCommentTree(blog.comments).map((root) => (
                <CommentItem key={String(root._id)} comment={root} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-6">No comments yet, be the first to comment.</p>
          )}

          <div className="flex gap-3">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment."
              className="flex-1 bg-gray-900 text-white border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-green-400/50"
            />
            <button
              onClick={handleAddComment}
              className="px-6 py-3 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition font-medium"
            >
              Post
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SpecificBlog;