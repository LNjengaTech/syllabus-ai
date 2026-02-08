"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/src/lib/supabase";
import { useUser } from "@clerk/nextjs";
import { Upload, FileText, Loader2, Crown } from "lucide-react";
import Link from "next/link";

export default function UploadZone() {
  const { user } = useUser();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCount, setUploadCount] = useState(0);
  const [isPremium, setIsPremium] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const supabase = createClient();

  //fetch subscription status on mount
  useEffect(() => {
    async function fetchStatus() {
      if (!user) return;

      try {
        const response = await fetch('/api/subscription/status');
        const data = await response.json();

        setUploadCount(data.uploadCount || 0);
        setIsPremium(data.isPremium || false);
        setLimitReached(!data.allowed);
      } catch (error) {
        console.error('Failed to fetch subscription status:', error);
      }
    }

    fetchStatus();
  }, [user]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    try {
      setIsUploading(true);

      //prepare unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;

      //upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('syllabi')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      //Save reference to Supabase Database
      const { error: dbError } = await supabase
        .from('course_files')
        .insert({
          user_id: user.id,
          file_url: uploadData.path,
          file_name: file.name
        });

      if (dbError) throw dbError;

      //trigger AI Ingestion
      const ingestRes = await fetch("/api/ingest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileUrl: uploadData.path,
          fileId: fileName
        }),
      });

      const ingestData = await ingestRes.json();

      if (!ingestRes.ok) {
        //check if it's a paywall error
        if (ingestData.upgradeRequired) {
          setLimitReached(true);
          alert(ingestData.message + "\n\nRedirecting to pricing page...");
          window.location.href = "/pricing";
          return;
        }
        throw new Error(ingestData.error || "AI Processing failed");
      }

      alert("Syllabus uploaded and AI is ready!");

      //refresh subscription status
      const statusRes = await fetch('/api/subscription/status');
      const statusData = await statusRes.json();
      setUploadCount(statusData.uploadCount || 0);
      setLimitReached(!statusData.allowed);
    } catch (error: unknown) {
      console.error("Upload Error:", error);
      alert(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/*subscription status banner */}
      {!isPremium && (
        <div className="p-4 bg-linear-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">
                Free Tier: {uploadCount}/3 uploads used
              </p>
              {limitReached && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                  Upload limit reached !
                </p>
              )}
            </div>
            <Link href="/pricing">
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-semibold hover:bg-blue-700">
                <Crown className="w-4 h-4" />
                Upgrade
              </button>
            </Link>
          </div>
        </div>
      )}

      {isPremium && (
        <div className="p-4 bg-linear-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-600" />
            <p className="text-sm font-semibold">Premium Member - Unlimited Uploads this month</p>
          </div>
        </div>
      )}

      {/*Upload Zone */}
      <div className="w-full p-8 border-2 border-dashed border-gray-300 dark:border-gray-400 rounded-xl bg-card text-center">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept=".pdf"
          onChange={handleUpload}
          disabled={isUploading || limitReached}
        />
        <label
          htmlFor="file-upload"
          className={`cursor-pointer flex flex-col items-center gap-4 ${limitReached ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isUploading ? (
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400" />
          )}
          <div>
            <p className="text-lg font-semibold">
              {limitReached ? '🔒 Upgrade to upload more' : 'Click to upload PDF'}
            </p>
            <p className="text-sm text-muted-foreground">PDF files only (Max 5MB)</p>
          </div>
        </label>
      </div>
    </div>
  );
}