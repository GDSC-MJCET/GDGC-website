import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Linkedin, Github, Twitter } from "lucide-react";
import instaLogo from "../assets/instagram.png";
import leetcodeLogo from "../assets/leetcode.png";

const Socials = () => {

  const auth = JSON.parse(localStorage.getItem("AuthState"));

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    linkedin: "",
    github: "",
    instagram: "",
    twitter: "",
    leetcode: ""
  });

  // fetching  existing socials
  useEffect(() => {
    axios.get(import.meta.env.VITE_SERVER + "/api/v1/socials/me", {
      headers: {
        Authorization: `Bearer ${auth?.token}`
      }
    })
    .then((res) => {
      const data = res.data.data;
      if (data) {
        setForm({
          linkedin: data.linkedin || "",
          github: data.github || "",
          instagram: data.instagram || "",
          twitter: data.twitter || "",
          leetcode: data.leetcode || ""
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }, []);

  const handleSave = () => {

    if (
      !form.linkedin &&
      !form.github &&
      !form.instagram &&
      !form.twitter &&
      !form.leetcode
    ) {
      setError("Please add at least one social");
      return;
    }

    setError("");

    axios.post(import.meta.env.VITE_SERVER + "/api/v1/socials", form, {
      headers: {
        Authorization: `Bearer ${auth?.token}`
      }
    })
    .then(() => {

    })
    .catch((err) => {
      console.log(err);
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-lg space-y-6">

        <div className="bg-card rounded-2xl border shadow-lg p-6 space-y-6 animate-in fade-in zoom-in-95">
          
          {/* title */}
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Socials</h1>
            <p className="text-sm text-muted-foreground">
              Add at least one social link to continue.
            </p>
          </div>

          {/* inputs */}
          <div className="space-y-4">

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-blue-600" />
                <label className="text-sm font-medium">LinkedIn</label>
              </div>
              <Input
                placeholder="https://linkedin.com/in/your-username"
                value={form.linkedin}
                onChange={(e) =>
                  setForm({ ...form, linkedin: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4 text-black dark:text-white" />
                <label className="text-sm font-medium">GitHub</label>
              </div>
              <Input
                placeholder="https://github.com/your-username"
                value={form.github}
                onChange={(e) =>
                  setForm({ ...form, github: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img src={instaLogo} className="h-5 w-5" />
                <label className="text-sm font-medium">Instagram</label>
              </div>            
              <Input
                placeholder="https://instagram.com/your-username"
                value={form.instagram}
                onChange={(e) =>
                  setForm({ ...form, instagram: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <img src={leetcodeLogo} className="h-5 w-5" />
                <label className="text-sm font-medium">LeetCode</label>
              </div>
              <Input
                placeholder="https://leetcode.com/your-username"
                value={form.leetcode}
                onChange={(e) =>
                  setForm({ ...form, leetcode: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Twitter className="h-4 w-4 text-sky-500" />
                <label className="text-sm font-medium">Twitter / X</label>
              </div>            
              <Input
                placeholder="https://twitter.com/your-username"
                value={form.twitter}
                onChange={(e) =>
                  setForm({ ...form, twitter: e.target.value })
                }
              />
            </div>

          </div>

          {/* error */}
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          <Button className="w-full" onClick={handleSave}>
            Save & Continue
          </Button>

        </div>
      </div>
    </div>
  )
}

export default Socials;
