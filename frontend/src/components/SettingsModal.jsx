// frontend/src/components/SettingsModal.jsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import api from '../api';

const SettingsModal = ({ open, onOpenChange }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file first.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('profile_pic', file);

    try {
      await api.post('/api/doctor/profile-pic', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success("Profile picture updated!");
      onOpenChange(false);
      // Reload to see changes. In a real app, you might update state instead.
      setTimeout(() => globalThis.location.reload(), 1500);
    } catch{
      toast.error("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Doctor Settings</DialogTitle>
          <DialogDescription>Update your profile information.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <label className="font-medium">Upload Profile Picture</label>
          <Input type="file" onChange={handleFileChange} accept="image/png, image/jpeg" />
        </div>
        <DialogFooter>
          <Button onClick={handleUpload} disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload Picture"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;