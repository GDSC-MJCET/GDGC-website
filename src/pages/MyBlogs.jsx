"use client";
import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { FaComment, FaArrowUp, FaReply } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyBlogs = () => {
  const [openCommentsId, setOpenCommentsId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [replyInputs, setReplyInputs] = useState({});
  const [replyVisible, setReplyVisible] = useState({});
  const [blogs, setBlogs] = useState([]);
  const [liked, setLiked] = useState([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const server = import.meta.env.VITE_SERVER;
  const authRaw = typeof window !== "undefined" ? localStorage.getItem("AuthState") : null;
  const auth = authRaw ? JSON.parse(authRaw) : null;

  const replyInputRefs = useRef({});

  // Fetch user's own blogs
  useEffect(() => {
    if (!auth?.token) return;
    setError("");
    axios
      .get(server + "/api/v1/blog/my-blogs", {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then((res) => {
        console.log("fetched my-blogs:", res.data);
        if (res.data.error) {
          setError(res.data.error);
          setBlogs([]);
          return;
        }
        const blogsArr = res?.data?.BlogArray || [];
        // Initialize showReplies for all comments (same as original)
        const blogsWithShowReplies = blogsArr.map((blog) => ({
          ...blog,
          comments: (blog.comments || []).map((c) => ({ ...c, showReplies: false })),
        }));
        setBlogs(blogsWithShowReplies);
        const arr = res?.data?.LikedArray?.map((i) => String(i._id)) || [];
        setLiked(arr);
        // Set name: prefer response Name, fallback to auth user name, then empty
        const userName = res?.data?.Name || auth?.name || auth?.user?.name || "";
        setName(userName);
      })
      .catch((err) => {
        console.error("fetch my-blogs error:", err);
        setError("Failed to load your blogs. Please try again later.");
        setBlogs([]);
      });
  }, [server, auth?.token]);

  // Collapse reply inputs when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedInsideReplyBox = e.target.closest(".reply-box");
      const clickedReplyToggle = e.target.closest(".reply-toggle");
      const clickedShowReplies = e.target.closest(".show-replies-toggle");
      if (!clickedInsideReplyBox && !clickedReplyToggle && !clickedShowReplies) {
        setReplyVisible({});
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Focus-preserving effect for reply inputs
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
        } catch (e) {
          // ignore
        }
      }
    });
  }, [replyVisible, replyInputs]);

  // Like / Unlike handlers (identical to original)
  const handleLike = async (blog_id) => {
    if (!auth?.token) return;
    try {
      const { data } = await axios.post(
        server + "/api/v1/blog/like-blog",
        { _id: blog_id },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      if (data?.message === "You have already upvoted this blog") {
        return handleUnlike(blog_id);
      }

      setLiked((prev) => (prev.includes(String(blog_id)) ? prev : [...prev, String(blog_id)]));
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blog_id
            ? {
                ...b,
                activity: {
                  ...(b.activity || {}),
                  total_upvotes: (b.activity?.total_upvotes || 0) + 1,
                },
              }
            : b
        )
      );
    } catch (err) {
      console.error("like error:", err);
    }
  };

  const handleUnlike = async (blog_id) => {
    if (!auth?.token) return;
    try {
      await axios.post(
        server + "/api/v1/blog/unlike-blog",
        { _id: blog_id },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );

      setLiked((prev) => prev.filter((id) => id !== String(blog_id)));
      setBlogs((prev) =>
        prev.map((b) =>
          b._id === blog_id
            ? {
                ...b,
                activity: {
                  ...(b.activity || {}),
                  total_upvotes: Math.max(0, (b.activity?.total_upvotes || 0) - 1),
                },
              }
            : b
        )
      );
    } catch (err) {
      console.error("unlike error:", err);
    }
  };

  const toggleComments = (blogId) => {
    setOpenCommentsId((cur) => (cur === blogId ? null : blogId));
  };

  const handleCommentChange = (blogId, value) => {
    setCommentInputs((prev) => ({ ...prev, [String(blogId)]: value }));
  };

  const handleReplyChange = (commentId, value) => {
    const key = String(commentId);
    setReplyInputs((prev) => ({ ...prev, [key]: value }));
  };

  const toggleReplyVisible = (commentId) => {
    const key = String(commentId);
    setReplyVisible((prev) => ({ ...prev, [key]: !prev[key] }));
    if (!replyInputRefs.current[key]) replyInputRefs.current[key] = null;
  };

  const replaceOrAppendComment = (prevBlogs, blogId, tempId, realComment) =>
    prevBlogs.map((b) => {
      if (b._id !== blogId) return b;
      const comments = Array.isArray(b.comments) ? b.comments.slice() : [];
      const found = comments.some((c) => String(c._id) === String(tempId));
      const updatedComments = found
        ? comments.map((c) => (String(c._id) === String(tempId) ? realComment : c))
        : [...comments, realComment];
      return { ...b, comments: updatedComments };
    });

  const handleAddComment = async (blogId) => {
    const text = (commentInputs[String(blogId)] || "").trim();
    if (!text) return;

    const tempId = String(Date.now());
    const newComment = {
      _id: tempId,
      text,
      commentedBy: { name: name || "You" },
      level: 0,
      replyTo: null,
      createdAt: new Date().toISOString(),
    };

    setBlogs((prev) =>
      prev.map((blog) =>
        blog._id === blogId
          ? {
              ...blog,
              comments: [...(Array.isArray(blog.comments) ? blog.comments : []), newComment],
              activity: {
                ...(blog.activity || {}),
                total_comments: (blog.activity?.total_comments || 0) + 1,
              },
            }
          : blog
      )
    );

    setCommentInputs((prev) => ({ ...prev, [String(blogId)]: "" }));

    try {
      const res = await axios.post(
        server + "/api/v1/blog/add-comment",
        { _id: blogId, text, level: 0, replyTo: null, isReply: false },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );

      const realComment = res?.data?.comment;
      if (realComment) {
        setBlogs((prev) => replaceOrAppendComment(prev, blogId, tempId, realComment));
      } else {
        console.warn("add-comment: server did not return comment");
      }
    } catch (err) {
      console.error("add-comment failed:", err);
    }
  };

  const handleAddReply = async (blogId, parentComment) => {
    const parentIdStr = String(parentComment._id);
    const text = (replyInputs[parentIdStr] || "").trim();
    if (!text) return;

    const tempId = String(Date.now()) + "-reply";
    const newReply = {
      _id: tempId,
      text,
      commentedBy: { name: name || "You" },
      level: (parentComment.level || 0) + 1,
      replyTo: parentComment._id,
      createdAt: new Date().toISOString(),
    };

    setBlogs((prev) =>
      prev.map((blog) =>
        blog._id === blogId
          ? {
              ...blog,
              comments: [...(Array.isArray(blog.comments) ? blog.comments : []), newReply],
              activity: {
                ...(blog.activity || {}),
                total_comments: (blog.activity?.total_comments || 0) + 1,
              },
            }
          : blog
      )
    );

    setReplyInputs((prev) => ({ ...prev, [parentIdStr]: "" }));
    setReplyVisible((prev) => ({ ...prev, [parentIdStr]: false }));

    try {
      const res = await axios.post(
        server + "/api/v1/blog/add-comment",
        {
          _id: blogId,
          text,
          level: parentComment.level + 1,
          replyTo: parentComment._id,
          isReply: true,
        },
        { headers: { Authorization: `Bearer ${auth?.token}` } }
      );

      const realReply = res?.data?.comment;
      if (realReply) {
        setBlogs((prev) => replaceOrAppendComment(prev, blogId, tempId, realReply));
      } else {
        console.warn("add-reply: server did not return comment");
      }
    } catch (err) {
      console.error("add-reply failed:", err);
    }
  };

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

  const CommentItem = memo(function CommentItem({ comment, blogId }) {
    const idStr = String(comment._id);
    const visible = Boolean(replyVisible[idStr]);

    const assignRef = useCallback((el) => {
      replyInputRefs.current[idStr] = el;
    }, []);

    return (
      <div className="mb-3" style={{ marginLeft: comment.level > 0 ? "1.5rem" : 0 }}>
        <div className="bg-gray-800 p-2 rounded">
          <div className="flex justify-between items-start">
            <span className="font-bold text-green-400 text-sm">
              {comment.commentedBy?.name || "Anonymous"}
            </span>
            <span className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
          </div>
          <p className="text-gray-200 text-sm mt-1">{comment.text}</p>
          <p
            className={
              "text-xs text-gray-400 cursor-pointer hover:text-green-400 mt-1 flex items-center gap-1 show-replies-toggle " +
              (comment.replies.length > 0 ? "" : " hidden")
            }
            onClick={() => {
              setBlogs((prev) =>
                prev.map((b) => {
                  if (b._id !== blogId) return b;
                  const comments = Array.isArray(b.comments) ? b.comments.slice() : [];
                  const updatedComments = comments.map((c) =>
                    String(c._id) === idStr ? { ...c, showReplies: !comment.showReplies } : c
                  );
                  return { ...b, comments: updatedComments };
                })
              );
            }}
          >
            Previous Replies
          </p>
          <button
            onClick={() => toggleReplyVisible(idStr)}
            className="reply-toggle text-xs text-gray-400 hover:text-green-400 mt-1 flex items-center gap-1"
          >
            <FaReply size={10} /> Reply
          </button>
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
            <button
              onClick={() => handleAddReply(blogId, comment)}
              className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition cursor-pointer"
            >
              Post
            </button>
          </div>
        )}

        {comment.replies && comment.replies.length > 0 && comment.showReplies && (
          <div className="mt-2">
            {comment.replies.map((reply) => (
              <CommentItem key={String(reply._id)} comment={reply} blogId={blogId} />
            ))}
          </div>
        )}
      </div>
    );
  });

  const nav = useNavigate();
  const handleBlogOnClick = (blogId) => {
    nav(`/blog/blog/${blogId}`);
  };

  // Empty state or error message
  if (error) {
    return (
      <div className="relative h-full w-full bg-black pt-16">
        <div className="text-center text-red-400 font-mono mt-20">{error}</div>
      </div>
    );
  }

  if (blogs.length === 0 && !error) {
    return (
      <div className="relative h-full w-full bg-black pt-16">
        <div className="text-center text-gray-300 font-mono mt-20">
          You haven't uploaded any blogs yet.
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full bg-black pt-16">
      <section className="grid grid-cols-1 md:grid-cols-3 relative z-10 pt-18 font-mono">
        {blogs.map((blog) => (
          <div
            key={String(blog._id)}
            className="m-4 p-4 border border-white rounded-lg transition hover:border-green-400 hover:shadow-[0_0_10px_#4ade80]"
          >
            <h2
              className="text-2xl font-bold text-white mb-2 cursor-pointer"
              onClick={() => handleBlogOnClick(blog._id)}
            >
              {blog.title}
            </h2>
            {blog.banner && <img src={blog.banner} alt="Blog Banner" className="w-full h-auto mb-4 rounded" />}
            <p className="text-white mb-4">{blog.des}</p>

            <div className="flex gap-4 items-center">
              <button
                className={`text-gray-400 text-sm flex gap-2 items-center ${
                  liked.includes(String(blog._id)) ? "text-green-400" : ""
                }`}
                onClick={() => handleLike(blog._id)}
              >
                <FaArrowUp className="cursor-pointer" />
                <span>{blog.activity?.total_upvotes || 0}</span>
              </button>

              <button
                className="text-gray-400 text-sm flex gap-2 items-center hover:text-green-400 transition"
                onClick={() => toggleComments(blog._id)}
              >
                <FaComment className="cursor-pointer" />
                <span>
                  {blog.activity?.total_comments || (Array.isArray(blog.comments) ? blog.comments.length : 0)}
                </span>
              </button>
            </div>

            {openCommentsId === blog._id && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                {Array.isArray(blog.comments) && blog.comments.length > 0 ? (
                  <div className="mb-4 space-y-2 max-h-96 overflow-y-auto">
                    {buildCommentTree(blog.comments).map((rootComment) => (
                      <CommentItem key={String(rootComment._id)} comment={rootComment} blogId={blog._id} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mb-2">No comments yet.</p>
                )}

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={commentInputs[String(blog._id)] || ""}
                    onChange={(e) => handleCommentChange(blog._id, e.target.value)}
                    placeholder="Add a comment."
                    className="flex-1 bg-gray-900 text-white border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
                  />
                  <button
                    onClick={() => handleAddComment(blog._id)}
                    className="px-4 py-2 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition cursor-pointer"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default MyBlogs;