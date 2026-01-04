import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Navigate } from "react-router-dom";
import axios from "axios";

const QrChange = () => {
 
  const auth = JSON.parse(localStorage.getItem("AuthContext"));
  const [destination,setDestination] = useState("");

  if (!auth?.loggedIn) {
    toast.error("Please Log in First");
    return <Navigate to="/login" replace />;
  }
  const handleSave=()=> {
    console.log(destination)
    if (destination.startsWith('http://') && destination.startsWith('https://')) {
      return toast.error("please enter a valid link starting with http or https")
    }
    axios.post(import.meta.env.VITE_SERVER+"/redirect",{destination,headers:{
      Authorization:`Bearer ${auth.token}`
    }}).then((data)=>{
      if(data.data.success){
        return toast.success("Successfully saved")
      }
    }).catch((er)=>{
      return toast.error("There was an error while saving your changes "+er)
    })
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4">
      <Toaster/>
      <div className="w-full max-w-lg bg-card rounded-2xl p-6 shadow-md space-y-5 border">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">QR Settings</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Set the link you want users to be redirected to when they scan your QR code.
            This will update the destination for all future scans.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Redirect URL</label>
          <Input placeholder="https://example.com/your-link" />
        </div>

        <Button className="w-full" onClick={handleSave} value={destination} onChange={(e)=>{setDestination(e.target.value)}}>Save Changes</Button>
      </div>
    </div>
  );
};

export default QrChange;