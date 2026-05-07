import React, { useEffect, useState } from "react";
import { Trash2, Copy, Pencil, Check, X } from "lucide-react";
import { supabase } from "../utils/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ImageManager = () => {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [error, setError] = useState("");
  const [editingName, setEditingName] = useState(null);
  const [editNewName, setEditNewName] = useState("");

  const fetchImages = async () => {
    try {
      const { data, error } = await supabase.storage.from("images").list("", {
        sortBy: { column: "created_at", order: "desc" },
      });
      
      if (error) throw error;

      const validFiles = data.filter((f) => f.name !== ".emptyFolderPlaceholder");

      const imagesWithUrls = validFiles.map((file) => {
        const { data: urlData } = supabase.storage
          .from("images")
          .getPublicUrl(file.name);

        const titlePart = file.name.replace(/^\d+__/, "").replace(/\.[^.]+$/, "");

        return {
          ...file,
          publicUrl: urlData.publicUrl,
          displayTitle: titlePart,
        };
      });

      setImages(imagesWithUrls);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch images");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !file) {
      setError("Title and image file are required");
      return;
    }

    setLoading(true);

    try {
      const sanitizedTitle = title.trim().replace(/[^a-zA-Z0-9 _-]/g, "");

      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}__${sanitizedTitle}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(fileName, file, {
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      setTitle("");
      setFile(null);
      fetchImages();
    } catch (err) {
      console.error("Upload error:", err);
      setError(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (fileName) => {
    if (!confirm("Delete this image?")) return;

    setDeletingId(fileName);

    try {
      const { error } = await supabase.storage.from("images").remove([fileName]);

      if (error) throw error;

      setImages((prev) => prev.filter((img) => img.name !== fileName));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete image");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopy = async (fileName, url) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(fileName);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      setError("Copy failed");
    }
  };

  const handleRename = async (oldName) => {
    const sanitizedName = editNewName.trim().replace(/[^a-zA-Z0-9 _-]/g, "");
    if (!sanitizedName) {
      setError("Invalid name");
      return;
    }

    setLoading(true);
    try {
      const ext = oldName.split(".").pop();
      const timestamp = oldName.match(/^\d+/)?.[0] || Date.now();
      const newName = `${timestamp}__${sanitizedName}.${ext}`;

      const { data: fileData, error: downloadError } = await supabase.storage
        .from("images")
        .download(oldName);
      if (downloadError) throw downloadError;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(newName, fileData, { contentType: fileData.type, upsert: false });
      if (uploadError) throw uploadError;

      const { error: deleteError } = await supabase.storage
        .from("images")
        .remove([oldName]);
      if (deleteError) throw deleteError;

      setEditingName(null);
      setEditNewName("");
      fetchImages();
    } catch (err) {
      console.error("Rename error:", err);
      setError("Failed to rename");
    } finally {
      setLoading(false);
    }
  };

  const startRename = (img) => {
    setEditingName(img.name);
    setEditNewName(img.displayTitle);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-6 font-semibold">Image Manager</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-8">
        <div className="flex gap-4 items-center flex-wrap">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-2 bg-black border border-gray-700 rounded"
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm border px-4 py-2 border-white rounded"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black px-4 py-2 rounded"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </div>

        {error && <p className="text-red-400">{error}</p>}

        {file && (
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            className="w-60 h-36 object-cover border border-gray-700 rounded"
          />
        )}
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {images.map((img) => (
          <div key={img.name} className="border border-gray-700 p-3 rounded">
            <img
              src={img.publicUrl}
              alt={img.displayTitle}
              className="w-full h-40 object-cover rounded"
            />

            {editingName === img.name ? (
              <div className="mt-2 flex gap-1 items-center">
                <Input
                  value={editNewName}
                  onChange={(e) => setEditNewName(e.target.value)}
                  className="flex-1 h-8 text-sm"
                  autoFocus
                />
                <Button
                  size="icon"
                  onClick={() => handleRename(img.name)}
                  disabled={loading}
                  className="h-8 w-8"
                >
                  <Check size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => setEditingName(null)}
                  className="h-8 w-8"
                >
                  <X size={14} />
                </Button>
              </div>
            ) : (
              <p className="mt-2 font-medium">{img.displayTitle}</p>
            )}

            <div className="flex gap-3 mt-2">
              {editingName !== img.name && (
                <button
                  onClick={() => startRename(img)}
                  className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"
                >
                  <Pencil size={16} />
                </button>
              )}

              <button
                onClick={() => handleCopy(img.name, img.publicUrl)}
                className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"
              >
                {copiedId === img.name ? (
                  <span className="text-green-400 text-xs">Copied!</span>
                ) : (
                  <Copy size={16} />
                )}
              </button>

              <button
                onClick={() => handleDelete(img.name)}
                disabled={deletingId === img.name}
                className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
              >
                <Trash2 size={16} />
                {deletingId === img.name && (
                  <span className="text-xs">Deleting...</span>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageManager;