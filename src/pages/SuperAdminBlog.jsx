"use client";
import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { FaComment, FaArrowUp, FaReply, FaTrash, FaCheckCircle, FaShieldAlt, FaCrown } from "react-icons/fa";
import { MdVerified, MdBlock } from "react-icons/md";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const server = import.meta.env.VITE_SERVER;

// ─── Comment Item ────────────────────────────────────────────────────────────
const CommentItem = memo(function CommentItem({
  comment, blogId, replyVisible, replyInputs,
  replyInputRefs, handleReplyChange, toggleReplyVisible,
  handleAddReply, setBlogs, handleDeleteComment
}) {
  const idStr = String(comment._id);
  const visible = Boolean(replyVisible[idStr]);

  const assignRef = useCallback((el) => {
    replyInputRefs.current[idStr] = el;
  }, [idStr]);

  return (
    <div className="mb-3" style={{ marginLeft: comment.level > 0 ? "1.5rem" : 0 }}>
      <div className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg relative group">
        <div className="flex justify-between items-start">
          <span className="font-bold text-amber-400 text-sm font-mono">
            {comment.commentedBy?.name || "Anonymous"}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-500 font-mono">
              {new Date(comment.createdAt).toLocaleString()}
            </span>
            <button
              onClick={() => handleDeleteComment(comment._id, blogId)}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-400 p-1 rounded"
              title="Delete comment"
            >
              <FaTrash size={10} />
            </button>
          </div>
        </div>
        <p className="text-zinc-200 text-sm mt-1 font-mono">{comment.text}</p>

        {comment.replies?.length > 0 && (
          <button
            className="show-replies-toggle text-xs text-zinc-500 hover:text-amber-400 mt-2 flex items-center gap-1 font-mono transition-colors"
            onClick={() => {
              setBlogs((prev) => prev.map((b) => {
                if (b._id !== blogId) return b;
                return {
                  ...b,
                  comments: b.comments.map((c) =>
                    String(c._id) === idStr ? { ...c, showReplies: !comment.showReplies } : c
                  )
                };
              }));
            }}
          >
            {comment.showReplies ? "▲ hide replies" : `▼ ${comment.replies.length} repl${comment.replies.length === 1 ? "y" : "ies"}`}
          </button>
        )}

        <button
          onClick={() => toggleReplyVisible(idStr)}
          className="reply-toggle text-xs text-zinc-500 hover:text-amber-400 mt-1 flex items-center gap-1 font-mono transition-colors"
        >
          <FaReply size={10} /> reply
        </button>
      </div>

      {visible && (
        <div className="reply-box flex gap-2 mt-2 ml-4">
          <input
            ref={assignRef}
            type="text"
            value={replyInputs[idStr] || ""}
            onChange={(e) => handleReplyChange(idStr, e.target.value)}
            placeholder="Write a reply..."
            className="flex-1 bg-zinc-900 text-white border border-zinc-700 focus:border-amber-500 rounded px-3 py-1 text-sm font-mono outline-none transition-colors"
          />
          <button
            onClick={() => handleAddReply(blogId, comment)}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded text-xs font-mono transition-colors"
          >
            Post
          </button>
        </div>
      )}

      {comment.replies?.length > 0 && comment.showReplies && (
        <div className="mt-2 border-l border-zinc-700 pl-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={String(reply._id)}
              comment={reply}
              blogId={blogId}
              replyVisible={replyVisible}
              replyInputs={replyInputs}
              replyInputRefs={replyInputRefs}
              handleReplyChange={handleReplyChange}
              toggleReplyVisible={toggleReplyVisible}
              handleAddReply={handleAddReply}
              setBlogs={setBlogs}
              handleDeleteComment={handleDeleteComment}
            />
          ))}
        </div>
      )}
    </div>
  );
});

// ─── Main Page ────────────────────────────────────────────────────────────────
const SuperAdminBlogPanel = () => {
  const nav = useNavigate();
  const auth = JSON.parse(localStorage.getItem("AuthState"));

  const [checking, setChecking] = useState(true);
  const [blogs, setBlogs] = useState([]);
  const [liked, setLiked] = useState([]);
  const [name, setName] = useState("");
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [replyVisible, setReplyVisible] = useState({});
  const [confirmingBlogId, setConfirmingBlogId] = useState(null);
  const [confirmingCommentId, setConfirmingCommentId] = useState(null);
  const [filter, setFilter] = useState("all"); // all | validated | unvalidated
  const [search, setSearch] = useState("");

  const replyInputRefs = useRef({});

  // ── Step 1: verify superadmin ──────────────────────────────────────────────
  useEffect(() => {
    if (!auth?.token) { nav("/login"); return; }
    axios.get(server + "/api/v1/admin/verify-super-admin", {
      headers: { Authorization: `Bearer ${auth.token}` }
    }).then((res) => {
      if (res.data.success) {
        setChecking(false);
      } else {
        nav("/team/dashboard");
      }
    }).catch(() => nav("/team/dashboard"));
  }, []);

  // ── Step 2: fetch all blogs ────────────────────────────────────────────────
  useEffect(() => {
    if (checking) return;
    axios.get(server + "/api/v1/blog/get-unvalidated-blogs", {
      headers: { Authorization: `Bearer ${auth.token}` }
    }).then((res) => {
      const raw = res?.data?.BlogArray || [];
      console.log("Fetched blogs:", raw);
      setBlogs(raw.map(b => ({
        ...b,
        comments: (b.comments || []).map(c => ({ ...c, showReplies: false }))
      })));
      setLiked((res?.data?.LikedArray || []).map(i => String(i._id)));
      setName(res?.data?.Name || "");
    }).catch(console.error);
   
  }, [checking]);

  // ── outside click collapse reply ──────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest(".reply-box") && !e.target.closest(".reply-toggle") && !e.target.closest(".show-replies-toggle")) {
        setReplyVisible({});
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── reply input focus ──────────────────────────────────────────────────────
  useEffect(() => {
    Object.keys(replyVisible).forEach((id) => {
      if (!replyVisible[id]) return;
      const el = replyInputRefs.current[id];
      if (el && document.activeElement !== el) {
        try { el.focus(); } catch (_) {}
      }
    });
  }, [replyVisible]);

  // ── helpers ────────────────────────────────────────────────────────────────
  const buildCommentTree = (comments) => {
    if (!Array.isArray(comments) || !comments.length) return [];
    const map = new Map();
    const roots = [];
    comments.forEach(c => map.set(String(c._id), { ...c, replies: [] }));
    map.forEach(c => {
      if (c.replyTo && map.has(String(c.replyTo))) {
        map.get(String(c.replyTo)).replies.push(c);
      } else roots.push(c);
    });
    return roots;
  };

  const replaceOrAppend = (prev, blogId, tempId, real) =>
    prev.map(b => {
      if (b._id !== blogId) return b;
      const cs = Array.isArray(b.comments) ? [...b.comments] : [];
      const found = cs.some(c => String(c._id) === String(tempId));
      return { ...b, comments: found ? cs.map(c => String(c._id) === String(tempId) ? real : c) : [...cs, real] };
    });

  // ── like / unlike ──────────────────────────────────────────────────────────
  const handleLike = async (blog_id) => {
    const { data } = await axios.post(server + "/api/v1/blog/like-blog", { _id: blog_id }, { headers: { Authorization: `Bearer ${auth.token}` } });
    if (data?.message === "You have already upvoted this blog") return handleUnlike(blog_id);
    setLiked(p => p.includes(String(blog_id)) ? p : [...p, String(blog_id)]);
    setBlogs(p => p.map(b => b._id === blog_id ? { ...b, activity: { ...b.activity, total_upvotes: (b.activity?.total_upvotes || 0) + 1 } } : b));
  };
  const handleUnlike = async (blog_id) => {
    await axios.post(server + "/api/v1/blog/unlike-blog", { _id: blog_id }, { headers: { Authorization: `Bearer ${auth.token}` } });
    setLiked(p => p.filter(id => id !== String(blog_id)));
    setBlogs(p => p.map(b => b._id === blog_id ? { ...b, activity: { ...b.activity, total_upvotes: Math.max(0, (b.activity?.total_upvotes || 0) - 1) } } : b));
  };

  // ── comments ───────────────────────────────────────────────────────────────
  const handleAddComment = async (blogId) => {
    const text = (commentInputs[String(blogId)] || "").trim();
    if (!text) return;
    const tempId = String(Date.now());
    const newC = { _id: tempId, text, commentedBy: { name: name || "You" }, level: 0, replyTo: null, createdAt: new Date().toISOString() };
    setBlogs(p => p.map(b => b._id === blogId ? { ...b, comments: [...(b.comments || []), newC], activity: { ...b.activity, total_comments: (b.activity?.total_comments || 0) + 1 } } : b));
    setCommentInputs(p => ({ ...p, [String(blogId)]: "" }));
    const res = await axios.post(server + "/api/v1/blog/add-comment", { _id: blogId, text, level: 0, replyTo: null, isReply: false }, { headers: { Authorization: `Bearer ${auth.token}` } });
    if (res?.data?.comment) setBlogs(p => replaceOrAppend(p, blogId, tempId, res.data.comment));
  };

  const handleAddReply = async (blogId, parent) => {
    const key = String(parent._id);
    const text = (replyInputs[key] || "").trim();
    if (!text) return;
    const tempId = String(Date.now()) + "-r";
    const newR = { _id: tempId, text, commentedBy: { name: name || "You" }, level: (parent.level || 0) + 1, replyTo: parent._id, createdAt: new Date().toISOString() };
    setBlogs(p => p.map(b => b._id === blogId ? { ...b, comments: [...(b.comments || []), newR], activity: { ...b.activity, total_comments: (b.activity?.total_comments || 0) + 1 } } : b));
    setReplyInputs(p => ({ ...p, [key]: "" }));
    setReplyVisible(p => ({ ...p, [key]: false }));
    const res = await axios.post(server + "/api/v1/blog/add-comment", { _id: blogId, text, level: parent.level + 1, replyTo: parent._id, isReply: true }, { headers: { Authorization: `Bearer ${auth.token}` } });
    if (res?.data?.comment) setBlogs(p => replaceOrAppend(p, blogId, tempId, res.data.comment));
  };

  const toggleReplyVisible = (id) => setReplyVisible(p => ({ ...p, [id]: !p[id] }));
  const handleReplyChange = (id, val) => setReplyInputs(p => ({ ...p, [id]: val }));

  // ── delete blog ────────────────────────────────────────────────────────────
  const handleDeleteBlog = async (blogId) => {
    await axios.delete(server + "/api/v1/blog/delete-blog", {
      data: { _id: blogId },
      headers: { Authorization: `Bearer ${auth.token}` }
    });
    setBlogs(p => p.filter(b => b._id !== blogId));
    setConfirmingBlogId(null);
  };

  // ── delete comment ─────────────────────────────────────────────────────────
  const handleDeleteComment = (commentId, blogId) => {
    setConfirmingCommentId({ commentId, blogId });
  };
  const confirmDeleteComment = async () => {
    const { commentId, blogId } = confirmingCommentId;
    await axios.post(server + "/api/v1/blog/remove-comment", { _id: commentId }, { headers: { Authorization: `Bearer ${auth.token}` } });
    setBlogs(p => p.map(b => b._id !== blogId ? b : { ...b, comments: b.comments.filter(c => String(c._id) !== String(commentId) && String(c.replyTo) !== String(commentId)) }));
    setConfirmingCommentId(null);
  };

  // ── validate blog ──────────────────────────────────────────────────────────
  const handleValidate = async (blogId) => {
    const res = await axios.post(server + "/api/v1/blog/validate-blog", { _id: blogId }, { headers: { Authorization: `Bearer ${auth.token}` } });
    if (res?.data?.blog || res?.data?.message?.includes("success")) {
      setBlogs(p => p.map(b => b._id === blogId ? { ...b, validated: true } : b));
    }
  };

  // ── filtered blogs ─────────────────────────────────────────────────────────
  const displayed = blogs.filter(b => {
    const matchFilter = filter === "all" || (filter === "validated" ? b.validated : !b.validated);
    const matchSearch = !search || b.title?.toLowerCase().includes(search.toLowerCase()) || b.author?.name?.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  // ── loading / auth check ───────────────────────────────────────────────────
  if (checking) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <FaCrown className="text-amber-400 animate-pulse" size={48} />
          <p className="text-zinc-400 font-mono text-sm tracking-widest">VERIFYING ACCESS...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-mono">

      {/* ── Header ── */}
      <div className="border-b border-zinc-800 bg-zinc-950/90 backdrop-blur sticky top-0 z-30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex items-center gap-3">
            <FaCrown className="text-amber-400" size={20} />
            <h1 className="text-lg font-bold tracking-widest text-white uppercase">Super Admin — Blog Panel</h1>
            <span className="text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full">
              {blogs.length} total
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search blogs or authors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-zinc-900 border border-zinc-700 focus:border-amber-500 text-white px-3 py-1.5 rounded-lg text-sm outline-none transition-colors w-56"
            />
            
          </div>
        </div>
      </div>

      {/* ── Blog Grid ── */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {displayed.length === 0 && (
          <div className="text-center text-zinc-600 mt-20 font-mono text-sm">no blogs found.</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayed.map((blog) => (
            <div
              key={String(blog._id)}
              className={`relative border rounded-xl p-5 transition-all duration-200
                ${blog.validated
                  ? "border-zinc-700 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]"
                  : "border-red-900/50 hover:border-red-500/50 bg-red-950/10"
                }`}
            >
              {/* Validated badge */}
              <div className="absolute top-3 right-3 flex items-center gap-1">
                {blog.validated
                  ? <span className="flex items-center gap-1 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full"><MdVerified size={10} /> validated</span>
                  : <span className="flex items-center gap-1 text-xs text-red-400 bg-red-500/10 border border-red-500/30 px-2 py-0.5 rounded-full"><MdBlock size={10} /> pending</span>
                }
              </div>

              {/* Blog meta */}
              <p className="text-xs text-zinc-500 mb-1">{blog.author?.name || blog.author || "unknown author"}</p>
              <h2
                className="text-lg font-bold text-white mb-2 cursor-pointer hover:text-amber-400 transition-colors pr-20"
                onClick={() => nav(`/blog/blog/${blog._id}`)}
              >
                {blog.title}
              </h2>

              {blog.banner && (
                <img src={blog.banner} alt="banner" className="w-full h-40 object-cover rounded-lg mb-3 opacity-80" />
              )}

              <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{blog.des}</p>

              {/* Action row */}
              <div className="flex items-center gap-4 pt-3 border-t border-zinc-800">
                {/* Like */}
                <button
                  onClick={() => handleLike(blog._id)}
                  className={`flex items-center gap-1.5 text-sm transition-colors ${liked.includes(String(blog._id)) ? "text-amber-400" : "text-zinc-500 hover:text-amber-400"}`}
                >
                  <FaArrowUp size={12} />
                  <span>{blog.activity?.total_upvotes || 0}</span>
                </button>

                {/* Comments */}
                <button
                  onClick={() => setOpenCommentsId(p => p === blog._id ? null : blog._id)}
                  className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-amber-400 transition-colors"
                >
                  <FaComment size={12} />
                  <span>{blog.activity?.total_comments || blog.comments?.length || 0}</span>
                </button>

                {/* Validate */}
                {!blog.validated && (
                  <button
                    onClick={() => handleValidate(blog._id)}
                    className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-400 px-2 py-1 rounded-lg transition-all ml-auto"
                  >
                    <FaCheckCircle size={10} /> Validate
                  </button>
                )}

                {/* Delete blog */}
                <button
                  onClick={() => setConfirmingBlogId(blog._id)}
                  className={`flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 border border-red-500/30 hover:border-red-400 px-2 py-1 rounded-lg transition-all ${!blog.validated ? "" : "ml-auto"}`}
                >
                  <FaTrash size={10} /> Delete
                </button>
              </div>

              {/* Delete blog confirm */}
              {confirmingBlogId === blog._id && (
                <div className="mt-4 p-3 bg-red-950/50 border border-red-800 rounded-lg">
                  <p className="text-white text-xs mb-3">Delete <span className="text-red-400 font-bold">"{blog.title}"</span>? This is permanent.</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleDeleteBlog(blog._id)} className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs font-bold transition-colors">
                      Confirm Delete
                    </button>
                    <button onClick={() => setConfirmingBlogId(null)} className="px-3 py-1 bg-zinc-700 hover:bg-zinc-600 text-white rounded text-xs transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {/* Comments section */}
              {openCommentsId === blog._id && (
                <div className="mt-4 pt-4 border-t border-zinc-800">
                  {Array.isArray(blog.comments) && blog.comments.length > 0 ? (
                    <div className="mb-4 space-y-1 max-h-96 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-zinc-900 scrollbar-thumb-zinc-700">
                      {buildCommentTree(blog.comments).map(root => (
                        <CommentItem
                          key={String(root._id)}
                          comment={root}
                          blogId={blog._id}
                          replyVisible={replyVisible}
                          replyInputs={replyInputs}
                          replyInputRefs={replyInputRefs}
                          handleReplyChange={handleReplyChange}
                          toggleReplyVisible={toggleReplyVisible}
                          handleAddReply={handleAddReply}
                          setBlogs={setBlogs}
                          handleDeleteComment={handleDeleteComment}
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-zinc-600 text-xs mb-3">no comments yet.</p>
                  )}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={commentInputs[String(blog._id)] || ""}
                      onChange={e => setCommentInputs(p => ({ ...p, [String(blog._id)]: e.target.value }))}
                      placeholder="Add a comment..."
                      className="flex-1 bg-zinc-900 text-white border border-zinc-700 focus:border-amber-500 rounded px-3 py-2 text-sm outline-none transition-colors"
                    />
                    <button
                      onClick={() => handleAddComment(blog._id)}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-black font-bold rounded text-sm transition-colors"
                    >
                      Post
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Global comment delete confirm modal ── */}
      {confirmingCommentId && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <FaShieldAlt className="text-red-400" size={20} />
              <h3 className="text-white font-bold">Delete Comment</h3>
            </div>
            <p className="text-zinc-400 text-sm mb-6">This will permanently delete the comment and all its replies.</p>
            <div className="flex gap-3">
              <button onClick={confirmDeleteComment} className="flex-1 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-bold transition-colors">
                Delete
              </button>
              <button onClick={() => setConfirmingCommentId(null)} className="flex-1 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-lg text-sm transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminBlogPanel;