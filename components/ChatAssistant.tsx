"use client";

import { useState } from "react";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Chat Window (placeholder for future implementation) */}
      {isOpen && (
        <div className="fixed bottom-20 sm:bottom-24 right-4 sm:right-6 left-4 sm:left-auto w-[calc(100%-2rem)] sm:w-80 h-[70vh] sm:h-96 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 animate-in slide-in-from-bottom duration-300">
          {/* Header */}
          <div className="bg-spice-500 px-4 py-3 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">
                  SpiceJax Assistant
                </h3>
                <p className="text-spice-100 text-xs">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-spice-700 rounded-full p-1 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Chat Body */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
            <div className="space-y-3">
              {/* Welcome Message */}
              <div className="flex items-start space-x-2">
                <div className="w-6 h-6 bg-gradient-to-br from-spice-400 to-spice-600 rounded-full flex items-center justify-center text-white text-xs flex-shrink-0">
                  🤖
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm max-w-[80%]">
                  <p className="text-sm text-gray-800">
                    Hi! I'm your SpiceJax marketing assistant. How can I help you today?
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    I can help with content ideas, scheduling, analytics, and more!
                  </p>
                </div>
              </div>

              {/* Suggested Actions */}
              <div className="space-y-2 pt-2">
                <button className="w-full p-2 bg-white hover:bg-spice-50 rounded-lg text-left text-sm text-gray-700 shadow-sm transition-colors">
                  ✍️ Generate content ideas
                </button>
                <button className="w-full p-2 bg-white hover:bg-spice-50 rounded-lg text-left text-sm text-gray-700 shadow-sm transition-colors">
                  📅 Check today's schedule
                </button>
                <button className="w-full p-2 bg-white hover:bg-spice-50 rounded-lg text-left text-sm text-gray-700 shadow-sm transition-colors">
                  📊 Show performance metrics
                </button>
              </div>
            </div>
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask me anything..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-spice-500 focus:border-transparent"
                disabled
              />
              <button
                className="p-2 bg-gradient-to-r from-spice-500 to-spice-600 hover:from-spice-600 hover:to-spice-700 text-white rounded-lg transition-all disabled:opacity-50"
                disabled
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              Coming soon: AI-powered assistance
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-5 sm:bottom-6 right-5 sm:right-6 w-12 h-12 sm:w-14 sm:h-14 bg-spice-500 hover:bg-spice-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center z-50 group"
        aria-label="Chat Assistant"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6 transform group-hover:rotate-90 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            className="w-6 h-6 transform group-hover:scale-110 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
        
        {/* Notification Badge */}
        <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-[#8bc53f] rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold border-2 border-white text-white">
          3
        </span>
      </button>
    </>
  );
}
