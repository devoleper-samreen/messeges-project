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
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

function Page() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const { data: session, status } = useSession();

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
    [setIsLoading, setMessages, setIsSwitching]
  );

  //handle switch case
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
  }, [fetchAcceptMessages, fetchMessages, setValue]);

  if (status === "loading") {
    return (
      <div className="my-2 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
        {/* Heading skeleton */}
        <Skeleton className="h-10 w-48 mb-6" />

        {/* Copy link section skeleton */}
        <div className="mb-8">
          <Skeleton className="h-6 w-40 mb-3" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-full rounded-xl" />
            <Skeleton className="h-10 w-20 rounded-xl" />
          </div>
        </div>

        {/* Switch skeleton */}
        <div className="mb-4 flex items-center gap-4">
          <Skeleton className="h-6 w-12 rounded-full" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-px w-full mb-4" />

        {/* Refresh button skeleton */}
        <Skeleton className="h-10 w-16 mb-6" />

        {/* Message cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3 p-4 border rounded-xl">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-10 w-24 mt-3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="my-2 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-3 text-gray-700">
          Copy Your Unique Link
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="w-full rounded-xl border border-gray-300 bg-gray-100 px-3 py-2 text-gray-600 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <Button
            onClick={copyToClipboard}
            className="rounded-xl text-white px-4 py-2 shadow cursor-pointer"
          >
            Copy
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessage")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitching}
        />
        <span className={`ml-2`}>
          Accept Messages :
          <span
            className={`${acceptMessages ? "text-green-500" : "text-red-500"} `}
          >
            {acceptMessages ? " On" : " Off"}
          </span>
        </span>
      </div>
      <Separator />
      <Button
        className="mt-4 cursor-pointer"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      {/* <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div> */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          // Show 4 skeleton cards
          Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-32 w-full rounded-xl bg-gray-200 animate-pulse"
            ></div>
          ))
        ) : messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default Page;
