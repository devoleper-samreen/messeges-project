"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

function PublicMessagePage() {
  const params = useParams<{ username: string }>();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([
    "What’s your favorite movie?",
    "Do you have any pets?",
    "What’s your dream job?",
  ]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // send
  const handleSendMessage = async () => {
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }

    setIsSending(true);
    try {
      const response = await axios.post("/api/send-messages", {
        username: params.username,
        content: message,
      });

      setMessage("");

      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error((error as AxiosError<ApiResponse>).response?.data.message);
    } finally {
      setIsSending(false);
    }
  };

  const handleGetSuggestions = async () => {
    setLoadingSuggestions(true);
    try {
      const res = await axios.post("/api/suggest-message");

      // split the AI string by '||' to get array
      const suggestionList = res.data.split("||").map((s: string) => s.trim());
      setSuggestions(suggestionList);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch suggestions");
    } finally {
      setLoadingSuggestions(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-6 px-4 md:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-4xl transition-all duration-700 ease-out">
        <Card className="p-8 bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-500">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Send Me a Message
          </h1>
          <p className="text-gray-300 text-center mb-6 text-lg">
            Your identity stays{" "}
            <span className="font-semibold text-purple-400">anonymous</span> in
            the stars.
          </p>

          {/* Input */}
          <div className="group mb-1">
            <Textarea
              placeholder="Write your anonymous message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="p-4 resize-none h-32 rounded-xl bg-white/5 border border-white/10 text-gray-300 text-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 group-hover:scale-[1.02] group-hover:border-purple-400"
            />
          </div>

          {/* Send Button */}
          <div className="group relative mb-2">
            <Button
              onClick={handleSendMessage}
              disabled={isSending}
              className="w-full text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl font-semibold py-6 text-lg transition-all duration-300 relative overflow-hidden cursor-pointer"
            >
              {isSending ? (
                <Loader2 className="h-10 w-10 animate-spin text-white text-2xl" />
              ) : (
                <span className="relative z-10">Send Message</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
            </Button>
          </div>

          {/* Suggestion Heading */}
          <div className="flex justify-center">
            <Button
              onClick={handleGetSuggestions}
              disabled={loadingSuggestions}
              className="relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 cursor-pointer"
            >
              <Sparkles className="h-5 w-5 text-white mr-2" />
              <span>Suggested Messages</span>
            </Button>
          </div>

          {/* Suggestions */}
          <div className="mt-6 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl transition-all duration-500">
            {loadingSuggestions ? (
              <div className="flex flex-col gap-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="h-12 w-full rounded-full bg-white/10 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setMessage(s)}
                  className="cursor-pointer group relative w-full px-4 py-3 mb-3 rounded-full bg-white/10 border border-white/10 text-gray-300 text-sm hover:bg-purple-500/20 hover:border-purple-400 hover:text-white transition-all duration-300 ease-in-out transform hover:scale-[1.03] overflow-hidden"
                  style={{ transitionDelay: `${idx * 100}ms` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative z-10">{s}</span>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Floating Particles */}
        <div className="fixed top-20 left-10 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-60"></div>
        <div className="fixed top-40 right-20 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-40 delay-1000"></div>
      </div>
    </div>
  );
}

export default PublicMessagePage;
