import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaHeart, FaComment, FaTrash, FaRetweet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const MyTweets = () => {
  const [tweets, setTweets] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]);
  const [openRepliesId, setOpenRepliesId] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);
  const server = import.meta.env.VITE_SERVER;
  const auth = JSON.parse(localStorage.getItem("AuthState"));
  const navigate = useNavigate();

  const fetchMyTweets = useCallback(async () => {
    try {
      const { data } = await axios.post(
        `${server}/api/tweet/user`,
        {}, // no userId -> returns current user's tweets
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setTweets(data.tweets || []);
      setLikedTweets(data.LikedArray || []);
    } catch (err) {
      toast.error("Failed to load your tweets");
    } finally {
      setLoading(false);
    }
  }, [server, auth.token]);

  useEffect(() => {
    fetchMyTweets();
  }, [fetchMyTweets]);

  const handleLike = async (tweetId) => {
    try {
      await axios.post(
        `${server}/api/tweet/like`,
        { _id: tweetId },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setLikedTweets((prev) => [...prev, tweetId]);
      setTweets((prev) =>
        prev.map((t) =>
          t._id === tweetId ? { ...t, likeCount: t.likeCount + 1, isLiked: true } : t
        )
      );
      toast.success("Liked!");
    } catch (err) {
      if (err.response?.status === 400) {
        // Already liked -> try unlike
        await handleUnlike(tweetId);
      } else {
        toast.error("Error liking tweet");
      }
    }
  };

  const handleUnlike = async (tweetId) => {
    try {
      await axios.post(
        `${server}/api/tweet/unlike`,
        { _id: tweetId },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setLikedTweets((prev) => prev.filter((id) => id !== tweetId));
      setTweets((prev) =>
        prev.map((t) =>
          t._id === tweetId ? { ...t, likeCount: t.likeCount - 1, isLiked: false } : t
        )
      );
      toast.success("Unliked");
    } catch (err) {
      toast.error("Error unliking tweet");
    }
  };

  const handleDelete = async (tweetId) => {
    if (!window.confirm("Delete this tweet permanently?")) return;
    try {
      await axios.post(
        `${server}/api/tweet/delete`,
        { _id: tweetId },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setTweets((prev) => prev.filter((t) => t._id !== tweetId));
      toast.success("Tweet deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const toggleReplies = (tweetId) => {
    setOpenRepliesId((cur) => (cur === tweetId ? null : tweetId));
  };

  const handleReplyChange = (tweetId, value) => {
    setReplyText((prev) => ({ ...prev, [tweetId]: value }));
  };

  const handleReplySubmit = async (tweetId) => {
    const text = replyText[tweetId]?.trim();
    if (!text) return;
    try {
      await axios.post(
        `${server}/api/tweet/create`,
        { text, parentTweetId: tweetId },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      toast.success("Reply posted");
      setReplyText((prev) => ({ ...prev, [tweetId]: "" }));
      // Increment reply count locally
      setTweets((prev) =>
        prev.map((t) =>
          t._id === tweetId ? { ...t, replyCount: t.replyCount + 1 } : t
        )
      );
    } catch (err) {
      toast.error("Failed to post reply");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-16 flex items-center justify-center">
        <div className="text-white">Loading your tweets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16 font-mono">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-white mb-8">My Tweets</h1>
        {tweets.length === 0 ? (
          <div className="text-gray-400 text-center">You haven't tweeted yet.</div>
        ) : (
          <div className="space-y-6">
            {tweets.map((tweet) => (
              <div
                key={tweet._id}
                className="bg-gray-900 rounded-lg border border-gray-800 p-4 hover:border-blue-500 transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white whitespace-pre-wrap">{tweet.text}</p>
                    {tweet.media?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {tweet.media.map((m, idx) => (
                          <img
                            key={idx}
                            src={m.url}
                            alt="media"
                            className="max-h-48 rounded object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(tweet._id)}
                    className="text-red-500 hover:text-red-400 ml-4"
                  >
                    <FaTrash />
                  </button>
                </div>

                <div className="flex gap-6 mt-4 text-gray-400">
                  <button
                    onClick={() => handleLike(tweet._id)}
                    className={`flex items-center gap-1 ${
                      likedTweets.includes(tweet._id) ? "text-blue-500" : "hover:text-blue-500"
                    }`}
                  >
                    <FaHeart /> {tweet.likeCount || 0}
                  </button>
                  <button
                    onClick={() => toggleReplies(tweet._id)}
                    className="flex items-center gap-1 hover:text-blue-500"
                  >
                    <FaComment /> {tweet.replyCount || 0}
                  </button>
                  <button className="flex items-center gap-1 hover:text-blue-500">
                    <FaRetweet /> {tweet.repostCount || 0}
                  </button>
                </div>

                {openRepliesId === tweet._id && (
                  <div className="mt-4 pt-4 border-t border-gray-800">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replyText[tweet._id] || ""}
                        onChange={(e) => handleReplyChange(tweet._id, e.target.value)}
                        placeholder="Write a reply..."
                        className="flex-1 bg-black text-white border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={() => handleReplySubmit(tweet._id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
                      >
                        Reply
                      </button>
                    </div>
                    {/* Optionally fetch and display replies here using getReplies endpoint */}
                    <p className="text-xs text-gray-500 mt-2">
                      (Replies will appear in your feed)
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTweets;