//a clean UI for students to drop their PDFs to be uploaded to Supabase Storage and referenced in the Database

"use client";

import { useState } from "react";
import { createClient } from "@/src/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { Upload, FileText, Loader2 } from "lucide-react";

export default function UploadZone() {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const supabase = createClient();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);
      
      // 1. Upload file to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      
      const { data, error: uploadError } = await supabase.storage
        .from('syllabi')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. Save file reference to Database
      const { error: dbError } = await supabase
        .from('course_files')
        .insert({
          user_id: user.id,
          file_url: data.path,
          file_name: file.name
        });

      if (dbError) throw dbError;

      alert("File uploaded successfully!");
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto p-8 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl bg-card text-center">
      <input 
        type="file" 
        id="file-upload" 
        className="hidden" 
        accept=".pdf" 
        onChange={handleUpload}
        disabled={isUploading}
      />
      <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4">
        {isUploading ? (
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        ) : (
          <Upload className="w-12 h-12 text-gray-400" />
        )}
        <div>
          <p className="text-lg font-semibold">Click to upload syllabus</p>
          <p className="text-sm text-muted-foreground">PDF files only (Max 5MB)</p>
        </div>
      </label>
    </div>
  );
}