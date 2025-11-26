"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import Image from "next/image";
import { Download, ExternalLink, ImageIcon, Loader2, RefreshCw } from "lucide-react";

interface DriveFile {
  id: string;
  name: string;
  webViewLink: string;
  thumbnailLink?: string;
  webContentLink?: string;
}

export default function LibraryPage() {
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLibrary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/library/list");
      const data = await res.json();
      if (data.files) {
        setFiles(data.files);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load library images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibrary();
  }, []);

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="uppercase tracking-[0.4em] text-xs text-gray-400 mb-2">
              Assets
            </p>
            <h1 className="text-3xl font-bold text-gray-900">Content Library</h1>
          </div>
          <button
            onClick={fetchLibrary}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition text-sm font-semibold text-gray-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
            {error}
          </div>
        )}

        {loading && files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#8bc53f]" />
            <p>Loading your drive content...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
            <p>No images found in your library folder.</p>
            <p className="text-sm mt-2">Approved enhancements will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {files.map((file) => (
              <div
                key={file.id}
                className="group relative bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="aspect-square relative bg-gray-100">
                  {/* Use thumbnailLink if available, otherwise try to build a direct image URL from file id */}
                  {file.thumbnailLink || file.id ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        file.thumbnailLink
                          ? file.thumbnailLink.replace("=s220", "=s800")
                          : `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`
                      }
                      alt={file.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // If thumbnail fails, hide the broken image
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300">
                      <ImageIcon className="w-10 h-10" />
                    </div>
                  )}
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                      title="View in Drive"
                    >
                      <ExternalLink className="w-5 h-5 text-gray-700" />
                    </a>
                    {file.webContentLink && (
                      <a
                        href={file.webContentLink}
                        className="p-2 bg-white rounded-full hover:bg-gray-100 transition"
                        title="Download"
                      >
                        <Download className="w-5 h-5 text-gray-700" />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    From Google Drive
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}

