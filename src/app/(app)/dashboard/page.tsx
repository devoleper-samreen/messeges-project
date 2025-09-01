"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/user";
import { acceptMessageSchema } from "@/schemas/accepMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw, Link as LinkIcon, Sparkles } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Page() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const { data: session, status } = useSession();
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState<boolean>(true);

  const username = (session?.user as User)?.username || "";
  const [baseUrl, setBaseUrl] = useState("");
  const profileUrl = baseUrl ? `${baseUrl}/u/${username}` : "";

  useEffect(() => {
    if (typeof window !== "undefined") {
      setBaseUrl(`${window.location.protocol}//${window.location.host}`);
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessage");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitching(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue("acceptMessage", response.data?.isAcceptingMessages ?? false);
    } catch (error) {
      const AxiosErrror = error as AxiosError<ApiResponse>;
      toast.error(AxiosErrror.response?.data.message);
    } finally {
      setIsSwitching(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh?: boolean) => {
      setIsLoading(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);

        if (refresh === true) {
          toast.success("Refreshed messages");
        }
      } catch (error) {
        const AxiosErrror = error as AxiosError<ApiResponse>;
        toast.error(AxiosErrror.response?.data.message);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  const fetchAnalytics = useCallback(async () => {
    setIsAnalyticsLoading(true);
    try {
      const response = await axios.get("/api/analyze-messages");
      console.log("AI response", response.data.aiResult);

      if (response.data.success) {
        setAnalytics(response.data.aiResult || {});
      }
    } catch (error) {
      const AxiosErrror = error as AxiosError<ApiResponse>;
      toast.error(
        AxiosErrror.response?.data.message || "Failed to fetch analytics"
      );
    } finally {
      setIsAnalyticsLoading(false);
    }
  }, []);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessage", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const AxiosErrror = error as AxiosError<ApiResponse>;
      toast.error(AxiosErrror.response?.data.message);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchAcceptMessages();
    fetchAnalytics();
  }, [fetchAcceptMessages, fetchMessages, setValue, fetchAnalytics]);

  // Calculate total messages for progress bar percentages
  const totalMessages =
    analytics?.clusters?.reduce(
      (sum: any, cluster: any) => sum + cluster.messages.length,
      0
    ) || 1;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 md:px-8 lg:mx-auto relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        <div className="relative z-10 max-w-6xl mx-auto">
          <Skeleton className="h-12 w-64 mb-8 bg-white/10 rounded-2xl" />
          <div className="mb-8">
            <Skeleton className="h-6 w-48 mb-4 bg-white/10 rounded-2xl" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-full bg-white/10 rounded-2xl" />
              <Skeleton className="h-12 w-24 bg-white/10 rounded-2xl" />
            </div>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-6 w-12 bg-white/10 rounded-full" />
            <Skeleton className="h-6 w-32 bg-white/10 rounded-2xl" />
            <Skeleton className="h-12 w-16 bg-white/10 rounded-2xl ml-auto" />
          </div>
          <Skeleton className="h-px w-full bg-white/10 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-40 w-full bg-white/10 rounded-3xl"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 md:px-8 lg:mx-auto relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Copy Link Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3 text-gray-300 flex items-center justify-center space-x-2">
            <LinkIcon className="w-5 h-5 text-purple-400" />
            <span>Share Your Unique Link</span>
          </h2>
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="w-full rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-4 py-3 text-gray-300 text-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 font-semibold"
            />
            <Button
              onClick={copyToClipboard}
              className="cursor-pointer group relative inline-flex items-center justify-center px-8 py-5 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
            >
              <span className="relative z-10">Copy</span>
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
            </Button>
          </div>
        </div>
        {/* Analytics Section */}
        <div className="mb-8 relative">
          <h2 className="text-lg font-semibold mb-3 text-gray-300 flex items-center justify-center space-x-2">
            <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
            <span>Audience Insights</span>
          </h2>
          {isAnalyticsLoading ? (
            <div className="p-6 bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-xl border border-white/10 rounded-3xl">
              <Skeleton className="h-6 w-48 mb-4 bg-white/10 rounded-2xl" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="mb-4">
                    <Skeleton className="h-5 w-64 mb-2 bg-white/10 rounded-2xl" />
                    <Skeleton className="h-4 w-full bg-white/10 rounded-2xl" />
                    <Skeleton className="h-2 w-3/4 bg-white/10 rounded-full mt-2" />
                  </div>
                ))}
              </div>
            </div>
          ) : analytics?.clusters && analytics.clusters.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {analytics.clusters.map((cluster: any, index: any) => (
                <TooltipProvider key={index}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className="group relative overflow-hidden p-4 bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-xl border border-white/10 rounded-3xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10">
                          <h3 className="text-base font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                            {cluster.title}
                          </h3>
                          <p className="text-gray-300 text-sm mb-2">
                            {cluster.messages.length}{" "}
                            {cluster.messages.length === 1
                              ? "message"
                              : "messages"}
                          </p>
                          <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"
                              style={{
                                width: `${(cluster.messages.length / totalMessages) * 100}%`,
                                animation: `pulse 2s ease-in-out ${index * 0.2}s`,
                              }}
                            ></div>
                          </div>
                          {cluster.messages.length > 0 && (
                            <p className="text-gray-400 text-xs mt-2 italic bg-white/5 backdrop-blur-md px-2 py-1 rounded-md">
                              Example: "{cluster.messages[0]}"
                            </p>
                          )}
                        </div>
                        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <div className="absolute inset-0 rounded-3xl border-2 border-purple-500/30 animate-pulse"></div>
                          <Sparkles className="absolute top-2 right-2 w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-xl border border-white/10 text-gray-300 max-w-xs">
                      <p>Top messages:</p>
                      <ul className="list-disc list-inside">
                        {cluster.messages
                          .slice(0, 3)
                          .map((msg: any, i: any) => (
                            <li key={i} className="text-sm">
                              {msg}
                            </li>
                          ))}
                      </ul>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">
              No analytics data available. Share your link to collect more
              feedback!
            </p>
          )}

          {/* Subtle background particles */}
          <div className="absolute top-0 left-0 w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-30"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-30 delay-1000"></div>
        </div>
        ;{/* Switch and Refresh Button Section */}
        <div className="mb-6 flex items-center justify-between gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
          <div className="flex items-center gap-4">
            <Switch
              {...register("acceptMessage")}
              checked={acceptMessages}
              onCheckedChange={handleSwitchChange}
              disabled={isSwitching}
              className="data-[state=checked]:bg-purple-500"
            />
            <span className="text-gray-300">
              Accept Messages:{" "}
              <span
                className={`${
                  acceptMessages ? "text-green-400" : "text-red-400"
                } font-semibold`}
              >
                {acceptMessages ? "On" : "Off"}
              </span>
            </span>
          </div>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              fetchMessages(true);
            }}
            className="cursor-pointer group relative inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-white border border-white/10 bg-white/5 backdrop-blur-md rounded-2xl hover:bg-white/10 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-purple-400" />
            ) : (
              <RefreshCcw className="h-5 w-5 text-purple-400" />
            )}
            <span className="ml-2 text-purple-400 hover:text-purple-500">
              Refresh Messages
            </span>
          </Button>
        </div>
        <Separator className="bg-white/10 mb-6" />
        {/* Messages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Skeleton
                key={i}
                className="h-40 w-full bg-white/10 rounded-3xl animate-pulse"
              />
            ))
          ) : messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message._id as string}
                className="group relative overflow-hidden border-0 bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-xl rounded-3xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <MessageCard
                  message={message}
                  onMessageDelete={handleDeleteMessage}
                />
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 rounded-3xl border-2 border-purple-500/30 animate-pulse"></div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 col-span-2">
              No messages to display. Share your link to receive anonymous
              messages!
            </p>
          )}
        </div>
        {/* Floating Elements */}
        <div className="fixed top-20 left-10 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-60"></div>
        <div className="fixed top-40 right-20 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-40 delay-1000"></div>
      </div>
    </div>
  );
}

export default Page;
