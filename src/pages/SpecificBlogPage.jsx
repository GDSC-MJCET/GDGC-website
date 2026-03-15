"use client";
import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { FaComment, FaArrowUp, FaReply } from "react-icons/fa";
import axios from "axios";
import { useParams } from "react-router-dom";

// 
//  BlogPage - adapted to your server's getBlog implementation
//   - Calls POST {SERVER}/api/v1/blog/get-blog with body { _id }
//  - Expects the server to return the mongoose-like blog object directly in res.data
//     (your `toFrontEnd`), including: comments (already derived), activity, isLiked, etc.
// 
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
 

  // fetch single blog (POST body {_id} to match server)
  console.log("Fetching blog with id:", blogId);
  useEffect(() => {
    if (!auth?.token || !blogId) return;
    axios
      .post(
        `${server}/api/v1/blog/get-blog`,
        { _id: blogId },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      )
      .then((res) => {
        const b = res?.data || null; // server returns the toFrontEnd object directly
        console.log("Received blog data:", b);
        if (!b) return console.warn("get-blog returned nothing");
        // initialize comment showReplies flag if absent
        const comments = (b.comments || []).map((c) => ({ ...c, showReplies: !!c.showReplies }));
        setBlog({ ...b, comments });
        setLiked(Boolean(b.isLiked));
        setName(res?.data?.Name || "");
      })
      .catch((err) => console.error("fetch blog:", err));
  }, [server, auth?.token, blogId]);

  // click outside to collapse reply inputs (same logic as home)
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

  // focus-preserving effect for reply inputs
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

  // helper: build comment tree
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

  // safe replace or append for optimistic updates
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

  // like/unlike
  const handleLike = async () => {
    if (!auth?.token || !blog) return;
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
    if (!auth?.token || !blog) return;
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

  // add top-level comment
  const handleAddComment = async () => {
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

    // optimistic update
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
      else console.warn("add-comment: server returned no comment");
    } catch (err) {
      console.error("add-comment failed:", err);
    }
  };

  // add reply
  const handleAddReply = async (parentComment) => {
    if (!blog) return;
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

    // optimistic update
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
      else console.warn("add-reply: server did not return comment");
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

  // Memoized comment component
  const CommentItem = memo(function CommentItem({ comment }) {
    const idStr = String(comment._id);
    const visible = Boolean(replyVisible[idStr]);
    const assignRef = useCallback((el) => {
      replyInputRefs.current[idStr] = el;
    }, []);

    return (
      <div className="mb-4" style={{ marginLeft: (comment.level || 0) > 0 ? "1.5rem" : 0 }}>
        <div className="bg-gray-800 p-3 rounded">
          <div className="flex justify-between items-start">
            <span className="font-bold text-green-400 text-sm">{comment.commentedBy?.name || "Anonymous"}</span>
            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-gray-200 text-sm mt-2">{comment.text}</p>

          <div className="mt-2 flex gap-4 items-center">
            <button className={"text-xs text-gray-400 hover:text-green-400 show-replies-toggle"+ (comment.showReplies ? " active" : "")} onClick={() => toggleShowReplies(comment._id)}>
              Previous Replies
            </button>

            <button onClick={() => toggleReplyVisible(idStr)} className="reply-toggle text-xs text-gray-400 hover:text-green-400 flex items-center gap-2">
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
              className="flex-1 bg-gray-900 text-white border border-gray-700 rounded px-3 py-1 text-sm focus:outline-none"
            />
            <button onClick={() => handleAddReply(comment)} className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition">
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

  // Render
  if (!blogId) return <div className="p-8 text-center text-red-400">No blog id provided in props or URL.</div>;
  if (!blog) return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading…</div>;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6">
      <main className="max-w-3xl mx-auto">
        {/* header / meta */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold mb-2">{blog.title}</h1>
          <p className="text-sm text-gray-400">
            by <span className="text-green-300">{blog.author.name ||  "Author"}</span> ·{" "}
            {new Date(blog.createdAt || blog.updatedAt || Date.now()).toLocaleDateString()}
          </p>
        </header>

        {/* banner */}
        {blog.banner && <img src={blog.banner} alt="Banner" className="w-full rounded mb-8 object-cover max-h-96" />}

        {/* content + sidebar actions */}
        <div className="flex flex-col md:flex-row gap-8">
          <p className="copilot " >{blog.des}</p>
          <article className="prose prose-invert flex-1">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </article>

          {/* slim action column */}
          <aside className="w-full md:w-40 flex md:flex-col gap-4 items-start md:items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={() => (liked ? handleUnlike() : handleLike())}
                className={`flex items-center gap-1 text-sm ${liked ? "text-green-400" : "text-gray-400"} hover:text-green-300`}
              >
                <FaArrowUp />
                <span>{blog.activity?.total_upvotes || 0}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <FaComment className="text-gray-400" />
              <span className="text-gray-300 text-sm">{blog.activity?.total_comments || (Array.isArray(blog.comments) ? blog.comments.length : 0)}</span>
            </div>
          </aside>
        </div>

        {/* comments */}
        <section className="mt-12">
          <h3 className="text-xl font-semibold mb-4">Comments</h3>

          {Array.isArray(blog.comments) && blog.comments.length > 0 ? (
            <div className="space-y-4 max-h-[40vh] overflow-y-auto mb-6">
              {buildCommentTree(blog.comments).map((root) => (
                <CommentItem key={String(root._id)} comment={root} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 mb-4">No comments yet — be the first to comment.</p>
          )}

          <div className="flex gap-2">
            <input
              type="text"
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="Add a comment."
              className="flex-1 bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
            />
            <button onClick={handleAddComment} className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition">
              Post
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default SpecificBlog;