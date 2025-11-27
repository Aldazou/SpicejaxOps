"use client";

import { useEffect, useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Download, ExternalLink, ImageIcon, Loader2, RefreshCw, Sparkles } from "lucide-react";

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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-brand-gold to-gold-600 flex items-center justify-center shadow-lg shadow-brand-gold/20">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <p className="uppercase tracking-[0.3em] text-[10px] font-bold text-brand-gold">
                Assets
              </p>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Content Library
            </h1>
            <p className="text-brand-text/70 mt-1 text-sm">
              Your approved renders, ready to deploy
            </p>
          </div>
          <button
            onClick={fetchLibrary}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-brand-gold/30 rounded-2xl hover:bg-brand-sage hover:border-brand-gold transition-all text-sm font-semibold text-brand-text shadow-sm disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {error && (
          <div className="p-4 bg-rust-50 text-brand-rust rounded-2xl border border-brand-rust/20 text-sm">
            {error}
          </div>
        )}

        {loading && files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-brand-text/50">
            <div className="relative">
              <div className="absolute inset-0 bg-brand-lime/20 rounded-full blur-xl animate-pulse"></div>
              <Loader2 className="w-10 h-10 animate-spin text-brand-lime relative" />
            </div>
            <p className="mt-4 font-medium">Loading your library...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-brand-text/50 bg-white rounded-3xl border-2 border-dashed border-brand-gold/30">
            <div className="w-16 h-16 rounded-2xl bg-brand-sage flex items-center justify-center mb-4 border border-brand-gold/20">
              <ImageIcon className="w-8 h-8 text-brand-text/30" />
            </div>
            <p className="font-semibold text-brand-title">No images yet</p>
            <p className="text-sm mt-1">Approved enhancements will appear here</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {files.map((file, index) => (
              <div
                key={file.id}
                className="group relative bg-white rounded-3xl border border-brand-gold/20 overflow-hidden shadow-[0_2px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_40px_-8px_rgba(212,168,75,0.2)] hover:border-brand-gold/40 transition-all duration-500"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Image */}
                <div className="aspect-square relative bg-brand-sage overflow-hidden">
                  {file.id ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={`https://lh3.googleusercontent.com/d/${file.id}=w800`}
                      alt={file.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        if (!img.dataset.fallback) {
                          img.dataset.fallback = "true";
                          img.src = `https://drive.google.com/thumbnail?id=${file.id}&sz=w800`;
                        }
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-brand-text/30">
                      <ImageIcon className="w-12 h-12" />
                    </div>
                  )}
                  
                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Actions */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                    <a
                      href={file.webViewLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur rounded-xl hover:bg-white transition-colors shadow-lg text-sm font-semibold text-brand-text"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </a>
                    {file.webContentLink && (
                      <a
                        href={file.webContentLink}
                        className="flex items-center justify-center w-10 h-10 bg-brand-rust rounded-xl hover:bg-rust-600 transition-colors shadow-lg"
                        title="Download"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </a>
                    )}
                  </div>
                  
                  {/* Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white/90 backdrop-blur text-[10px] font-bold uppercase tracking-wider text-brand-text rounded-lg shadow-sm border border-brand-gold/20">
                      PNG
                    </span>
                  </div>
                </div>
                
                {/* Info */}
                <div className="p-4">
                  <p className="text-sm font-semibold text-brand-title truncate" title={file.name}>
                    {file.name.replace(/\.[^/.]+$/, "")}
                  </p>
                  <p className="text-xs text-brand-text/50 mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-lime"></span>
                    Synced from Drive
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
