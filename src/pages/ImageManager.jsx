import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Copy, Check } from "lucide-react";

const ImageManager = () => {
  const server = import.meta.env.VITE_SERVER;
  const auth = JSON.parse(localStorage.getItem("AuthState"));

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState("");

  const authHeaders = {
    headers: { Authorization: `Bearer ${auth?.token}` },
  };

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${server}/api/v1/images`, authHeaders);
      setImages(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch images");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim() || !imageUrl.trim()) {
      setError("Both title and image URL are required");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        `${server}/api/v1/images`,
        { title, imageUrl },
        authHeaders
      );
      setTitle("");
      setImageUrl("");
      fetchImages();
    } catch (err) {
      setError(err.response?.data?.msg || err.response?.data?.message || "Error adding image");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this image?")) return;
    setDeletingId(id);
    try {
      await axios.delete(`${server}/api/v1/images/${id}`, authHeaders);
      setImages((prev) => prev.filter((img) => img._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = async (id, url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError("Failed to copy URL");
    }
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-6 font-semibold">Image Manager</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 bg-black border border-gray-700 rounded w-[200px]"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="p-2 bg-black border border-gray-700 rounded w-[300px]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black px-4 py-2 rounded hover:opacity-80 disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        {imageUrl && (
          <div>
            <p className="text-sm text-gray-400 mb-2">Preview:</p>
            <img
              src={imageUrl}
              alt="preview"
              className="w-60 h-36 object-cover border border-gray-700 rounded"
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        )}
      </form>
      {images.length === 0 ? (
        <p className="text-gray-500 text-sm">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {images.map((img) => (
            <div key={img._id} className="border border-gray-700 p-3 rounded">
              <img
                src={img.imageUrl}
                alt={img.title}
                className="w-full h-40 object-cover rounded"
              />
              <div className="mt-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="font-medium truncate">{img.title}</p>
                  <p className="text-xs text-gray-400 break-all line-clamp-2">
                    {img.imageUrl}
                  </p>
                </div>
                {/* Action buttons */}
                <div className="flex flex-shrink-0 gap-1">
                  <button
                    onClick={() => handleCopy(img._id, img.imageUrl)}
                    className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                    title="Copy image URL"
                  >
                    {copiedId === img._id
                      ? <Check className="w-4 h-4 text-green-400" />
                      : <Copy className="w-4 h-4" />
                    }
                  </button>
                  <button
                    onClick={() => handleDelete(img._id)}
                    disabled={deletingId === img._id}
                    className="p-1.5 rounded hover:bg-red-950 text-gray-400 hover:text-red-400 disabled:opacity-50 transition-colors"
                    title="Delete image"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageManager;