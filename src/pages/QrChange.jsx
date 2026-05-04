import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const QrChange = () => {
  const auth   = JSON.parse(localStorage.getItem("AuthState"));
  const server = import.meta.env.VITE_SERVER?.replace(/\/$/, "");
  const nav    = useNavigate();

  const [destination,   setDestination]   = useState("");
  const [currentUrl,    setCurrentUrl]    = useState("");
  const [showPopUp,     setShowPopUp]     = useState(false);
  const [checkingAuth,  setCheckingAuth]  = useState(true);
  const [fetchError,    setFetchError]    = useState(null);

  // Fetch current QR destination once on mount
  useEffect(() => {
    if (!auth?.token) { nav("/login"); return; }

    axios
      .get(`${server}/data`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      })
      .then((res) => {
        const dest = res.data?.data?.destination ?? "";
        setCurrentUrl(dest);
        // If still the default placeholder, open the change panel straight away
        if (!dest || dest === "https://gdgcmjcet.in/login") {
          setShowPopUp(true);
        }
      })
      .catch((err) => {
        // Don't redirect to login — just show an inline error
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          nav("/login");
        } else {
          setFetchError("Couldn't load your QR data. Please refresh.");
        }
      })
      .finally(() => setCheckingAuth(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  const handleSave = () => {
    if (
      !destination.startsWith("http://") &&
      !destination.startsWith("https://")
    ) {
      return toast.error("Please enter a valid link starting with http or https");
    }

    axios
      .post(
        `${server}/redirect`,
        { destination },
        { headers: { Authorization: `Bearer ${auth.token}` } }
      )
      .then((data) => {
        if (data.data.success) {
          toast.success("Successfully saved");
          setCurrentUrl(destination);
          setDestination("");
          setShowPopUp(false);
        }
      })
      .catch(() => toast.error("There was an error while saving your changes"));
  };

  if (checkingAuth) return <div className="bg-black min-h-screen" />;

  return (
    <div className="min-h-screen flex mt-30 justify-center bg-background px-4">
      <Toaster />

      <div className="w-full max-w-lg space-y-6">
        {fetchError && (
          <p className="text-sm text-rose-400 bg-rose-400/10 border border-rose-400/20 rounded-lg px-4 py-3">
            {fetchError}
          </p>
        )}

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

        {/* Change panel */}
        {showPopUp && (
          <div className="bg-card rounded-2xl border shadow-lg p-6 space-y-6 animate-in fade-in zoom-in-95">
            <div className="space-y-1">
              <h1 className="text-xl font-semibold">QR Settings</h1>
              <p className="text-sm text-muted-foreground">
                Set the link users will be redirected to when they scan your QR code.
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
