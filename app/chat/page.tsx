"use client";

import { useState, useRef, useEffect } from "react";
import MainLayout from "@/components/MainLayout";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Hey! I'm your SpiceJax marketing assistant. I can help you create content, check trends, schedule posts, and more. Try asking me something like:\n\n• 'Make me a TikTok post for Birria blend'\n• 'What's trending this week for spicy ramen?'\n• 'Schedule an Instagram post for tomorrow'\n• 'Generate 3 caption ideas for our new blend'",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // TODO: Call n8n workflow to process the message
    // For now, simulate response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "🤖 I understand you want to create content! I'll trigger the appropriate n8n workflow to handle this request. This will be connected to your actual workflows soon.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "🌮 Create a TikTok post for Birria blend",
    "📸 Generate Instagram captions",
    "🔥 What's trending for spicy food?",
    "📅 Schedule a post for tomorrow",
    "✨ Upscale my product image",
    "💡 Give me content ideas",
  ];

  return (
    <MainLayout>
      <div className="h-[calc(100vh-120px)] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#8bc53f] to-[#77a933] rounded-xl p-6 text-white mb-6">
          <h1 className="text-3xl font-bold mb-2">Chat Assistant</h1>
          <p className="text-white/80">
            Ask me anything about content creation, trends, or scheduling
          </p>
        </div>

        {/* Chat Container */}
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 sm:p-4 ${
                    message.role === "user"
                      ? "bg-[#8bc53f] text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-2 ${
                      message.role === "user" ? "text-white/70" : "text-gray-500"
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 rounded-2xl p-4">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <p className="text-xs text-gray-500 mb-2 font-medium">Quick prompts:</p>
              <div className="flex flex-wrap gap-2">
              {quickPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => setInput(prompt)}
                  className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-gray-100 hover:border-[#8bc53f] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex gap-3 flex-col sm:flex-row">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything... (Press Enter to send)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#8bc53f] resize-none text-sm sm:text-base"
                rows={2}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="px-4 py-2 bg-[#8bc53f] text-white font-semibold rounded-xl hover:bg-[#77a933] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

