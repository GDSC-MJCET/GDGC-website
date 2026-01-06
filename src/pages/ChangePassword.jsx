import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import {Eye,EyeOff} from "lucide-react";

const ChangePassword = () => {
  const auth = JSON.parse(localStorage.getItem("AuthState"));
  const [newPassword,setNewPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword,setShowConfirmPassword] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [checkingAuth, setCheckingAuth]=useState(true)
  const server = import.meta.env.VITE_SERVER
  const nav =  useNavigate()
  if (!auth?.loggedIn) {
    toast.error("Please log in first");
    nav('/login')
  }
  useEffect(() => {
      if (!auth?.token) {
    nav("/login");
    return;
  }
  axios
    .get(`${server}/api/v1/auth/simple-verify`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
    .then((res) => {
      if (!res.data.success){
        nav("/login")
      }
      else if(res.data.success){
        setCheckingAuth(false)
      }
    })
    .catch((err) => {
      
    });
}, [auth?.token]);
if(checkingAuth){
    return <div className="bg-black"></div>
}
  const handleSave = () => {
    if(newPassword.length<6||confirmPassword.length<6){
        toast.error("Password should be of minimum 6 characters")
    }
    if(newPassword!=confirmPassword){
        return toast.error("Passwords must be the same")
    }
    setIsLoading(true);
    const password = newPassword
    axios
      .post(
        import.meta.env.VITE_SERVER+ "/api/v1/auth/change-password",
        { password },
        {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        }
      )
      .then((data) => {
        if (data.data.success) {
          toast.success("Successfully saved");
        }
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response?.status === 401) {
         if (err.response?.data?.message === "It's the same password") {
             return toast.error("The password is the same as the old password");
    }
        return toast.error("There was an error while saving your changes " + er);
      }}).finally(()=>{

      setIsLoading(false)
    });
  };

 return (
  <div className="min-h-screen flex mt-30 justify-center bg-background px-4">
    <Toaster />

    <div className="w-full max-w-lg space-y-3">
        <h1 className="text-xl font-semibold">Change Password</h1>
      {/* Current URL Display */}
        <label className="text-sm font-medium text-muted-foreground" for="new-password">
          New Password
        </label>
        <div className="relative">
        <Input
            type={showNewPassword ? "text" : "password"}
            id="new-password"
            value={newPassword}
            className="bg-muted/40 text-foreground"
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            required
            
          />
        <button
        type="button"
        onClick={() => setShowNewPassword((prev) => !prev)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
        {showNewPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>

        </div>
        <label className="text-sm font-medium text-muted-foreground" for="confirm-password">
          Confirm Password
        </label>
        <div className="relative">
        <Input
            type={showConfirmPassword ?"text":"password"}
            value={confirmPassword}
            id="confirm-password"
            className="bg-muted/40 text-foreground"
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
             required
        />
        <button
        type="button"
        onClick={() => setShowConfirmPassword((prev) => !prev)}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-600">
        {showConfirmPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
        </div>
        <Button className="w-full" onClick={handleSave}
        >
           
              <span className="relative z-10">
            {isLoading ? "Saving" : "Save"}
        </span>
          </Button>
        </div>
    </div>

);

};

export default ChangePassword;