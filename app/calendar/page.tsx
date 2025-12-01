"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import Image from "next/image";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, ThumbsUp, Share2, Repeat2, Eye, Pin } from "lucide-react";

interface ScheduledPost {
  id: string;
  day: string;
  time: string;
  platform: string;
  format?: string; // e.g., "InstagramSquare", "FacebookLandscape", "PinterestPin"
  content: string;
  image?: string;
  productName?: string;
  status: "scheduled" | "posted" | "draft";
}

// Get aspect ratio based on format
function getAspectRatio(format?: string): string {
  if (!format) return "aspect-square";
  
  const f = format.toLowerCase();
  
  // Instagram formats
  if (f.includes("instagramsquare") || f.includes("ig-square")) return "aspect-square";
  if (f.includes("instagramportrait") || f.includes("ig-portrait") || f.includes("4:5")) return "aspect-[4/5]";
  if (f.includes("instagramstory") || f.includes("instagramreel") || f.includes("ig-story") || f.includes("ig-reel")) return "aspect-[9/16]";
  if (f.includes("instagramlandscape") || f.includes("ig-landscape")) return "aspect-[1.91/1]";
  
  // Facebook formats
  if (f.includes("facebooklandscape") || f.includes("fb-landscape")) return "aspect-[1.91/1]";
  if (f.includes("facebooksquare") || f.includes("fb-square")) return "aspect-square";
  if (f.includes("facebookstory") || f.includes("fb-story")) return "aspect-[9/16]";
  
  // TikTok - always vertical
  if (f.includes("tiktok")) return "aspect-[9/16]";
  
  // Pinterest - tall pins
  if (f.includes("pinterest")) return "aspect-[2/3]";
  
  // LinkedIn
  if (f.includes("linkedin")) return "aspect-[1.91/1]";
  
  // YouTube - always 16:9
  if (f.includes("youtube")) return "aspect-video";
  
  // Twitter/X
  if (f.includes("twitter") || f.includes("x-")) return "aspect-[16/9]";
  
  // E-commerce (WooCommerce, Amazon, Etsy)
  if (f.includes("woo") || f.includes("amazon") || f.includes("etsy")) return "aspect-square";
  
  // Print formats
  if (f.includes("print")) return "aspect-[4/5]";
  
  // Default to square
  return "aspect-square";
}

// Platform brand colors
const PLATFORM_COLORS: Record<string, { bg: string; accent: string; text: string }> = {
  Instagram: { bg: "#fafafa", accent: "#e1306c", text: "#262626" },
  Facebook: { bg: "#f0f2f5", accent: "#1877f2", text: "#050505" },
  TikTok: { bg: "#000000", accent: "#fe2c55", text: "#ffffff" },
  Twitter: { bg: "#ffffff", accent: "#1da1f2", text: "#0f1419" },
  X: { bg: "#000000", accent: "#ffffff", text: "#e7e9ea" },
  LinkedIn: { bg: "#f3f2ef", accent: "#0a66c2", text: "#000000" },
  Pinterest: { bg: "#ffffff", accent: "#e60023", text: "#111111" },
  YouTube: { bg: "#0f0f0f", accent: "#ff0000", text: "#ffffff" },
};

// Platform SVG Icons
const PlatformIcon = ({ platform, size = 24 }: { platform: string; size?: number }) => {
  switch (platform) {
    case "Instagram":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <defs>
            <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFDC80" />
              <stop offset="25%" stopColor="#FCAF45" />
              <stop offset="50%" stopColor="#F77737" />
              <stop offset="75%" stopColor="#F56040" />
              <stop offset="100%" stopColor="#C13584" />
            </linearGradient>
          </defs>
          <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#ig-grad)" strokeWidth="2" fill="none"/>
          <circle cx="12" cy="12" r="4" stroke="url(#ig-grad)" strokeWidth="2" fill="none"/>
          <circle cx="17.5" cy="6.5" r="1.5" fill="url(#ig-grad)"/>
        </svg>
      );
    case "Facebook":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#1877F2">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      );
    case "TikTok":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" fill="#ff0050"/>
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" fill="#00f2ea" style={{transform: "translate(-2px, -2px)"}}/>
        </svg>
      );
    case "LinkedIn":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#0A66C2">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      );
    case "Pinterest":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#E60023">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"/>
        </svg>
      );
    case "YouTube":
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#FF0000">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      );
    default:
      return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="#666">
          <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" fill="none"/>
        </svg>
      );
  }
};

// Platform-specific post preview components
const InstagramPreview = ({ post }: { post: ScheduledPost }) => {
  const aspectClass = getAspectRatio(post.format);
  const isStory = post.format?.toLowerCase().includes("story") || post.format?.toLowerCase().includes("reel");
  
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-lg mx-auto border border-gray-200 ${isStory ? "max-w-[280px]" : "max-w-[375px]"}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-[2px]">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
              <span className="text-xs font-bold">SJ</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">spicejax</p>
            <p className="text-xs text-gray-500">Sponsored</p>
          </div>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-600" />
      </div>
      
      {/* Image - uses format-based aspect ratio */}
      {post.image && (
        <div className={`relative w-full ${aspectClass} bg-black`}>
          <Image src={post.image} alt="Post" fill className="object-cover" />
        </div>
      )}
      
      {/* Actions */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <Heart className="w-6 h-6 text-gray-900 cursor-pointer hover:text-gray-600" />
            <MessageCircle className="w-6 h-6 text-gray-900 cursor-pointer hover:text-gray-600" />
            <Send className="w-6 h-6 text-gray-900 cursor-pointer hover:text-gray-600" />
          </div>
          <Bookmark className="w-6 h-6 text-gray-900 cursor-pointer hover:text-gray-600" />
        </div>
        <p className="text-sm font-semibold text-gray-900 mb-1">1,247 likes</p>
        <p className="text-sm text-gray-900">
          <span className="font-semibold">spicejax</span>{" "}
          <span className="whitespace-pre-line">{post.content.slice(0, 150)}{post.content.length > 150 ? "..." : ""}</span>
        </p>
        <p className="text-xs text-gray-400 mt-2 uppercase">Just now</p>
      </div>
    </div>
  );
};

const FacebookPreview = ({ post }: { post: ScheduledPost }) => {
  const aspectClass = getAspectRatio(post.format);
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-[500px] mx-auto border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <div className="w-10 h-10 rounded-full bg-[#8bc53f] flex items-center justify-center">
          <span className="text-white font-bold text-sm">SJ</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">SpiceJax</p>
          <p className="text-xs text-gray-500">Just now · 🌎</p>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
      </div>
      
      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-900 whitespace-pre-line text-[15px]">{post.content}</p>
      </div>
      
      {/* Image - uses format-based aspect ratio */}
      {post.image && (
        <div className={`relative w-full ${aspectClass} bg-gray-100`}>
          <Image src={post.image} alt="Post" fill className="object-cover" />
        </div>
      )}
      
      {/* Reactions */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-gray-500 text-sm mb-3">
          <div className="flex items-center gap-1">
            <span className="flex -space-x-1">
              <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px]">👍</span>
              <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px]">❤️</span>
            </span>
            <span className="ml-1">423</span>
          </div>
          <span>47 comments · 12 shares</span>
        </div>
        <div className="flex items-center justify-around pt-2 border-t border-gray-100">
          <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg">
            <ThumbsUp className="w-5 h-5" /> Like
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg">
            <MessageCircle className="w-5 h-5" /> Comment
          </button>
          <button className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-4 py-2 rounded-lg">
            <Share2 className="w-5 h-5" /> Share
          </button>
        </div>
      </div>
    </div>
  );
};

const TikTokPreview = ({ post }: { post: ScheduledPost }) => (
  <div className="bg-black rounded-2xl overflow-hidden shadow-2xl max-w-[325px] mx-auto relative">
    {/* Full screen video style - 9:16 */}
    {post.image && (
      <div className="relative w-full aspect-[9/16] bg-black">
        <Image src={post.image} alt="Post" fill className="object-cover" />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        
        {/* Right side actions */}
        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs mt-1">24.5K</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs mt-1">892</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Bookmark className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs mt-1">1,204</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Share2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-white text-xs mt-1">Share</span>
          </div>
        </div>
        
        {/* Bottom content */}
        <div className="absolute bottom-4 left-3 right-16">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#8bc53f] flex items-center justify-center">
              <span className="text-white font-bold text-xs">SJ</span>
            </div>
            <span className="text-white font-semibold text-sm">@spicejax</span>
            <button className="px-3 py-1 border border-[#fe2c55] text-[#fe2c55] text-xs font-semibold rounded">Follow</button>
          </div>
          <p className="text-white text-sm line-clamp-2">{post.content.slice(0, 100)}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-white/80 text-xs">🎵 Original sound - SpiceJax</span>
          </div>
        </div>
      </div>
    )}
  </div>
);

const LinkedInPreview = ({ post }: { post: ScheduledPost }) => {
  const aspectClass = getAspectRatio(post.format);
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg max-w-[550px] mx-auto border border-gray-200">
      {/* Header */}
      <div className="flex items-start gap-3 p-4">
        <div className="w-12 h-12 rounded-full bg-[#8bc53f] flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold">SJ</span>
        </div>
        <div className="flex-1">
          <p className="font-semibold text-gray-900">SpiceJax</p>
          <p className="text-xs text-gray-500">2,847 followers</p>
          <p className="text-xs text-gray-400">Just now · 🌐</p>
        </div>
        <MoreHorizontal className="w-5 h-5 text-gray-500" />
      </div>
      
      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-gray-900 whitespace-pre-line text-sm leading-relaxed">{post.content}</p>
      </div>
      
      {/* Image - uses format-based aspect ratio */}
      {post.image && (
        <div className={`relative w-full ${aspectClass} bg-[#f3f2ef]`}>
          <Image src={post.image} alt="Post" fill className="object-cover" />
        </div>
      )}
      
      {/* Reactions */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-gray-500 text-xs mb-3">
          <div className="flex items-center gap-1">
            <span className="flex -space-x-1">
              <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-white text-[8px]">👍</span>
              <span className="w-4 h-4 rounded-full bg-green-600 flex items-center justify-center text-white text-[8px]">👏</span>
              <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[8px]">❤️</span>
            </span>
            <span className="ml-1">1,247</span>
          </div>
          <span>89 comments · 34 reposts</span>
        </div>
        <div className="flex items-center justify-around pt-2 border-t border-gray-100">
          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded text-sm">
            <ThumbsUp className="w-4 h-4" /> Like
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded text-sm">
            <MessageCircle className="w-4 h-4" /> Comment
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded text-sm">
            <Repeat2 className="w-4 h-4" /> Repost
          </button>
          <button className="flex items-center gap-1 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded text-sm">
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </div>
    </div>
  );
};

const PinterestPreview = ({ post }: { post: ScheduledPost }) => (
  <div className="bg-white rounded-3xl overflow-hidden shadow-xl max-w-[300px] mx-auto">
    {/* Pin Image - 2:3 Pinterest ratio */}
    {post.image && (
      <div className="relative w-full aspect-[2/3] bg-gray-50 group">
        <Image src={post.image} alt="Pin" fill className="object-cover" />
        
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
          <div className="flex justify-end">
            <button className="bg-[#e60023] text-white font-bold px-4 py-2 rounded-full text-sm hover:bg-[#ad081b]">
              Save
            </button>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                <Share2 className="w-4 h-4 text-gray-700" />
              </button>
              <button className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                <MoreHorizontal className="w-4 h-4 text-gray-700" />
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    
    {/* Content */}
    <div className="p-3">
      <p className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
        {post.productName || "SpiceJax Blend"}
      </p>
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-[#8bc53f] flex items-center justify-center">
          <span className="text-white font-bold text-[10px]">SJ</span>
        </div>
        <span className="text-xs text-gray-600">SpiceJax</span>
      </div>
    </div>
  </div>
);

const YouTubePreview = ({ post }: { post: ScheduledPost }) => (
  <div className="bg-[#0f0f0f] rounded-xl overflow-hidden shadow-2xl max-w-[400px] mx-auto">
    {/* Video Thumbnail - 16:9 YouTube ratio */}
    {post.image && (
      <div className="relative w-full aspect-video bg-black group">
        <Image src={post.image} alt="Video" fill className="object-cover" />
        
        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-black/70 rounded-full flex items-center justify-center group-hover:bg-red-600 transition-colors">
            <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[16px] border-l-white border-b-[10px] border-b-transparent ml-1" />
          </div>
        </div>
        
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">
          0:45
        </div>
      </div>
    )}
    
    {/* Info */}
    <div className="p-3 flex gap-3">
      <div className="w-9 h-9 rounded-full bg-[#8bc53f] flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-xs">SJ</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium line-clamp-2 mb-1">
          {post.content.slice(0, 60)}...
        </p>
        <p className="text-gray-400 text-xs">SpiceJax</p>
        <p className="text-gray-400 text-xs flex items-center gap-1">
          <Eye className="w-3 h-3" /> 12K views · 2 hours ago
        </p>
      </div>
      <MoreHorizontal className="w-5 h-5 text-gray-400 flex-shrink-0" />
    </div>
  </div>
);

// Main preview renderer
const PlatformPreview = ({ post }: { post: ScheduledPost }) => {
  switch (post.platform) {
    case "Instagram":
      return <InstagramPreview post={post} />;
    case "Facebook":
      return <FacebookPreview post={post} />;
    case "TikTok":
      return <TikTokPreview post={post} />;
    case "LinkedIn":
      return <LinkedInPreview post={post} />;
    case "Pinterest":
      return <PinterestPreview post={post} />;
    case "YouTube":
      return <YouTubePreview post={post} />;
    default:
      return <InstagramPreview post={post} />;
  }
};

export default function CalendarPage() {
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);

  // Load schedule from LocalStorage on mount
  useEffect(() => {
    const savedSchedule = localStorage.getItem('spicejax_schedule');
    if (savedSchedule) {
      setScheduledPosts(JSON.parse(savedSchedule));
    }
  }, []);
  
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const getPostsForDay = (day: string) => {
    return scheduledPosts.filter((post) => post.day === day);
  };

  const handleClearSchedule = () => {
    if (confirm("Clear all scheduled posts? This cannot be undone.")) {
      localStorage.removeItem('spicejax_schedule');
      setScheduledPosts([]);
      setSelectedDay(null);
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Content Calendar</h1>
            <p className="text-gray-500 mt-2">
              View and manage your scheduled posts for the week
            </p>
          </div>
          {scheduledPosts.length > 0 && (
            <button
              onClick={handleClearSchedule}
              className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl hover:bg-red-100 transition-colors"
            >
              Clear All ({scheduledPosts.length})
            </button>
          )}
        </div>

        {/* Week Overview */}
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
          {days.map((day) => {
            const posts = getPostsForDay(day);
            const isSelected = selectedDay === day;
            
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className={`bg-white rounded-xl border-2 p-4 text-left transition-all ${
                  isSelected
                    ? "border-[#8bc53f] shadow-lg"
                    : "border-gray-200 hover:border-[#cfe7b1]"
                }`}
              >
                <div className="text-sm font-bold text-gray-500 mb-2">
                  {day}
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {posts.length}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {posts.length === 1 ? "post" : "posts"}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Details */}
        {selectedDay ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              📅 {selectedDay}'s Schedule
            </h2>

            <div className="space-y-4">
              {getPostsForDay(selectedDay).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-6xl mb-4">🌙</p>
                  <p className="text-gray-500">No posts scheduled for {selectedDay}</p>
                </div>
              ) : (
                getPostsForDay(selectedDay).map((post) => (
                  <div
                    key={post.id}
                    className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-6 hover:shadow-lg transition-all"
                  >
                    {/* Header with platform info */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                          <PlatformIcon platform={post.platform} size={24} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">{post.platform}</p>
                          <p className="text-sm text-gray-500">{post.time}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-[#eef7e2] text-[#4f7f00] text-xs font-bold rounded-full">
                        {post.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Platform-specific preview */}
                    <div className="mb-6">
                      <p className="text-xs text-gray-400 uppercase tracking-wider mb-3 text-center">
                        Preview · How it will look on {post.platform}
                      </p>
                      <PlatformPreview post={post} />
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-center">
                      <button className="px-5 py-2.5 bg-[#8bc53f] text-white font-medium rounded-xl hover:bg-[#77a933] transition-colors shadow-sm">
                        Edit
                      </button>
                      <button className="px-5 py-2.5 bg-white text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm border border-gray-200">
                        Reschedule
                      </button>
                      <button className="px-5 py-2.5 bg-white text-red-600 font-medium rounded-xl hover:bg-red-50 transition-colors shadow-sm border border-gray-200">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
            <p className="text-6xl mb-4">📆</p>
            <p className="text-gray-500 text-lg">
              Select a day to view scheduled posts
            </p>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500 mb-1">Total Scheduled</p>
            <p className="text-4xl font-bold text-gray-900">{scheduledPosts.length}</p>
            <p className="text-xs text-gray-400 mt-2">posts this week</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500 mb-1">Posted</p>
            <p className="text-4xl font-bold text-gray-900">
              {scheduledPosts.filter((p) => p.status === "posted").length}
            </p>
            <p className="text-xs text-gray-400 mt-2">this week</p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500 mb-1">Drafts</p>
            <p className="text-4xl font-bold text-gray-900">
              {scheduledPosts.filter((p) => p.status === "draft").length}
            </p>
            <p className="text-xs text-gray-400 mt-2">ready to schedule</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

