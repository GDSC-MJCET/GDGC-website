import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

const QrChange = () => {
  const auth = JSON.parse(localStorage.getItem("AuthState"));
  const [destination, setDestination] = useState("");
  const [showPopUp,setShowPopUp] = useState(false);
  const [currentUrl,setCurrentUrl] = useState("");
  const server = import.meta.env.VITE_SERVER
  const nav =  useNavigate()
  if (!auth?.loggedIn) {
    toast.error("Please log in first");
     nav('/login')
  }
  useEffect(() => {
  axios
    .get(`${server}/data`, {
      headers: {
        Authorization: `Bearer ${auth.token}`,
      },
    })
    .then((res) => {
       

      if (res.data.data.destination === "https://gdgcmjcet.in/login") {
        setShowPopUp(true);
      } else {
        setCurrentUrl(res.data.data.destination);
      }
    })
    .catch((err) => {
      
    });
}, []);

  const handleSave = () => {
    if (
      !destination.startsWith("http://") &&
      !destination.startsWith("https://")
    ) {
      return toast.error("Please enter a valid link starting with http or https");
    }

    axios
      .post(
        "http://localhost:3009"+ "/redirect",
        { destination },
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
      .catch((er) => {
        return toast.error("There was an error while saving your changes " + er);
      });
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-background px-4">
    <Toaster />

    <div className="w-full max-w-lg space-y-6">
      {/* Current URL Display */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          Current Redirect URL
        </label>

        <div className="flex gap-2">
          <Input
            value={currentUrl}
            readOnly
            className="bg-muted/40 text-foreground cursor-not-allowed"
          />

          <Button
            variant="outline"
            onClick={() => setShowPopUp((prev) => !prev)}
          >
            {showPopUp ? "Cancel" : "Change"}
          </Button>
        </div>
      </div>

      {/* Popup / Card */}
      {showPopUp && (
        <div className="bg-card rounded-2xl border shadow-lg p-6 space-y-6 animate-in fade-in zoom-in-95">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">QR Settings</h1>
            <p className="text-sm text-muted-foreground">
              Set the link users will be redirected to when they scan your QR
              code.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">New Redirect URL</label>
            <Input
              placeholder="https://example.com/your-link"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <Button className="w-full" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      )}
    </div>
  </div>
);

};

export default QrChange;