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

// import axios from 'axios'
// import React, { useEffect, useState } from 'react'
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Linkedin, Github, Twitter } from "lucide-react";
// import instaLogo from "../assets/instagram.png";
// import leetcodeLogo from "../assets/leetcode.png";

// const Socials = () => {

//   const auth = JSON.parse(localStorage.getItem("AuthState"))

//   const [error, setError] = useState("");

//   const [form, setForm] = useState({
//     linkedin: "",
//     github: "",
//     instagram: "",
//     twitter: "",
//     leetcode: ""
//   });

//   // 🔥 fetch existing socials
//   useEffect(() => {
//     axios.get(import.meta.env.VITE_SERVER + "/api/v1/socials/me", {
//       headers: {
//         Authorization: `Bearer ${auth?.token}`
//       }
//     })
//     .then((res) => {
//       const data = res.data.data;
//       if (data) {
//         setForm({
//           linkedin: data.linkedin || "",
//           github: data.github || "",
//           instagram: data.instagram || "",
//           twitter: data.twitter || "",
//           leetcode: data.leetcode || ""
//         });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   }, []);

//   const handleSave = () => {

//     if (
//       !form.linkedin &&
//       !form.github &&
//       !form.instagram &&
//       !form.twitter &&
//       !form.leetcode
//     ) {
//       setError("Please add at least one social");
//       return;
//     }

//     setError("");

//     axios.post(import.meta.env.VITE_SERVER + "/api/v1/socials", form, {
//       headers: {
//         Authorization: `Bearer ${auth?.token}`
//       }
//     })
//     .then(() => {
//       alert("Saved successfully");
//     })
//     .catch((err) => {
//       console.log(err);
//     });
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-background px-4">
//       <div className="w-full max-w-lg space-y-6">

//         <div className="bg-card rounded-2xl border shadow-lg p-6 space-y-6">

//           <div className="space-y-1">
//             <h1 className="text-xl font-semibold">Edit Socials</h1>
//             <p className="text-sm text-muted-foreground">
//               Update your social links.
//             </p>
//           </div>

//           <div className="space-y-4">

//             <div>
//               <div className="flex items-center gap-2">
//                 <Linkedin className="h-4 w-4 text-blue-600" />
//                 <label>LinkedIn</label>
//               </div>
//               <Input value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} />
//             </div>

//             <div>
//               <div className="flex items-center gap-2">
//                 <Github className="h-4 w-4" />
//                 <label>GitHub</label>
//               </div>
//               <Input value={form.github} onChange={(e) => setForm({ ...form, github: e.target.value })} />
//             </div>

//             <div>
//               <div className="flex items-center gap-2">
//                 <img src={instaLogo} className="h-5 w-5" />
//                 <label>Instagram</label>
//               </div>
//               <Input value={form.instagram} onChange={(e) => setForm({ ...form, instagram: e.target.value })} />
//             </div>

//             <div>
//               <div className="flex items-center gap-2">
//                 <img src={leetcodeLogo} className="h-5 w-5" />
//                 <label>LeetCode</label>
//               </div>
//               <Input value={form.leetcode} onChange={(e) => setForm({ ...form, leetcode: e.target.value })} />
//             </div>

//             <div>
//               <div className="flex items-center gap-2">
//                 <Twitter className="h-4 w-4 text-sky-500" />
//                 <label>Twitter</label>
//               </div>
//               <Input value={form.twitter} onChange={(e) => setForm({ ...form, twitter: e.target.value })} />
//             </div>

//           </div>

//           {error && <p className="text-red-500 text-sm">{error}</p>}

//           <Button className="w-full" onClick={handleSave}>
//             Save Changes
//           </Button>

//         </div>
//       </div>
//     </div>
//   )
// }

// export default Socials;

// import { useState,useEffect } from 'react'
// import { NavLink,useNavigate } from 'react-router-dom'
// import axios from 'axios'
// import { AuthContext } from '../context/AuthContext'
// const Socials = () => {
//   const [checkingAuth,setCheckingAuth] = useState(true)
//   const nav = useNavigate()
//   const server = import.meta.env.VITE_SERVER
//   const auth = JSON.parse(localStorage.getItem("AuthState"))
//   useEffect(() => {
//     if (!auth?.token) {
//     nav("/login");
//     return;
//   }
//   axios
//     .get(`${server}/api/v1/auth/simple-verify`, {
//       headers: {
//         Authorization: `Bearer ${auth.token}`,
//       },
//     })
//     .then((res) => {
//       if (!res.data.success){
//         nav("/login")
//       }
//       else if(res.data.success){
//         setCheckingAuth(false)
//       }
//     })
//     .catch((err) => {
//       nav("/login")
//     });
// }, [auth?.token]);
// if(checkingAuth){
//     return <div className="bg-black"></div>
// }
//   return (
//     <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
//       <div className="text-center space-y-4">
//         <h1 className="text-3xl md:text-4xl font-bold text-white">
//           Socials
//         </h1>
//         <p className="text-gray-400 text-lg max-w-md mx-auto">
//           Coming Soon
//         </p>
//         <div className="flex items-center justify-center gap-2 text-sm text-gray-500 pt-2">
//           <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
//           <span>In Development</span>
//         </div>
//         <div className="pt-6 flex flex-col items-center">
//           <p className="text-gray-500 text-sm mb-3">
//             Until then, you can manage your QR redirection
//           </p>
//           <NavLink 
//             to="/team/customization/qrchange" 
//             className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
//           >
//             Change QR Redirect
//             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//             </svg>
//           </NavLink>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Socials