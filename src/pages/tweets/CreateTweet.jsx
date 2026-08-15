import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateTweet = () => {
  const [text, setText] = useState("");
  const [mediaUrls, setMediaUrls] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const server = import.meta.env.VITE_SERVER;
  const auth = JSON.parse(localStorage.getItem("AuthState"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() && !mediaUrls.trim()) {
      toast.error("Tweet must have text or media");
      return;
    }
    setLoading(true);
    const mediaArray = mediaUrls
      .split(",")
      .map((url) => url.trim())
      .filter((url) => url);
    try {
      const { data } = await axios.post(
        `${server}/api/tweet/create`,
        {
          text: text.trim(),
          media: mediaArray,
        },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      );
      if (data.success) {
        toast.success("Tweet posted!");
        setText("");
        setMediaUrls("");
        navigate("/tweets/feed");
      } else {
        toast.error(data.message || "Failed to post");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-16 font-mono">
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-white mb-6">Create Tweet</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 280))}
            placeholder="What's happening? (use @username to mention)"
            rows="4"
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500"
          />
          <div className="text-right text-gray-400 text-sm">
            {text.length}/280
          </div>
          <input
            type="text"
            value={mediaUrls}
            onChange={(e) => setMediaUrls(e.target.value)}
            placeholder="Media URLs (comma separated) – optional"
            className="w-full bg-gray-900 text-white border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Posting..." : "Tweet"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTweet;