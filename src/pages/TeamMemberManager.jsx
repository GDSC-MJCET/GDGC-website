import React, { useEffect, useState } from "react";
import { Trash2, Copy, Pencil, Check, X, ExternalLink, Plus } from "lucide-react";
import { supabase } from "../utils/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import heic2any from "heic2any";

const SERVER = import.meta.env.VITE_SERVER?.replace(/\/$/, "");
const DOMAINS = [
  "WEB", "UI/UX", "AI/ML", "CYBERSEC", "CLOUD", "HR",
  "MEDIA", "DESIGN", "DOC", "EVENTS", "OPERATIONS", "MARKETING", "DSA", "PR"
];
const ROLES = ["EXECOM", "CORE"];

function authHeaders() {
  const auth = JSON.parse(localStorage.getItem("AuthState"));
  return { Authorization: `Bearer ${auth?.token}` };
}

const TeamMemberManager = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [roleFilter, setRoleFilter] = useState("ALL");

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    domain: "WEB",
    role: "EXECOM",
    linkedin: "",
    github: "",
    instagram: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const fetchMembers = async () => {
    try {
      const params = roleFilter !== "ALL" ? `?role=${roleFilter}` : "";
      const { data } = await axios.get(`${SERVER}/api/v1/team${params}`);
      setMembers(data.members || []);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch members");
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [roleFilter]);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const uploadImage = async (file) => {
    let fileToUpload = file;
    let finalExt = file.name.split(".").pop()?.toLowerCase();

    if (["heic", "heif"].includes(finalExt)) {
      const blob = await heic2any({
        blob: file,
        toType: "image/jpeg",
        quality: 0.9,
      });
      fileToUpload = new File([blob], file.name.replace(/\.(heic|heif)$/i, ".jpg"), {
        type: "image/jpeg",
      });
      finalExt = "jpg";
    }

    const sanitizedName = formData.name.trim().replace(/[^a-zA-Z0-9 _-]/g, "") || "member";
    const fileName = `team/${Date.now()}__${sanitizedName}.${finalExt}`;

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, fileToUpload, {
        contentType: fileToUpload.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name) {
      setError("Name is required");
      return;
    }

    setLoading(true);

    try {
      let imageUrl = formData.image;

      if (imageFile) {
        if (formData.image) {
          await supabase.storage.from("images").remove([formData.image.split("/").pop()]);
        }
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        ...formData,
        image: imageUrl,
      };

      if (editingId) {
        await axios.put(`${SERVER}/api/v1/team/${editingId}`, payload, { headers: authHeaders() });
      } else {
        await axios.post(`${SERVER}/api/v1/team`, payload, { headers: authHeaders() });
      }

      resetForm();
      fetchMembers();
    } catch (err) {
      console.error("Submit error:", err);
      setError(err.response?.data?.message || "Failed to save");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (member) => {
    setEditingId(member._id);
    setFormData({
      name: member.name,
      image: member.image,
      domain: member.domain,
      role: member.role,
      linkedin: member.linkedin || "",
      github: member.github || "",
      instagram: member.instagram || "",
    });
    setImagePreview(member.image);
    setImageFile(null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this team member?")) return;

    try {
      await axios.delete(`${SERVER}/api/v1/team/${id}`, { headers: authHeaders() });
      fetchMembers();
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete");
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      image: "",
      domain: "WEB",
      role: "EXECOM",
      linkedin: "",
      github: "",
      instagram: "",
    });
    setImageFile(null);
    setImagePreview("");
  };

  const filteredMembers = members;

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Team Member Manager</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-white text-black">
          <Plus size={16} className="mr-2" /> Add Member
        </Button>
      </div>

      <div className="flex gap-2 mb-6">
        {["ALL", ...ROLES].map((role) => (
          <button
            key={role}
            onClick={() => setRoleFilter(role)}
            className={`px-4 py-1.5 rounded-md text-sm ${
              roleFilter === role
                ? "bg-white text-black"
                : "bg-white/10 text-gray-400 hover:text-white"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {error && <p className="text-red-400 mb-4">{error}</p>}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Member" : "Add Member"}
              </h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Name *</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-black border-gray-700"
                  required
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Photo *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-white file:text-black"
                />
                {(imagePreview || formData.image) && (
                  <img
                    src={imagePreview || formData.image}
                    alt="Preview"
                    className="mt-2 w-24 h-24 object-cover rounded"
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Domain *</label>
                  <select
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className="w-full p-2 bg-black border border-gray-700 rounded text-white"
                  >
                    {DOMAINS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs uppercase text-gray-400 mb-1">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2 bg-black border border-gray-700 rounded text-white"
                  >
                    {ROLES.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">LinkedIn</label>
                <Input
                  value={formData.linkedin}
                  onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                  className="bg-black border-gray-700"
                  placeholder="https://linkedin.com/in/..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">GitHub</label>
                <Input
                  value={formData.github}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  className="bg-black border-gray-700"
                  placeholder="https://github.com/..."
                />
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Instagram</label>
                <Input
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="bg-black border-gray-700"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={loading} className="bg-white text-black">
                  {loading ? "Saving..." : editingId ? "Update" : "Create"}
                </Button>
                <Button type="button" variant="ghost" onClick={resetForm} className="text-gray-400">
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMembers.map((member) => (
          <div key={member._id} className="border border-gray-700 p-3 rounded bg-[#111]">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-40 object-cover rounded"
            />

            <p className="mt-2 font-medium">{member.name}</p>
            <p className="text-xs text-gray-500">{member.domain} • {member.role}</p>

            <div className="flex gap-2 mt-2">
              {member.linkedin && (
                <a
                  href={member.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  LinkedIn
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-400 hover:text-white"
                >
                  GitHub
                </a>
              )}
              {member.instagram && (
                <a
                  href={member.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-pink-400 hover:text-pink-300"
                >
                  Instagram
                </a>
              )}
            </div>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleEdit(member)}
                className="flex items-center gap-1 text-sm text-gray-300 hover:text-white"
              >
                <Pencil size={14} />
              </button>
              <button
                onClick={() => handleDelete(member._id)}
                className="flex items-center gap-1 text-sm text-red-400 hover:text-red-300"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          No team members found. Add one to get started.
        </p>
      )}
    </div>
  );
};

export default TeamMemberManager;