import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FaHeart, FaComment, FaRetweet } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const TweetFeed = () => {
  const [tweets, setTweets] = useState([]);
  const [likedTweets, setLikedTweets] = useState([]);
  const [repostedTweets, setRepostedTweets] = useState([]);
  const [openRepliesId, setOpenRepliesId] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);
  const server = import.meta.env.VITE_SERVER;
  const auth = JSON.parse(localStorage.getItem("AuthState"));

  const fetchFeed = useCallback(async () => {
    try {
      const { data } = await axios.get(`${server}/api/tweet/list?page=1&limit=30`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      setTweets(data.tweets || []);
      // isLiked and isReposted come from backend already
      setLikedTweets(data.tweets.filter(t => t.isLiked).map(t => t._id));
      setRepostedTweets(data.tweets.filter(t => t.isReposted).map(t => t._id));
    } catch (err) {
      toast.error("Failed to load feed");
    } finally {
      setLoading(false);
    }
  }, [server, auth.token]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

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
    } catch (err) {
      if (err.response?.status === 400) {
        // Already liked -> unlike
        await handleUnlike(tweetId);
      } else {
        toast.error("Error");
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
    } catch (err) {
      toast.error("Error unliking");
    }
  };

  const handleRepost = async (tweetId) => {
    try {
      await axios.post(
        `${server}/api/tweet/repost`,
        { _id: tweetId },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setRepostedTweets((prev) => [...prev, tweetId]);
      setTweets((prev) =>
        prev.map((t) =>
          t._id === tweetId ? { ...t, repostCount: t.repostCount + 1, isReposted: true } : t
        )
      );
      toast.success("Reposted!");
    } catch (err) {
      if (err.response?.status === 400) {
        // Already reposted -> undo
        await handleUndoRepost(tweetId);
      } else {
        toast.error("Error reposting");
      }
    }
  };

  const handleUndoRepost = async (tweetId) => {
    try {
      await axios.post(
        `${server}/api/tweet/unrepost`,
        { _id: tweetId },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      setRepostedTweets((prev) => prev.filter((id) => id !== tweetId));
      setTweets((prev) =>
        prev.map((t) =>
          t._id === tweetId ? { ...t, repostCount: t.repostCount - 1, isReposted: false } : t
        )
      );
      toast.success("Repost removed");
    } catch (err) {
      toast.error("Error removing repost");
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
        <div className="text-white">Loading feed...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-16 font-mono">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-white mb-8">Tweet Feed</h1>
        {tweets.length === 0 ? (
          <div className="text-gray-400 text-center">No tweets yet. Follow people or create one!</div>
        ) : (
          <div className="space-y-6">
            {tweets.map((tweet) => (
              <div
                key={tweet._id}
                className="bg-gray-900 rounded-lg border border-gray-800 p-4 hover:border-blue-500 transition"
              >
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <span className="font-bold text-white">{tweet.authorName}</span>
                  <span>·</span>
                  <span>{new Date(tweet.createdAt).toLocaleString()}</span>
                </div>
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
                  <button
                    onClick={() => handleRepost(tweet._id)}
                    className={`flex items-center gap-1 ${
                      repostedTweets.includes(tweet._id) ? "text-green-500" : "hover:text-green-500"
                    }`}
                  >
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

export default TweetFeed;