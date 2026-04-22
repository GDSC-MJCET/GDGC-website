import axios from 'axios'
import React, { useEffect } from 'react'
import { useState } from "react"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
// import {logo} from './assets/gdg-logo'
import { Linkedin, Github, Twitter } from "lucide-react";
import instaLogo from "../assets/instagram.png";
import leetcodeLogo from "../assets/leetcode.png";


const SocialsPopup = ({ showPopUp, setShowPopUp, auth, initialData }) => {

const [error, setError] = useState("");

 const [form, setForm] = useState({
    linkedin: initialData?.linkedin || "",
    github: initialData?.github || "",
    instagram: initialData?.instagram || "",
    twitter: initialData?.twitter || "",
    leetcode: initialData?.leetcode || ""
  });

useEffect(() => {
  if (initialData) {
    setForm({
      linkedin: initialData.linkedin || "",
      github: initialData.github || "",
      instagram: initialData.instagram || "",
      twitter: initialData.twitter || "",
      leetcode: initialData.leetcode || ""
    });
  }
}, [initialData]);

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

  setError(""); // clear error if valid

  console.log("saving form:", form);


    axios.post(import.meta.env.VITE_SERVER+"/api/v1/socials", form, {
      headers: {
        Authorization: `Bearer ${auth?.token}`
      }
    })
    .then(() => {
        console.log("saving form:", form);
      setShowPopUp(false);
    })
    .catch((err) => {
      console.log(err);
    });
  };

  if (!showPopUp) return null;


return (
    <div className='fixed inset-0 bg-black flex items-center justify-center z-50'>
  <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <div className="w-full max-w-lg space-y-6">

      <div className="bg-card rounded-2xl border shadow-lg p-6 space-y-6 animate-in fade-in zoom-in-95">
        
        {/* titlee */}
        <div className="space-y-1">
          <h1 className="text-xl font-semibold">Socials</h1>
          <p className="text-sm text-muted-foreground">
            Add at least one social link to continue.
          </p>
        </div>

        {/* inputs/form:-- */}
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
                {/* <Code className="h-4 w-4 text-yellow-500" /> */}
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

        {/* Error ke liye */}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
        <Button className="w-full" onClick={handleSave}>
          Save & Continue
        </Button>

      </div>
    </div>
  </div>
  </div>
);
};


export default SocialsPopup;