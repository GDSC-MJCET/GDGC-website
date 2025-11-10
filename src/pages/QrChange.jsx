import React from "react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";

const QrChange = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-background px-4">
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

        <Button className="w-full">Save Changes</Button>
      </div>
    </div>
  );
};

export default QrChange;