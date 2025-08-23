"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { ApiResponse } from "@/types/ApiResponse";
import { Loader2 } from "lucide-react";
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
      console.log(res);

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
    <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-b from-indigo-50 to-white py-4 px-4">
      <Card className="w-full max-w-4xl p-6 rounded-2xl">
        <h1 className="text-4xl font-bold text-center">Send me a message</h1>
        <p className="text-gray-500 text-center mb-2">
          Your identity will stay{" "}
          <span className="font-semibold">anonymous</span>.
        </p>

        {/* Input */}
        <Textarea
          placeholder="Write your anonymous message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mb-4 p-4 resize-none h-28 rounded-xl"
        />

        {/* Send button */}
        <Button
          onClick={handleSendMessage}
          disabled={isSending}
          className="w-full text-white rounded-xl font-semibold py-3 cursor-pointer"
        >
          {isSending ? <Loader2 className="animate-spin" /> : "Send Message"}
        </Button>

        {/* Suggestion heading */}

        <Button
          className="mt-4 w-max cursor-pointer"
          onClick={handleGetSuggestions}
          disabled={loadingSuggestions}
        >
          Suggested Messages
        </Button>

        <div className="mt-3 flex flex-col gap-3 border-2 border-black/20 py-6 px-6 rounded-xl">
          {loadingSuggestions ? (
            <div className="flex flex-col gap-3">
              {[...Array(3)].map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-10 w-full rounded-full bg-gray-200 animate-pulse"
                />
              ))}
            </div>
          ) : (
            suggestions.map((s, idx) => (
              <button
                key={idx}
                onClick={() => setMessage(s)}
                className="px-4 py-3 rounded-full border text-sm bg-gray-100 hover:bg-indigo-100 hover:border-indigo-400 transition cursor-pointer"
              >
                {s}
              </button>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

export default PublicMessagePage;
